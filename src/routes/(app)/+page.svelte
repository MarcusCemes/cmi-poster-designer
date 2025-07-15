<script lang="ts">
    import { dev } from "$app/environment";
    import { beforeNavigate } from "$app/navigation";
    import LoadSample from "$lib/components/LoadSample.svelte";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Toggle } from "$lib/components/ui/toggle/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { debounce, isEmptyObject } from "$lib/misc";
    import { appState, createFormData, sampleFormData } from "$lib/state.svelte";
    import { DownloadIcon, EraserIcon, ZoomInIcon } from "@lucide/svelte";
    import clsx from "clsx";
    import { untrack } from "svelte";
    import { Spring } from "svelte/motion";

    const ZOOM_SCALE = 3;
    const A4_WIDTH = 210;
    const A4_HEIGHT = 297;

    let previewSvg = $state<string | null>(null);
    let loading = $state(false);
    let error = $state<string | null>(null);

    // This will hold the STABLE geometry of the frame, captured once on mouseenter.
    let staticRect = $state<DOMRect>();
    let enableZoom = $state(false);

    // Mouse position relative to the top-left of the stable frame.
    let mouseX = $state(0);
    let mouseY = $state(0);

    let svgEl = $state<SVGSVGElement>();
    let nativeDimensions = $derived(computeNativeDimensions());

    const viewBox = new Spring(computeViewBox());

    beforeNavigate(({ cancel }) => {
        if (
            !dev &&
            !confirm(
                "Are you sure you want to leave this page? You have unsaved changes that will be lost.",
            )
        ) {
            {
                cancel();
            }
        }
    });

    $effect(() => {
        if (!previewSvg) {
            svgEl = undefined;
        }
    });

    $effect(() => {
        if (svgEl) {
            viewBox.target = computeViewBox();
        }
    });

    $effect(() => {
        const { x, y, w, h } = viewBox.current;
        svgEl?.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    });

    $effect(() => {
        // Read entire object to react to changes in nested properties
        traverseObject(appState.formData);

        const immediateRender = untrack(() => appState.queueImmediate);

        if (immediateRender || isEmptyObject(appState.formData)) {
            appState.queueImmediate = false;
            renderPreview();
        } else {
            debouncedRender();
        }
    });

    function traverseObject(object: any) {
        for (const value of Object.values(object)) {
            if (typeof value === "object" && value !== null) {
                traverseObject(value);
            }
        }
    }

    function computeNativeDimensions() {
        const match = previewSvg?.match(/viewBox="[^"]*?\s+[^"]*?\s+([0-9.]+)\s+([0-9.]+)"/);

        if (match && match[1] && match[2]) {
            return { w: parseFloat(match[1]), h: parseFloat(match[2]) };
        }

        return { w: A4_WIDTH, h: A4_HEIGHT };
    }

    function computeViewBox() {
        const { w: nativeWidth, h: nativeHeight } = nativeDimensions;

        if (staticRect && enableZoom) {
            // Zoom IN
            const targetWidth = nativeWidth / ZOOM_SCALE;
            const targetHeight = nativeHeight / ZOOM_SCALE;

            const normX = Math.max(0, Math.min(1, mouseX / staticRect.width));
            const normY = Math.max(0, Math.min(1, mouseY / staticRect.height));

            const targetX = normX * (nativeWidth - targetWidth);
            const targetY = normY * (nativeHeight - targetHeight);

            return { x: targetX, y: targetY, w: targetWidth, h: targetHeight };
        }

        return { x: 0, y: 0, w: nativeWidth, h: nativeHeight };
    }

    async function renderPreview() {
        if (isEmptyObject(appState.formData)) {
            previewSvg = null;
            return;
        }

        loading = true;
        error = null;

        try {
            const response = await fetch("/api/render/svg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appState.formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "An unknown error occurred.");
            }

            previewSvg = await response.text();
        } catch (e: any) {
            error = e.message;
            previewSvg = null;
        } finally {
            loading = false;
        }
    }

    const debouncedRender = debounce(renderPreview, 500);

    async function handleFileChange(event: Event, index: number) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
            appState.formData.figures[index].image = "";
            return;
        }

        if (file) {
            const response = await fetch("/api/convert", {
                method: "POST",
                headers: {
                    "Content-Type": file.type,
                    "Content-Length": file.size.toString(),
                },
                body: file,
            });

            // convert to a base64 string and set as the figure
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "An unknown error occurred.");
            }

            const blob = await response.blob();
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result) {
                    console.log(reader.result);
                    appState.formData.figures[index].image = reader.result as string;
                }
            };

            reader.readAsDataURL(blob);
        }

        // Read the file into a fetch request

        // if (file) {
        //     const reader = new FileReader();

        //     reader.onload = () => {
        //         if (reader.result) {

        //         }

        //         appState.formData.figures[index].image = reader.result as string;
        //     };

        //     reader.readAsDataURL(file);
        // }
    }

    function handleMouseEnter(event: MouseEvent) {
        const eventTarget = event.currentTarget as HTMLDivElement;
        const svgElement = eventTarget.querySelector("svg");

        if (svgElement) {
            staticRect = eventTarget.getBoundingClientRect();
            svgEl = svgElement;
        }
    }

    function handleMouseLeave() {
        staticRect = undefined;
    }

    function handleMouseMove(event: MouseEvent) {
        if (staticRect) {
            mouseX = event.clientX - staticRect.left;
            mouseY = event.clientY - staticRect.top;
        }
    }

    function ondelete() {
        appState.formData = createFormData();
    }

    async function ondownload() {
        loading = true;
        error = null;

        try {
            const response = await fetch("/api/render/pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appState.formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "An unknown error occurred.");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${appState.formData.title || "poster"}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e: any) {
            error = e.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-8 p-4 md:grid-cols-2 md:p-8">
    <aside class="relative hidden md:block">
        <div class="absolute inset-0 flex items-center justify-center gap-4">
            <Tooltip.Root>
                <Tooltip.Trigger>
                    {#snippet child({ props })}
                        <Toggle {...props} bind:pressed={enableZoom}>
                            <ZoomInIcon class="size-4" />
                        </Toggle>
                    {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content>Toggle cursor zoom</Tooltip.Content>
            </Tooltip.Root>

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="relative aspect-[210/297] h-full max-w-full overflow-hidden rounded border bg-gray-100 shadow-2xl transition-opacity"
                class:opacity-50={loading}
                onmouseenter={handleMouseEnter}
                onmouseleave={handleMouseLeave}
                onmousemove={handleMouseMove}
            >
                {#if previewSvg}
                    <div class="h-full w-full [&>svg]:h-full [&>svg]:w-full">
                        {@html previewSvg}
                    </div>
                {:else}
                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center p-4 text-neutral-300 select-none"
                    >
                        <!-- <PaintbrushIcon class="size-4" /> -->
                        <p class="mt-2 text-2xl font-medium">Poster Designer</p>
                    </div>
                {/if}

                {#if error}
                    <div
                        class="bg-destructive absolute right-4 bottom-4 left-4 rounded-md p-4 text-white"
                    >
                        <h4 class="font-bold">Error Generating Poster</h4>
                        <p>{error}</p>
                    </div>
                {/if}
            </div>
        </div>
    </aside>

    <Card class="overflow-y-auto">
        <CardHeader class="flex">
            <div class="flex-1">
                <CardTitle>Poster Details</CardTitle>
                <CardDescription>Fill out the form below to generate your poster.</CardDescription>
            </div>

            <div class="flex gap-2">
                <LoadSample />

                <Tooltip.Root>
                    <Tooltip.Trigger
                        disabled={isEmptyObject(appState.formData)}
                        class={clsx(
                            buttonVariants({ size: "icon", variant: "secondary" }),
                            "cursor-pointer",
                        )}
                        onclick={ondownload}
                    >
                        <DownloadIcon class="size-4" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>Download PDF</Tooltip.Content>
                </Tooltip.Root>

                <Tooltip.Root>
                    <Tooltip.Trigger
                        class={clsx(
                            buttonVariants({ size: "icon", variant: "secondary" }),
                            "cursor-pointer",
                        )}
                        onclick={ondelete}
                    >
                        <EraserIcon class="size-4" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>Clear Form</Tooltip.Content>
                </Tooltip.Root>

                <Button class="cursor-pointer">Save</Button>
            </div>
        </CardHeader>

        <CardContent class="space-y-4">
            <div>
                <Label class="mb-1" for="title">Title</Label>
                <Input bind:value={appState.formData.title} id="title" />
            </div>
            <div>
                <Label class="mb-1" for="authors">Authors</Label>
                <Input bind:value={appState.formData.authors} id="authors" />
            </div>
            <div>
                <Label class="mb-1" for="affiliation">Affiliation</Label>
                <Input bind:value={appState.formData.affiliation} id="affiliation" />
            </div>
            <div>
                <Label class="mb-1" for="objective">Objective</Label>
                <Textarea bind:value={appState.formData.objective} id="objective" />
            </div>
            <div>
                <Label class="mb-1" for="perspectives">Perspectives & Development</Label>
                <Textarea bind:value={appState.formData.perspectives} id="perspectives" />
            </div>
            <div>
                <Label class="mb-1" for="publication">Publication</Label>
                <Input bind:value={appState.formData.publication} id="publication" />
            </div>
            <div>
                <Label class="mb-1" for="funding">Funding</Label>
                <Input bind:value={appState.formData.funding} id="funding" />
            </div>

            <Separator class="my-6" />

            <div class="space-y-4">
                <h3 class="text-lg font-medium">Images</h3>
                {#each appState.formData.figures as _, i}
                    <div class="space-y-2 rounded-md border p-4">
                        <Label class="mb-1"
                            >Image {i + 1}
                            {#if i < 2}(Required){:else}(Optional){/if}</Label
                        >
                        <Input
                            type="file"
                            accept="image/*"
                            onchange={(e) => handleFileChange(e, i)}
                        />

                        <Label class="mb-1" for="caption{i + 1}">Caption {i + 1}</Label>
                        <Input
                            id="caption{i + 1}"
                            bind:value={appState.formData.figures[i].caption}
                        />
                    </div>
                {/each}
            </div>
        </CardContent>
    </Card>
</div>
