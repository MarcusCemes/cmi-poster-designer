<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { render } from "$lib/render";
  import { generateTemplate } from "$lib/schema";
  import { app } from "$lib/store.svelte";
  import { downloadBlob } from "$lib/utils";
  import DownloadIcon from "@lucide/svelte/icons/arrow-right-from-line";

  function onclick() {
    render(generateTemplate(app.fields), "pdf").then((blob) => {
      if (blob.ok) {
        downloadBlob(blob.data, app.name);
      }
    });
  }
</script>

<Button {onclick} variant="secondary">
  <DownloadIcon class="size-4" /> Export
</Button>
