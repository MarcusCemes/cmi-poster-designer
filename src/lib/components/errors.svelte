<script lang="ts">
  import { app } from "$lib/store.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import CheckIcon from "@lucide/svelte/icons/check";
  import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";
  import { Button } from "./ui/button/index.js";
</script>

{#if app.error}
  <Dialog.Root>
    <Dialog.Trigger>
      {#snippet child({ props })}
        <Button {...props}>
          <CircleAlertIcon class="size-4" /> Generation error
        </Button>
      {/snippet}
    </Dialog.Trigger>

    <Dialog.Content>
      <Dialog.Header>Generation error</Dialog.Header>
      <Dialog.Description>The following errors were reported by Typst.</Dialog.Description>

      <pre>{app.error}</pre>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <div class="items-center-2 flex select-none text-sm font-semibold text-green-500">
    <CheckIcon /> No problems
  </div>
{/if}
