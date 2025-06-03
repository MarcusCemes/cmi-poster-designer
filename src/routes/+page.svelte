<script lang="ts">
  import Editor from "$lib/c/Editor.svelte";
  import Viewer from "$lib/c/Viewer.svelte";
</script>

<div class="flex flex-1">
  <div class="relative m-12 flex-1">
    <Viewer />
  </div>

  <div class="relative m-12 flex-1">
    <Editor />
  </div>
</div>
