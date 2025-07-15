<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import background from "$lib/images/sign-in.avif";
    import * as Alert from "./ui/alert/index.js";
    import { AlertCircleIcon } from "@lucide/svelte";
    import Noise from "./misc/Noise.svelte";

    interface Props {
        error?: string;
    }

    let { error }: Props = $props();

    const id = $props.id();
</script>

<div class="flex flex-col gap-6">
    <Card.Root class="overflow-hidden p-0">
        <Card.Content class="grid min-h-[32rem] p-0 md:grid-cols-2">
            <form class="relative p-6 md:p-8" method="POST">
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col items-center text-center">
                        <h1 class="text-2xl font-bold">Welcome back</h1>
                        <p class="text-muted-foreground text-balance">
                            Login to your CMi Events account
                        </p>
                    </div>
                    <div class="grid gap-3">
                        <Label for="email-{id}">Email</Label>
                        <Input
                            id="email-{id}"
                            name="email"
                            type="email"
                            placeholder="poster.designer@epfl.ch"
                            required
                        />
                    </div>

                    <Button type="submit" class="w-full">Login</Button>

                    {#if error}
                        <Alert.Root variant="destructive">
                            <AlertCircleIcon />
                            <Alert.Title>Sign-in failure</Alert.Title>
                            <Alert.Description>{error}</Alert.Description>
                        </Alert.Root>
                    {/if}
                </div>
            </form>

            <!-- svelte-ignore a11y_missing_attribute -->
            <div class="bg-muted pointer-events-none relative hidden md:block">
                <img
                    alt="SwissTech Convention Center"
                    src={background}
                    class="absolute inset-0 h-full w-full object-cover"
                />

                <Noise size={4} />
            </div>
        </Card.Content>
    </Card.Root>
</div>
