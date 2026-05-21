<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import type { OperationResult } from '@urql/core';
  import type { PageData } from './$types';
  import {
    fetchServices,
    calculateServicePrice,
  } from '$lib/graphql/queries/service';
  import { onMount } from 'svelte';
  import type {
    CampaignInput,
    CampaignServiceInput,
    PieceInput,
  } from '$lib/graphql/schema';
  import type {
    ServicesQuery,
    CalculateContractQuery,
  } from '$lib/graphql/types/graphql';
  import ServiceItem from '$lib/components/service-item.svelte';
  import ServiceSummary from '$lib/components/service-summary.svelte';
  import SearchClientBroadcaster from '$lib/components/search-client-broadcaster.svelte';
  let { data }: { data: PageData } = $props();

  type ServiceSelected = {
    service: NonNullable<ServicesQuery['services']>[number];
    selectedPrice?: number;
    selectedDurationId?: string;
  } | null;

  let serviceSelected: ServiceSelected = $state(null);
  let errorMessages = $state<string | null>(null);
  let nombrePieza = $state('');
  let totalServices = $state<CampaignServiceInput[]>([]);
  let totalContrato = $state<
    CalculateContractQuery['calculateContract'] | null
  >(null);
  let isInterior = $state(false);
  let isPriceSuggested = $state(false);
  let priceSuggested = $state(null);
  let nonCommercialContent = $state(false);
  let internetBroadcast = $state(false);
  let lipSync = $state(false);
  let narrativeRoles = $state('0');
  let narrativeMinutes = $state('');
  let ivrMessage = $state('');
  let broadcastInMassMedia = $state(false);
  let fetchServicesResult = $state<OperationResult<ServicesQuery> | null>(null);

  onMount(async () => {
    fetchServicesResult = await fetchServices();
  });
  let services = $derived(fetchServicesResult?.data?.services ?? []);

  async function handleAddPiece(pieceName: string, svc: any, options: any) {
    if (isPriceSuggested && priceSuggested != null) {
      if (svc.basePrice && svc.basePrice > priceSuggested) {
        errorMessages = 'Precio sugerido no puede ser menor al precio base';
        return;
      }
    }

    // Buscar si ya existe un servicio con el mismo serviceId
    const existingServiceIndex = totalServices.findIndex(
      (s) => s.serviceId === svc.serviceId,
    );

    if (existingServiceIndex !== -1) {
      // Agregar la pieza al servicio existente
      totalServices[existingServiceIndex].pieces?.push({ name: pieceName });
    } else {
      // Crear un nuevo servicio con la pieza
      totalServices.push({
        serviceId: svc.serviceId,
        options: options,
        pieces: [{ name: pieceName }],
      });
    }

    totalServices = totalServices; // Trigger reactivity

    const input: CampaignInput = {
      broadcasterId: 1,
      clientId: 2,
      inCash: true,
      campaign: 'Test',
      services: totalServices,
    };

    const result = await calculateServicePrice(input);
    if (result == null) {
      return;
    }
    totalContrato = result.data?.calculateContract ?? null;
    serviceSelected = null;
    isInterior = false;
    isPriceSuggested = false;
    priceSuggested = null;
    nombrePieza = '';
    nonCommercialContent = false;
    internetBroadcast = false;
    lipSync = false;
    narrativeRoles = '0';
    narrativeMinutes = '';
    ivrMessage = '';
    broadcastInMassMedia = false;
    checkDurationErrors();
  }

  async function removeAllServices() {
    totalServices = [];
    totalContrato = null;
    errorMessages = null;
    checkDurationErrors();
  }

  async function removeService(index: number) {
    totalServices = totalServices.filter((_, i) => i !== index);

    if (totalServices.length === 0) {
      totalContrato = null;
      return;
    }

    const input: CampaignInput = {
      broadcasterId: 1,
      clientId: 2,
      inCash: true,
      campaign: 'Test',
      services: totalServices,
    };

    const result = await calculateServicePrice(input);
    if (result != null) {
      totalContrato = result.data?.calculateContract ?? null;
    }
    checkDurationErrors();
  }

  async function removePiece(serviceIndex: number, pieceIndex: number) {
    if (totalServices[serviceIndex].pieces) {
      totalServices[serviceIndex].pieces = totalServices[
        serviceIndex
      ].pieces!.filter((_, i) => i !== pieceIndex);

      // Si el servicio no tiene piezas, eliminar el servicio completo
      if (totalServices[serviceIndex].pieces!.length === 0) {
        await removeService(serviceIndex);
        return;
      }

      totalServices = totalServices; // Trigger reactivity

      const input: CampaignInput = {
        broadcasterId: 1,
        clientId: 2,
        inCash: true,
        campaign: 'Test',
        services: totalServices,
      };

      const result = await calculateServicePrice(input);
      if (result != null) {
        totalContrato = result.data?.calculateContract ?? null;
      }
    }
  }

  async function checkDurationErrors() {
    let durationId = '';
    totalServices.forEach((service) => {
      if (service.options !== durationId && durationId !== '') {
        errorMessages =
          'Está agregando servicios con duraciones distintas. Esto queda a criterio del usuario y puede afectar el contrato';
        return;
      }
      //durationId = service.options.durationId;
      errorMessages = null;
    });
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
          <ServiceItem
            {service}
            onAddPiece={(pieceName, svc, options) =>
              handleAddPiece(pieceName, svc, options)}
          />
        {/each}
      </Accordion.Root>
    </div>

    <div class="flex-1 min-w-[300px] w-full">
      <SearchClientBroadcaster user={data.user} />
      <ServiceSummary
        {totalContrato}
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
