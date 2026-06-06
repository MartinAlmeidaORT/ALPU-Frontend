<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Client } from '@urql/svelte';
  import { createUrqlClient } from '$lib/graphql/client';
  import { APPROVE_CONTRACT_QUERY, CANCEL_CONTRACT_QUERY } from '$lib/graphql/queries/contracts';
  import { ContractState, type UpdateContractStateInput } from '$lib/graphql/schema';
  import * as Dialog from '$lib/components/ui/dialog';

  let pdfAmazonS3Url = $state<string | null>(null);
  let contractId = $state<string | null>(null);
  let { data }: { data: { token: string } } = $props();

  onMount(() => {
    const storedData = sessionStorage.getItem('contractPreview');
    if (!storedData) {
      goto('/');
    } else {
      const parsed = JSON.parse(storedData);
      pdfAmazonS3Url = parsed.pdfUrl;
      contractId = sessionStorage.getItem('contractId');
      sessionStorage.removeItem('contractPreview');
    }
  });

  const approveContract = async () => {
    const urqlClient: Client = createUrqlClient(data.token);
    await urqlClient.mutation(APPROVE_CONTRACT_QUERY, { contractId: Number(contractId) }).toPromise();
    goto('/select-service');
  };

  const cancelContract = async () => {
    const input: UpdateContractStateInput = {
      contractId: Number(contractId),
      newState: ContractState.Canceled,
    };
    const urqlClient: Client = createUrqlClient(data.token);
    await urqlClient.mutation(CANCEL_CONTRACT_QUERY, { input }).toPromise();
    goto('/select-service');
  };

  // Clase base compartida para todos los botones
  const btn = 'h-10 flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2 cursor-pointer';
</script>

<div class="h-full w-full p-4 flex flex-col items-center gap-4">
  {#if pdfAmazonS3Url}
    <h1 class="text-2xl font-bold text-center">Preview del Contrato</h1>

    <div class="w-full max-w-6xl border border-border rounded-lg overflow-hidden shadow-sm">
      <iframe
        src={pdfAmazonS3Url}
        title="Visor de PDF"
        width="100%"
        height="800px"
        frameborder="0"
      ></iframe>
    </div>

    <div class="flex w-full gap-3 max-w-6xl px-4">

    <!-- Cancelar -->
    <button
      type="button"
      class="{btn} bg-red-600 text-white hover:bg-red-700"
      onclick={cancelContract}
    >
      Cancelar contrato
    </button>

      <!-- Volver -->
      <button
        type="button"
        class="{btn} border border-border bg-background text-muted-foreground hover:bg-muted"
        onclick={() => goto('/select-service')}
      >
        Volver
      </button>

      <!-- Aceptar (Dialog) -->
      <Dialog.Root>
        <Dialog.Trigger class="{btn} bg-[#22964F] text-white hover:bg-[#1a6d3b]">
          Aceptar contrato
        </Dialog.Trigger>

        <Dialog.Content class="sm:max-w-md">
          <Dialog.Header>
            <Dialog.Title>Confirmar aceptación</Dialog.Title>
            <Dialog.Description>
              ¿Estás seguro de que deseas aceptar este contrato? Esta acción confirmará tu acuerdo con los términos establecidos.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Footer class="flex-col-reverse sm:flex-row gap-2 sm:gap-2 mt-2">
            <Dialog.Close
              class="{btn} border border-border bg-background text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </Dialog.Close>

            <button
              type="button"
              class="{btn} bg-[#22964F] text-white hover:bg-[#1a6d3b]"
              onclick={approveContract}
            >
              Sí, aceptar
            </button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

    </div>
  {:else}
    <div class="flex flex-col items-center gap-3 mt-20">
      <div class="w-8 h-8 rounded-full border-4 border-muted border-t-[#22964F] animate-spin"></div>
      <p class="text-sm text-muted-foreground">Autorizando visualización del contrato...</p>
    </div>
  {/if}
</div>