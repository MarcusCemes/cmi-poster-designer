<script lang="ts">
  import { render } from "$lib/render";
  import { generateTemplate } from "$lib/schema";
  import { app } from "$lib/store.svelte";

  $effect(() => {
    const type = app.previewType;

    render(generateTemplate(app.fields), type).then((document) => {
      if (document.ok) {
        app.error = null;

        if (app.preview) {
          URL.revokeObjectURL(app.preview[0]);
        }

        app.preview = [URL.createObjectURL(document.data), type];
      } else {
        app.error = document.error;
      }
    });
  });
</script>

<div class="_container absolute left-0 top-0 h-full w-full">
  <div class="_box relative flex items-center justify-end rounded border border-neutral-200 shadow">
    {#if app.preview}
      {#if app.preview[1] === "pdf"}
        <iframe class="h-full w-full rounded" src={app.preview[0]} title="Preview"></iframe>
      {:else}
        <img
          alt="Poster"
          class="pointer-events-none h-full w-full object-cover"
          src={app.preview[0]}
        />
      {/if}
    {/if}
  </div>
</div>

<style>
  ._container {
    container-type: size;
    container-name: resize-box;
  }

  ._box {
    aspect-ratio: 0.707;
    width: 100%;
  }

  @container resize-box (aspect-ratio > 0.707) {
    ._box {
      width: auto;
      height: 100%;
    }
  }
</style>
