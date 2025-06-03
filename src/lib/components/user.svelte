<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost">
        <Avatar.Root class="rounded-lg">
          <Avatar.Fallback>DU</Avatar.Fallback>
        </Avatar.Root>

        <div class="grid text-left text-sm leading-tight">
          <span class="truncate font-semibold">Dev User</span>
          <span class="truncate text-xs font-normal">dev.user@epfl.ch</span>
        </div>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>

  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Item class="cursor-pointer">Profile</DropdownMenu.Item>
    <DropdownMenu.Item class="cursor-pointer">Settings</DropdownMenu.Item>
    <DropdownMenu.Item class="cursor-pointer">Logout</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
