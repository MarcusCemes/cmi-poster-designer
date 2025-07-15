<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import { Provider } from "$lib/components/ui/tooltip/index.js";

    let { children, data } = $props();
</script>

<Provider delayDuration={100}>
    <div class="flex h-screen w-full flex-col bg-neutral-50">
        <Header email={data.user.email} />
        {@render children()}
    </div>
</Provider>
