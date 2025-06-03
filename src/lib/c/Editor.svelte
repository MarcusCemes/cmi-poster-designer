<script lang="ts">
  import Errors from "$lib/components/errors.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
  import { SCHEMA } from "$lib/schema";
  import { app } from "$lib/store.svelte";

  function handleUpload(event: Event & { currentTarget: HTMLInputElement }, id: string) {
    const [file] = event.currentTarget.files ?? [];

    if (!file) return;

    convertToBase64(file).then((base64) => {
      app.fields[id] = base64;
    });
  }

  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
</script>

<Card.Root class="flex-1">
  <Card.Header>
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Editor</h1>
      <Toggle
        bind:pressed={
          () => app.previewType === "pdf", (value) => (app.previewType = value ? "pdf" : "svg")
        }>PDF</Toggle
      >

      <Errors />
    </div>
  </Card.Header>

  <Card.Content>
    <div class="flex w-full max-w-sm flex-col gap-1.5">
      {#each SCHEMA as block}
        {@const id = `field-${block.id}`}

        <div>{block.id}</div>

        {#if block.type === "text"}
          <Label for={id}>{block.id}</Label>
          <Textarea {id} bind:value={app.fields[block.id]} />
        {:else if block.type === "image"}
          <Label for={id}>{block.id}</Label>
          <Input onchange={(event) => handleUpload(event, block.id)} type="file" />
        {:else}
          <div class="text-sm text-red-500">
            Unsupported block type: {(block as any).type}
          </div>
        {/if}
      {/each}
    </div>
  </Card.Content>
</Card.Root>
