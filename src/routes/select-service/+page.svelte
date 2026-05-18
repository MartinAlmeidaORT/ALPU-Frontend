<script lang="ts">
  import * as Table from '$lib/components/ui/table/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import FieldGroup from '$lib/components/ui/field/field-group.svelte';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import * as Field from '$lib/components/ui/field/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import type { OperationResult } from '@urql/core';
  import {
    fetchServices,
    calculateServicePrice,
  } from '$lib/graphql/queries/service';
  import { onMount } from 'svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import type { CampaignInput, CampaignServiceInput, PieceInput } from '$lib/graphql/schema';
  import type { ServicesQuery } from '$lib/graphql/types/graphql';

  type ServiceSelected = {
    service: NonNullable<ServicesQuery['services']>[number];
    selectedPrice?: number;
    selectedDurationId?: string;
  } | null;

  let serviceSelected: ServiceSelected = $state(null);
  let errorMessages = $state<String | null>(null);
  let nombrePieza = $state('');
  let totalServices = $state<CampaignServiceInput[]>([]);
  let totalContrato = $state<any>(null);
  let isInterior = $state(false);
  let isPriceSuggested = $state(false);
  let priceSuggested = $state(null);
  let additionalPieces = $state< PieceInput[] >([]);
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

  async function calculateServicesSelectedPrice() {
    if (!serviceSelected) return;

    if (isPriceSuggested && priceSuggested != null) {
      if (
        serviceSelected.service.basePrice > priceSuggested
      ) {
        errorMessages = 'Precio sugerido no puede ser menor al precio base';
        return;
      }
    }

    const options: any = {
      isInterior,
      overridePrice: priceSuggested,
    };

    options.durationId = serviceSelected.selectedDurationId;
    options.pieces = additionalPieces;
    options.messageIVR = ivrMessage;
    options.additionalMessageIVR = additionalPieces;
    options.narrativeMinutes = parseInt(narrativeMinutes) || 0;
    options.roleQuantity = parseInt(narrativeRoles);
    options.isNonComercial = nonCommercialContent;
    options.hasInternetPromo = internetBroadcast;
    options.hasLipSync = lipSync;
    options.hasMassMediaBroadcast = broadcastInMassMedia;
    options.multipleBroadcaster = null;

    totalServices.push({
      serviceId: serviceSelected.service.serviceId,
      options: options,
      pieces: additionalPieces
    });
    const input: CampaignInput = {
      broadcasterId: 1,
      clientId: 2,
      inCash: true,
      campaign: "Test",
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
    checkDurationErrors();
    additionalPieces.push({ name: nombrePieza });
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
      campaign: "Test",
      services: totalServices,
    };

    const result = await calculateServicePrice(input);
    if (result != null) {
      totalContrato = result.data?.calculateContract ?? null;
    }
    checkDurationErrors();
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
          <h2 class="text-center">1 semana</h2>
          <h2 class="text-center">1 mes</h2>
          <h2 class="text-center">3 meses</h2>
          <h2 class="text-center">6 meses</h2>
          <h2 class="text-center">1 año</h2>
        </div>
      </div>
      <Accordion.Root type="single" class="w-full" value="item-1">
        {#each services as service (service.serviceId)}
          {#if service.__typename === 'ServicePeriod'}
            <Accordion.Item value={String(service.serviceId)}>
              <Accordion.Trigger
                class="grid grid-cols-[1fr_repeat(5,70px)] gap-2 min-h-16 px-2 items-center"
              >
                <span class="truncate hover:underline cursor-pointer"
                  >{service.name}</span
                >
                {#each service.periods as servicePrice}
                  <Button
                    variant="outline"
                    bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
                    onclick={() => {
                      serviceSelected = {
                        service,
                        selectedDurationId: servicePrice.interval,
                      };
                    }}
                    class="flex-1"
                  >
                    {servicePrice.basePrice}
                  </Button>
                {/each}
              </Accordion.Trigger>
              <Accordion.Content class="flex flex-col gap-4 text-balance">
                {#if !service.name.includes('PRESENTACIÓN DE PROGRAMAS') && !service.name.includes('LOCUCIÓN A CÁMARA') && !service.name.includes('ZÓCALO')}
                  <div
                    class="grid grid-cols-[1fr_repeat(5,70px)] gap-2 min-h-16 px-2 items-center"
                  >
                    <span class="truncate">SUBSIGUIENTE</span>
                    {#each service.periods as servicePrice}
                      <Button
                        variant="outline"
                        bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
                        onclick={() => {
                          serviceSelected = {
                            service,
                            selectedDurationId: servicePrice.interval,
                          };
                        }}
                        class="flex-1"
                      >
                        {servicePrice.extraPrice}
                      </Button>
                    {/each}
                  </div>
                {/if}
                <div class="flex gap-3 px-2">
                  {#if service.name.includes('RADIO') || service.name.includes('TELEVISIÓN') || service.name.includes('CINE')}
                    <div class="flex items-center gap-2">
                      <Checkbox id="discInterior" bind:checked={isInterior} />
                      <Label for="discInterior">Descuento interior (-70%)</Label
                      >
                    </div>
                  {/if}
                  <div class="flex items-center gap-2">
                    <Label for="nombrePieza">Nombre</Label>
                    <Input
                      id="nombrePieza"
                      bind:value={nombrePieza}
                      type="text"
                      placeholder="Nombre de la pieza"
                    />
                  </div>
                  <Button
                    type="button"
                    class="col-span-2"
                    variant="outline"
                    bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white"
                    onclick={() => calculateServicesSelectedPrice()}
                    >Agregar</Button
                  >
                </div>
              </Accordion.Content>
            </Accordion.Item>
          {:else if service.__typename === 'ServiceDate'}
            <Accordion.Item value={String(service.serviceId)}>
              <Accordion.Trigger class="gap-2 min-h-16 px-2 items-center"
                >{service.name}</Accordion.Trigger
              >
              <Accordion.Content class="flex flex-col gap-4 text-balance">
                <div class="flex gap-3 px-2">
                  <Label for="serviceSpecialBasePrice"
                    >Precio base ${service.basePrice}</Label
                  >
                  <div class="flex items-center gap-2">
                    {#if service.name.includes('MAESTRO DE CEREMONIAS')}
                      <Checkbox
                        id="broadcastInMassMedia"
                        bind:checked={broadcastInMassMedia}
                      />
                      <Label for="broadcastInMassMedia"
                        >Difusión en medios masivos (+30%)</Label
                      >
                    {/if}
                  </div>
                  <div class="flex items-center gap-2">
                    <Label for="nombrePieza">Nombre</Label>
                    <Input
                      id="nombrePieza"
                      bind:value={nombrePieza}
                      type="text"
                      placeholder="Nombre de la pieza"
                    />
                  </div>
                  <Button
                    type="button"
                    class="col-span-2"
                    variant="outline"
                    bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white"
                    onclick={() => {
                      serviceSelected = { service };
                      calculateServicesSelectedPrice();
                    }}>Agregar</Button
                  >
                </div>
              </Accordion.Content>
            </Accordion.Item>
          {:else if service.__typename === 'ServiceIvr'}
            <Accordion.Item value={String(service.serviceId)}>
              <Accordion.Trigger class="gap-2 min-h-16 px-2 items-center"
                >{service.name}</Accordion.Trigger
              >
              <Accordion.Content class="flex flex-col gap-4 text-balance">
                <div class="flex gap-3 px-2">
                  <Label for="serviceIVRInitialMessagePrice"
                    >Precio mensaje inicial ${service.basePrice}</Label
                  >
                  <div class="flex items-center gap-2">
                    <Checkbox
                      id="ispriceSuggestion"
                      bind:checked={isPriceSuggested}
                    />
                    <Label for="ispriceSuggestion">Sugerir precio</Label>
                    {#if isPriceSuggested}
                      <Input
                        id="suggestedPrice"
                        bind:value={priceSuggested}
                        type="number"
                        placeholder="Precio sugerido"
                      />
                    {/if}
                  </div>
                  <div class="flex items-center gap-2">
                    <Label for="nombrePieza">Nombre</Label>
                    <Input
                      id="nombrePieza"
                      bind:value={nombrePieza}
                      type="text"
                      placeholder="Nombre de la pieza"
                    />
                  </div>
                  <Button
                    type="button"
                    class="col-span-2"
                    variant="outline"
                    bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white"
                    onclick={() => {
                      serviceSelected = { service };
                      calculateServicesSelectedPrice();
                    }}>Agregar</Button
                  >
                </div>
                <div class="items-center gap-2 px-2">
                  <Label for="ivrMessage" class="py-2">Mensaje</Label>
                  <Textarea
                    id="ivrMessage"
                    bind:value={ivrMessage}
                    placeholder="Ingrese su mensaje"
                  />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          {:else if service.__typename === 'ServiceNarrative'}
            <Accordion.Item value={String(service.serviceId)}>
              <Accordion.Trigger class="gap-2 min-h-16 px-2 items-center"
                >{service.name}</Accordion.Trigger
              >
              <Accordion.Content class="flex flex-col gap-4 text-balance">
                <div class="flex gap-3 px-2">
                  <Label for="serviceNarrativeInitialPrice"
                    >Hasta 3 minutos ${service.basePrice}</Label
                  >
                  <div class="flex items-center gap-2">
                    <Label for="nombrePieza">Nombre</Label>
                    <Input
                      id="nombrePieza"
                      bind:value={nombrePieza}
                      type="text"
                      placeholder="Nombre de la pieza"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox
                      id="nonCommercialContent"
                      bind:checked={nonCommercialContent}
                    />
                    <Label for="nonCommercialContent"
                      >Contenido no comercial (-20%)</Label
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox id="lypSinc" bind:checked={lipSync} />
                    <Label for="lypSinc">Sincro labial(+20%)</Label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox
                      id="internetBroadcast"
                      bind:checked={internetBroadcast}
                    />
                    <Label for="internetBroadcast"
                      >Difusión en internet (+100%)</Label
                    >
                  </div>
                </div>
                <div class="flex gap-3 px-2">
                  <div class="flex items-center gap-2">
                    <Select.Root type="single" bind:value={narrativeMinutes}>
                      <Label>Minutos</Label>
                      <Input
                        id="narrativeMinutes"
                        bind:value={narrativeMinutes}
                        type="number"
                        placeholder="Minutos"
                      />
                    </Select.Root>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox
                      id="ispriceSuggestion"
                      bind:checked={isPriceSuggested}
                    />
                    <Label for="ispriceSuggestion">Sugerir precio</Label>
                    {#if isPriceSuggested}
                      <Input
                        id="suggestedPrice"
                        bind:value={priceSuggested}
                        type="number"
                        placeholder="Precio sugerido"
                      />
                    {/if}
                  </div>
                  <Button
                    type="button"
                    class="col-span-2"
                    variant="outline"
                    bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white"
                    onclick={() => {
                      serviceSelected = { service };
                      calculateServicesSelectedPrice();
                    }}>Agregar</Button
                  >
                </div>
              </Accordion.Content>
            </Accordion.Item>
          {/if}
        {/each}
      </Accordion.Root>
    </div>

    <div class="flex-1 min-w-[300px] w-full">
      <div class="space-y-2 bg-white rounded-lg p-4 text-center">
        {#if errorMessages}
          <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          >
            {errorMessages}
          </div>
        {/if}
        <h1 class="text-2xl font-bold mb-4">Total a pagar</h1>
        {#if !totalContrato}
          <span>No ha seleccionado ningún servicio.</span>
        {:else}
          {#each totalContrato.servicePrice as service, i (i)}
            <div>
              <div class="flex justify-between p-2 bg-gray-100 rounded">
                <span>{service.pieceName}</span>
                <span>{service.service}</span>
                <span>${service.totalPriceWithDiscount}</span>
                {#each service.serviceFlags as flag}
                  {console.log(flag)}
                  {#if flag != null && flag != false}
                    <span class="text-sm text-gray-500">{flag.label}</span>
                  {/if}
                {/each}
                <Button
                  variant="outline"
                  bgColor="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                  onclick={() => removeService(i)}>Eliminar</Button
                >
              </div>
            </div>
          {/each}
          {#if totalContrato !== null}
            <h1 class="text-2xl font-bold mt-4">
              Total ${totalContrato.totalPrice}
            </h1>
          {/if}
        {/if}
      </div>
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
