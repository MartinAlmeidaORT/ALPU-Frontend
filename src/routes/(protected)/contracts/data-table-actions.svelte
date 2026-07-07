<script lang="ts">
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import type { TableContract } from './columns';
  import {
    CANCEL_CONTRACT_QUERY,
    APPROVE_CONTRACT_QUERY,
    GET_CONTRACT_URL_QUERY,
  } from '$lib/graphql/queries/contracts';
  import {
    ContractState,
    type UpdateContractStateInput,
  } from '$lib/graphql/schema';
  import type { Client } from '@urql/svelte';
  import { createUrqlClient } from '$lib/graphql/client';
  import { invalidateAll } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  let { contract }: { contract: TableContract } = $props();
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  const getMenuItems = (state: string) => {
    switch (state) {
      case 'PENDING':
        return [
          { label: 'Aprobar', action: 'approve' },
          { label: 'Cancelar', action: 'cancel' },
          { label: 'Ver', action: 'ver' },
          { label: 'Reestructurar', action: 'reestructurar' },
        ];
      case 'ACTIVE':
        return [
          { label: 'Cancelar', action: 'cancel' },
          { label: 'Ver', action: 'ver' },
          { label: 'Reestructurar', action: 'reestructurar' },
        ];
      case 'PAID':
        return [
          { label: 'Cancelar', action: 'cancel' },
          { label: 'Ver', action: 'ver' },
          { label: 'Reestructurar', action: 'reestructurar' },
        ];
      case 'CANCELED':
        return [
          { label: 'Ver', action: 'ver' },
          { label: 'Reestructurar', action: 'reestructurar' },
        ];
      default:
        return [];
    }
  };

  const handleAction = async (
    action: string,
    contractId: string,
    contractSerial: string,
  ) => {
    switch (action) {
      case 'cancel':
        await cancelContract(contractId);
        break;
      case 'approve':
        await approveContract(contractId);
        break;
      case 'ver':
        await viewContract(contractId);
        break;
      case 'reestructurar':
        await restructureContract(contractId, contractSerial);
        break;
      default:
        toast.error('Acción no reconocida');
    }
  };

  async function cancelContract(contractId: string) {
    const input: UpdateContractStateInput = {
      contractId: Number(contractId),
      newState: ContractState.Canceled,
    };
    const urqlClient: Client = createUrqlClient(page.data.token);
    const result = await urqlClient
      .mutation(CANCEL_CONTRACT_QUERY, { input })
      .toPromise();
    if (result.error) {
      toast.error('Error al cancelar el contrato');
    } else {
      await invalidateAll();
    }
  }

  async function approveContract(contractId: string) {
    const urqlClient: Client = createUrqlClient(page.data.token);
    const result = await urqlClient
      .mutation(APPROVE_CONTRACT_QUERY, { contractId: Number(contractId) })
      .toPromise();
    if (result.error) {
      toast.error('Error al aprobar el contrato');
    } else {
      await invalidateAll();
    }
  }

  async function viewContract(contractId: string) {
    try {
      const urqlClient: Client = createUrqlClient(page.data.token);
      const result = await urqlClient
        .query(GET_CONTRACT_URL_QUERY, { contractId: Number(contractId) })
        .toPromise();
      if (result.error) {
        throw new Error();
      }
      sessionStorage.setItem(
        'contractPreview',
        JSON.stringify({
          pdfUrl: result.data.contractPdfDownloadUrl.pdfAmazonS3Url,
        }),
      );
      window.open('/contract-preview', '_blank');
    } catch (error) {
      toast.error('Error al obtener el contrato');
    }
  }

  async function restructureContract(
    contractId: string,
    contractSerial: string,
  ) {
    try {
      await cancelContract(contractId);
      sessionStorage.setItem('contractSerial', contractSerial);
      console.log('contractSerial set to:', contractSerial);
      goto('/select-service');
    } catch (error) {
      toast.error('Error al reestructurar el contrato');
    }
  }
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
      {#each getMenuItems(contract.state) as item (item.action)}
        <DropdownMenu.Item
          onclick={() =>
            handleAction(
              item.action,
              String(contract.contractId),
              String(contract.contractSerial),
            )}
        >
          {item.label}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
  </DropdownMenu.Content>
</DropdownMenu.Root>
