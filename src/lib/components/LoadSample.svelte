<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { isEmptyObject } from "$lib/misc";
    import { appState, sampleFormData } from "$lib/state.svelte";
    import { SwatchBookIcon } from "@lucide/svelte";
    import { mergeProps } from "bits-ui";

    let open = $state(false);

    function onclick() {
        if (!isEmptyObject(appState.formData)) {
            open = true;
        } else {
            onconfirm();
        }
    }

    function onconfirm() {
        appState.queueImmediate = true;
        appState.formData = sampleFormData();
        open = false;
    }
</script>

<Popover.Root bind:open>
    <Popover.Trigger>
        {#snippet child({ props: popoverProps })}
            <Tooltip.Root>
                <Tooltip.Trigger>
                    {#snippet child({ props: tooltipProps })}
                        <Button
                            {...mergeProps(tooltipProps, popoverProps)}
                            {onclick}
                            class="cursor-pointer"
                            variant="secondary"
                            size="icon"
                        >
                            <SwatchBookIcon class="size-4" />
                        </Button>
                    {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content>Sample poster</Tooltip.Content>
            </Tooltip.Root>
        {/snippet}
    </Popover.Trigger>

    <Popover.Content class="p-4">
        <p class="text-sm">
            Are you sure you want to load a sample poster? <span class="font-bold"
                >You will lose your current progress.</span
            >
        </p>

        <div class="mt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onclick={() => (open = false)}>Cancel</Button>
            <Button onclick={onconfirm} variant="destructive" size="sm">Confirm</Button>
        </div>
    </Popover.Content>
</Popover.Root>
