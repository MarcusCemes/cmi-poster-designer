<script lang="ts">
    import logo from "$lib/images/cmi.svg";
    import { LogOutIcon } from "@lucide/svelte";
    import { Button } from "./ui/button/index.js";

    interface Props {
        email: string;
    }

    let { email }: Props = $props();
</script>

<header class="bg-background sticky top-0 z-50 flex h-16 items-center gap-4 border-b px-4 md:px-6">
    <a href="/" class="flex items-center gap-2 font-semibold">
        <img alt="Logo" class="h-5" src={logo} />
        <span>Poster Designer</span>
    </a>

    <div class="ml-auto flex items-center gap-4">
        <div class="text-sm font-medium">{email}</div>
    </div>

    <Button href="/sign-out" size="icon" variant="ghost">
        <LogOutIcon class="size-4" />
    </Button>
</header>
