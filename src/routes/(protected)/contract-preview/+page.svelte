<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index.js';
  import type { Client } from '@urql/svelte';
  import { createUrqlClient } from '$lib/graphql/client';
  import {
    APPROVE_CONTRACT_QUERY,
    CANCEL_CONTRACT_QUERY,
  } from '$lib/graphql/queries/contracts';
  import {
    ContractState,
    type UpdateContractStateInput,
  } from '$lib/graphql/schema';

  let pdfAmazonS3Url = $state<string | null>(null);
  let contractId = $state<string | null>(null);
  let { data }: { data: { token: string } } = $props();
  onMount(() => {
    const storedData = sessionStorage.getItem('contractPreview');
    if (!storedData) {
      goto('/');
    } else {
      const data = JSON.parse(storedData);
      pdfAmazonS3Url = data.pdfUrl;
      contractId = sessionStorage.getItem('contractId');
      sessionStorage.removeItem('contractPreview');
    }
  });

  const approveContract = async () => {
    const urqlClient: Client = createUrqlClient(data.token);
    const result = await urqlClient
      .mutation(APPROVE_CONTRACT_QUERY, { contractId: Number(contractId) })
      .toPromise();
    if (result.error) {
      console.error('Token en approveContract:', data.token);
    } else {
    }
    goto('/select-service');
  };

  const cancelContract = async () => {
    const input: UpdateContractStateInput = {
      contractId: Number(contractId),
      newState: ContractState.Canceled,
    };
    const urqlClient: Client = createUrqlClient(data.token);
    const result = await urqlClient
      .mutation(CANCEL_CONTRACT_QUERY, { input })
      .toPromise();
    if (result.error) {
    } else {
    }
    goto('/select-service');
  };
</script>

<div class="h-full w-full p-4 flex flex-col items-center gap-4">
  {#if pdfAmazonS3Url}
    <h1 class="text-2xl font-bold text-center">Preview del Contrato</h1>
    <div class="pdf-container w-full max-w-6xl">
      <iframe
        src={pdfAmazonS3Url}
        title="Visor de PDF"
        width="100%"
        height="800px"
        frameborder="0"
      ></iframe>
    </div>
    <div class="flex gap-4 p-4">
      <Button
        type="button"
        bgColor="bg-red-500 text-white hover:bg-red-600 hover:text-white"
        onclick={() => cancelContract()}
        class="mt-4 flex-1"
      >
        Cancelar contrato
      </Button>
      <Button
        onclick={() => goto('/select-service')}
        bgColor="bg-[#D9D9D9] text-[#1F5BB8] hover:bg-white"
        class="mt-4 flex-1"
      >
        Volver
      </Button>
      <Button
        type="button"
        bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white"
        onclick={() => approveContract()}
        class="mt-4 flex-1"
      >
        Aceptar Contrato
      </Button>
    </div>
  {:else}
    <div class="flex flex-col items-center gap-2 mt-20">
      <div
        class="w-8 h-8 rounded-full border-4 border-gray-300 border-t-[#22964F] animate-spin"
      ></div>
      <p class="text-gray-500">Autorizando visualización del contrato...</p>
    </div>
  {/if}
</div>

<style>
  .pdf-container {
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
