<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import type { OperationResult } from '@urql/core';
  import type { PageData } from './$types';
  import {
    fetchServices,
    calculateServicePrice,
  } from '$lib/graphql/queries/service';
  import { toast } from 'svelte-sonner';
  import { onDestroy, onMount } from 'svelte';
  import type {
    ServicesQuery,
    CalculateContractQuery,
  } from '$lib/graphql/types/graphql';
  import ServiceItem from '$lib/components/service-item.svelte';
  import ServiceSummary from '$lib/components/service-summary.svelte';
  import SearchClientBroadcaster from '$lib/components/search-client-broadcaster.svelte';
  import SearchAgency from '$lib/components/search-agency.svelte';
  import CountryPicker from '$lib/components/CountryPicker.svelte';
  import { Contract, BaseServiceUI } from '$lib/components/Contract.svelte';
  import { page } from '$app/state';
  let {
    data,
  }: {
    data: PageData;
  } = $props();

  let contract = $derived<Contract>(
    data.existingContract
      ? Contract.fromContract(data.existingContract)
      : new Contract(),
  );

  let errorMessages = $state<string | null>(null);
  let contractDetails = $state<
    CalculateContractQuery['calculateContract'] | null
  >(null);
  let fetchServicesResult = $state<OperationResult<ServicesQuery> | null>(null);
  let services = $derived(fetchServicesResult?.data?.services ?? []);

  onMount(async () => {
    fetchServicesResult = await fetchServices();
    if (data.user?.role === 'Broadcaster') {
      contract.broadcasterId = data.user?.id;
    } else if (data.user?.role === 'Client') {
      contract.clientId = data.user?.id;
    }
  });

  function validateCampaignInput(): boolean {
    if (contract.clientId === 0) {
      toast.error('Selecciona un cliente', {
        description: 'Debes seleccionar un cliente para continuar',
      });
      return false;
    }

    if (contract.broadcasterId === 0) {
      toast.error('Selecciona un broadcaster', {
        description: 'Debes seleccionar un broadcaster para continuar',
      });
      return false;
    }
    return true;
  }

  async function checkDurationErrors() {
    if (contract.services.length === 0) {
      errorMessages = null;
      return;
    }
    const periodOf = (s: BaseServiceUI) =>
      'period' in s ? s.period : undefined;
    const firstPeriod = periodOf(contract.services[0]);
    const allSamePeriod = contract.services.every(
      (service) => periodOf(service) === firstPeriod,
    );

    if (!allSamePeriod) {
      errorMessages =
        'Está agregando servicios con duraciones distintas. Esto queda a criterio del usuario y puede afectar el contrato';
    } else {
      errorMessages = null;
    }
  }

  async function recalculate() {
    if (!validateCampaignInput()) {
      return;
    }
    const result = await calculateServicePrice(contract.toInput());
    if (!result.error) {
      contractDetails = result.data?.calculateContract ?? null;
    }
    checkDurationErrors();
  }

  async function addService(service: BaseServiceUI) {
    contract.addOrUpdateService(service);
    await recalculate();
  }

  async function removeAllServices() {
    contract.removeAllServices();
    contractDetails = null;
    errorMessages = null;
    checkDurationErrors();
  }

  async function removeService(index: number) {
    contract.removeService(index);
    if (contract.services.length === 0) {
      contractDetails = null;
      errorMessages = null;
    }
    checkDurationErrors();
    await recalculate();
  }

  async function removePiece(serviceIndex: number, pieceIndex: number) {
    const service = contract.services[serviceIndex];
    if (!service) return;

    contract.removePiece(serviceIndex, pieceIndex);

    if (service.pieces.length === 0) {
      await removeService(serviceIndex);
      return;
    }

    await recalculate();
  }
</script>

<div class="flex w-full justify-center px-4 pt-8">
  <div class="flex flex-row gap-8 w-full">
    <div class="flex-1 pl-4 bg-white rounded-lg">
      <div class="w-full mb-4">
        <div
          class="grid grid-cols-[1fr_repeat(5,70px)] gap-2 px-2 py-2 border-b font-semibold text-xs"
        >
          <div></div>
          <h2 class="text-center font-bold">1 semana</h2>
          <h2 class="text-center font-bold">1 mes</h2>
          <h2 class="text-center font-bold">3 meses</h2>
          <h2 class="text-center font-bold">6 meses</h2>
          <h2 class="text-center font-bold">1 año</h2>
        </div>
      </div>
      <Accordion.Root type="single" class="w-full" value="item-1">
        {#each services as service (service.serviceId)}
          <ServiceItem {service} onAddService={addService} />
        {/each}
      </Accordion.Root>
    </div>

    <div class="flex-1 min-w-[300px] w-full">
      <div class="flex w-full gap-4">
        <div class="flex-1">
          <CountryPicker bind:countryCode={contract.countryCode} />
        </div>
        {#if data.user?.role === 'Broadcaster'}
          <div class="flex-1">
            <SearchClientBroadcaster
              rol={data.user?.role}
              bind:valorId={contract.clientId}
              disabled={page.data.existingContract == undefined ? false : true}
            />
          </div>
        {:else if data.user?.role === 'Client'}
          <div class="flex-1">
            <SearchClientBroadcaster
              rol={data.user?.role}
              bind:valorId={contract.broadcasterId}
              disabled={page.data.existingContract == undefined ? false : true}
            />
          </div>
        {/if}

        {#if data.user?.role === 'Broadcaster'}
          <div class="flex-1">
            <SearchAgency
              bind:valorId={contract.clientId}
              disabled={page.data.existingContract == undefined ? false : true}
            />
          </div>
        {/if}
      </div>
      <ServiceSummary
        {contract}
        {contractDetails}
        {errorMessages}
        onRemoveService={(i) => removeService(i)}
        onRemoveAllServices={() => removeAllServices()}
        onRemovePiece={(serviceIndex, pieceIndex) =>
          removePiece(serviceIndex, pieceIndex)}
      />
    </div>
  </div>
</div>

<style>
  :global([data-slot='accordion-trigger-icon']) {
    display: none;
  }
  :global(button) {
    text-decoration: none !important;
  }
</style>
