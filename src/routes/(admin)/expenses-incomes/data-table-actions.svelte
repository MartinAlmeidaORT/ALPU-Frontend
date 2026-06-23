<script lang="ts">
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import type { TableBill } from './columns';
  import { getContext } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import {
    GET_BILL_URL_QUERY,
    DELETE_BILL_MUTATION,
  } from '$lib/graphql/queries/bills';
  import type { Client } from '@urql/svelte';
  import { createUrqlClient } from '$lib/graphql/client';
  import { toast } from 'svelte-sonner';

  let token = getContext('token') as string;
  let { bill }: { bill: TableBill } = $props();

  const getMenuItems = () => {
    return [
      { label: 'Ver comprobante', action: 'ver' },
      { label: 'Borrar comprobante', action: 'borrar' },
    ];
  };

  const handleAction = async (action: string, billId: string) => {
    if (action === 'ver') {
      const urqlClient: Client = createUrqlClient(token);
      const result = await urqlClient
        .query(GET_BILL_URL_QUERY, { billId: Number(billId) })
        .toPromise();
      if (result.error) {
        toast.error('Hubo un error al obtener el comprobante.');
      } else {
        const proofFileUrl = result.data?.billProofDownloadUrl?.amazonS3Url;
        if (!proofFileUrl) {
          toast.error('Hubo un error al obtener el comprobante.');
          return;
        }

        sessionStorage.setItem(
          'billPreview',
          JSON.stringify({
            proofFileUrl,
          }),
        );
        window.open('/expenses-incomes-preview', '_blank');
      }
    }
    if (action === 'borrar') {
      const urqlClient: Client = createUrqlClient(token);
      const result = await urqlClient
        .mutation(DELETE_BILL_MUTATION, { billId: Number(billId) })
        .toPromise();
      if (result.error) {
        toast.error('Hubo un error al eliminar el comprobante.');
      } else {
        await invalidateAll();
        toast.success('Comprobante eliminado exitosamente.');
      }
    }
  };
</script>

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
      {#each getMenuItems() as item (item.action)}
        <DropdownMenu.Item
          onclick={() => handleAction(item.action, String(bill.billId))}
        >
          {item.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
  </DropdownMenu.Content>
</DropdownMenu.Root>
