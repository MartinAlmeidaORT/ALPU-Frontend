<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import type { CalculateContractQuery } from '$lib/graphql/types/graphql';
  import {
    type CampaignInput,
  } from '$lib/graphql/schema';
  import { createUrqlClient } from '$lib/graphql/client';
  import { goto, invalidateAll } from '$app/navigation';
  import { GENERATE_CONTRACT_MUTATION } from '$lib/graphql/queries/contracts';
  import ServicePriceDetails from './ServicePriceDetails.svelte';
  import { page } from '$app/state';
  import type { Contract } from './Contract.svelte';
  let contractSerial: string | null = '';
  const urqlClient = createUrqlClient(page.data.token);

  let {
    contractDetails = null,
    errorMessages = null,
    onRemoveService = () => {},
    onRemoveAllServices = () => {},
    onRemovePiece = () => {},
    contract = $bindable(),
  }: {
    contractDetails?: CalculateContractQuery['calculateContract'] | null;
    errorMessages?: string | null;
    onRemoveService?: (index: number) => void;
    onRemoveAllServices?: () => void;
    onRemovePiece?: (serviceIndex: number, pieceIndex: number) => void;
    contract: Contract;
  } = $props();
  contractSerial = sessionStorage.getItem('contractSerial');
  if (contractSerial == 'undefined') {
    contractSerial = null;
  }

  async function generateContract() {
    if (
      contract.countryCode === undefined ||
      contract.countryCode === '' ||
      contract.countryCode === 'Seleccionar país'
    ) {
      errorMessages = 'Por favor, selecciona un país para el contrato.';
      return;
    }
    const result = await urqlClient
      .mutation(GENERATE_CONTRACT_MUTATION, { input: contract.toInput() })
      .toPromise();
    if (result.error) {
      errorMessages = 'Error al generar el contrato. Intenta nuevamente.';
    } else {
      await invalidateAll();
      const pdfUrl = result.data?.generateContract?.pdfAmazonS3Url;
      sessionStorage.setItem('contractPreview', JSON.stringify({ pdfUrl }));
      sessionStorage.setItem(
        'contractId',
        result.data?.generateContract?.contract?.contractId,
      );
      if (contractSerial) {
        sessionStorage.removeItem('contractSerial');
      }
      goto('/contract-preview');
    }
  }
</script>

<div
  class="space-y-2 bg-white rounded-lg p-4 text-center border-2 border-[#cad8e4]"
>
  {#if errorMessages}
    <Alert.Root class="border-red-400 bg-red-100">
      <Alert.Title class="text-red-700">{errorMessages}</Alert.Title>
    </Alert.Root>
  {/if}

  <h1 class="text-2xl font-bold mb-4">Total a pagar</h1>

  {#if !contractDetails}
    <span>No ha seleccionado ningún servicio.</span>
  {:else}
    <div class="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
      <div
        class="space-y-2 border border-[#cad8e4] rounded p-2 flex flex-col text-left"
      >
        <span class="font-bold text-[#1e293b]">Descuentos del contrato</span>
        {#each contractDetails.adjustments as adjustment}
          <div class="flex bg-[#ffffff] rounded gap-2">
            <span class="text-sm text-[#1e293b]"
              >{adjustment.name} de un total de $ {Math.abs(
                adjustment.applyDiscount,
              )}</span
            >
          </div>
        {/each}
      </div>

      <div class="col-span-2 space-y-2">
        {#each contractDetails.services as service, serviceIndex (serviceIndex)}
          <ServicePriceDetails
            {service}
            onRemoveService={() => onRemoveService(serviceIndex)}
            onRemovePiece={(pieceIndex) =>
              onRemovePiece(serviceIndex, pieceIndex)}
          ></ServicePriceDetails>
        {/each}
      </div>
    </div>

    {#if contractDetails !== null}
      <div class="border-t-2 pt-4 mt-4">
        <div class="flex gap-2 justify-between">
          <h1 class="text-2xl font-bold">
            Total con descuentos: ${contractDetails.total}
          </h1>
        </div>
        <div class="flex gap-2">
          <Button
            type="button"
            bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white"
            onclick={() => generateContract()}
            class="mt-4 flex-1"
          >
            Generar contrato
          </Button>
          <Button
            type="button"
            bgColor="bg-red-500 text-white hover:bg-red-600 hover:text-white"
            onclick={() => onRemoveAllServices()}
            class="mt-4 flex-1"
          >
            Borrar todo
          </Button>
        </div>
      </div>
    {/if}
  {/if}
</div>
