<script lang="ts">
    import SignInForm from "$lib/components/SignInForm.svelte";

    let { form } = $props();
</script>

<div class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-3xl">
        <SignInForm error={form?.message} />
    </div>
</div>
