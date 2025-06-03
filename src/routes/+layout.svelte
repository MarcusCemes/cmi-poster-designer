<script lang="ts">
  import "../app.css";

  import { Separator } from "$lib/components/ui/separator/index.js";
  import HeaderSave from "$lib/components/header/header-save.svelte";
  import HeaderLoad from "$lib/components/header/header-load.svelte";
  import User from "$lib/components/user.svelte";
  import epflLogo from "$lib/images/logos/epfl.svg";
  import { Toaster } from "svelte-sonner";
  import Download from "$lib/components/header/download.svelte";

  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <div class="container flex items-center justify-between px-4 py-2">
    <a class="flex items-center gap-6" href="/">
      <img alt="EPFL logo" class="h-6" src={epflLogo} />
      <h2 class="text-xl">CMi Poster Designer</h2>
    </a>

    <div class="flex gap-2">
      <HeaderLoad />
      <HeaderSave />
      <Download />
      <User />
    </div>
  </div>

  <Separator />

  <main class="container relative flex flex-1 flex-col">
    {@render children?.()}
  </main>
</div>

<Toaster />
