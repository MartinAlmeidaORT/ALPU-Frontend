<script lang="ts">
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import type { TableUser } from './columns';
  import { APPROVE_USER_MUTATION } from '$lib/graphql/queries/user';
  import { UserState, type UpdateUserStateInput } from '$lib/graphql/schema';
  import type { Client } from '@urql/svelte';
  import { createUrqlClient } from '$lib/graphql/client';
  import { invalidateAll } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/state';

  let { user }: { user: TableUser } = $props();

  const getMenuItems = (state: string) => {
    if (state === 'PENDING') {
      return [{ label: 'Aprobar', action: 'approve' }];
    }
    return [];
  };

  const menuItems = $derived(getMenuItems(user.userState));

  const handleAction = async (action: string, userId: string) => {
    if (action === 'approve') {
      const input: UpdateUserStateInput = {
        userId: Number(userId),
        newState: UserState.Enabled,
      };
      const urqlClient: Client = createUrqlClient(page.data.token);
      const result = await urqlClient
        .mutation(APPROVE_USER_MUTATION, { input })
        .toPromise();
      if (result.error) {
        toast.error('Error al aprobar usuario: ' + result.error.message);
      } else {
        await invalidateAll();
        toast.success('Usuario aprobado exitosamente');
      }
    }
  };
</script>

{#if menuItems.length > 0}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          size="icon"
          class="relative size-8 p-0"
        >
          <span class="sr-only">Open menu</span>
          <EllipsisIcon />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>Acciones</DropdownMenu.Label>
        {#each menuItems as item (item.action)}
          <DropdownMenu.Item
            onclick={() => handleAction(item.action, String(user.userId))}
          >
            {item.label}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{:else}
  <div class="size-8"></div>
{/if}
