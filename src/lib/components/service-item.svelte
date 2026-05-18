<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import Label from '$lib/components/ui/label/label.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import type { ServicesQuery } from '$lib/graphql/types/graphql';

  type Service = NonNullable<ServicesQuery['services']>[number];

  // Props
  export let service: Service;
  export let onAddPiece: (pieceName: string, svc: Service, options: any) => void = () => {};

  // Local state
  let isInterior = false;
  let isPriceSuggested = false;
  let priceSuggested: number | null = null;
  let nombrePieza = '';
  let nonCommercialContent = false;
  let internetBroadcast = false;
  let lipSync = false;
  let narrativeRoles = '0';
  let narrativeMinutes = '';
  let ivrMessage = '';
  let broadcastInMassMedia = false;
  let selectedDurationId = '';

  function handleAddPiece() {
    const options: any = {
      isInterior,
      overridePrice: priceSuggested,
    };

    if (service.__typename === 'ServicePeriod') {
      options.durationId = selectedDurationId;
    } else if (service.__typename === 'ServiceDate') {
      options.hasMassMediaBroadcast = broadcastInMassMedia;
    } else if (service.__typename === 'ServiceIvr') {
      options.messageIVR = ivrMessage;
    } else if (service.__typename === 'ServiceNarrative') {
      options.narrativeMinutes = parseInt(narrativeMinutes) || 0;
      options.roleQuantity = parseInt(narrativeRoles);
      options.isNonComercial = nonCommercialContent;
      options.hasInternetPromo = internetBroadcast;
      options.hasLipSync = lipSync;
    }
    onAddPiece(nombrePieza, service, options);
    resetForm();
  }

  function resetForm() {
    nombrePieza = '';
    isInterior = false;
    isPriceSuggested = false;
    priceSuggested = null;
    nonCommercialContent = false;
    internetBroadcast = false;
    lipSync = false;
    narrativeRoles = '0';
    narrativeMinutes = '';
    ivrMessage = '';
    broadcastInMassMedia = false;
    selectedDurationId = '';
  }

  function shouldShowInteriorDiscount(): boolean {
    return (
      service.name.includes('RADIO') ||
      service.name.includes('TELEVISIÓN') ||
      service.name.includes('CINE')
    );
  }

  function shouldShowSubsiguiente(): boolean {
    return !(
      service.name.includes('PRESENTACIÓN DE PROGRAMAS') ||
      service.name.includes('LOCUCIÓN A CÁMARA') ||
      service.name.includes('ZÓCALO')
    );
  }
</script>

{#if service.__typename === 'ServicePeriod'}
  <Accordion.Item value={String(service.serviceId)}>
    <Accordion.Trigger
      class="grid grid-cols-[1fr_repeat(5,70px)] gap-2 min-h-16 px-2 items-center"
    >
      <span class="truncate hover:underline cursor-pointer">{service.name}</span>
      {#each service.periods as servicePrice}
        <Button
          variant="outline"
          bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
          onclick={() => (selectedDurationId = servicePrice.interval)}
          class="flex-1"
        >
          {servicePrice.basePrice}
        </Button>
      {/each}
    </Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      {#if shouldShowSubsiguiente()}
        <div
          class="grid grid-cols-[1fr_repeat(5,70px)] gap-2 min-h-16 px-2 items-center"
        >
          <span class="truncate">SUBSIGUIENTE</span>
          {#each service.periods as servicePrice}
            <Button
              variant="outline"
              bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
              onclick={() => (selectedDurationId = servicePrice.interval)}
              class="flex-1"
            >
              {servicePrice.extraPrice}
            </Button>
          {/each}
        </div>
      {/if}
      <div class="flex gap-3 px-2">
        {#if shouldShowInteriorDiscount()}
          <div class="flex items-center gap-2">
            <Checkbox id="discInterior_{service.serviceId}" bind:checked={isInterior} />
            <Label for="discInterior_{service.serviceId}">Descuento interior (-70%)</Label>
          </div>
        {/if}
        <div class="flex items-center gap-2">
          <Label for="nombrePieza_{service.serviceId}">Nombre</Label>
          <Input
            id="nombrePieza_{service.serviceId}"
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
          onclick={() => handleAddPiece()}
        >
          Agregar
        </Button>
      </div>
    </Accordion.Content>
  </Accordion.Item>
{:else if service.__typename === 'ServiceDate'}
  <Accordion.Item value={String(service.serviceId)}>
    <Accordion.Trigger class="gap-2 min-h-16 px-2 items-center">
      {service.name}
    </Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <div class="flex gap-3 px-2">
        <Label for="serviceSpecialBasePrice_{service.serviceId}">
          Precio base ${service.basePrice}
        </Label>
        {#if service.name.includes('MAESTRO DE CEREMONIAS')}
          <div class="flex items-center gap-2">
            <Checkbox
              id="broadcastInMassMedia_{service.serviceId}"
              bind:checked={broadcastInMassMedia}
            />
            <Label for="broadcastInMassMedia_{service.serviceId}">
              Difusión en medios masivos (+30%)
            </Label>
          </div>
        {/if}
        <div class="flex items-center gap-2">
          <Label for="nombrePieza_{service.serviceId}">Nombre</Label>
          <Input
            id="nombrePieza_{service.serviceId}"
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
          onclick={() => handleAddPiece()}
        >
          Agregar
        </Button>
      </div>
    </Accordion.Content>
  </Accordion.Item>
{:else if service.__typename === 'ServiceIvr'}
  <Accordion.Item value={String(service.serviceId)}>
    <Accordion.Trigger class="gap-2 min-h-16 px-2 items-center">
      {service.name}
    </Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <div class="flex gap-3 px-2">
        <Label for="serviceIVRInitialMessagePrice_{service.serviceId}">
          Precio mensaje inicial ${service.basePrice}
        </Label>
        <div class="flex items-center gap-2">
          <Checkbox
            id="ispriceSuggestion_{service.serviceId}"
            bind:checked={isPriceSuggested}
          />
          <Label for="ispriceSuggestion_{service.serviceId}">Sugerir precio</Label>
          {#if isPriceSuggested}
            <Input
              id="suggestedPrice_{service.serviceId}"
              bind:value={priceSuggested}
              type="number"
              placeholder="Precio sugerido"
            />
          {/if}
        </div>
        <div class="flex items-center gap-2">
          <Label for="nombrePieza_{service.serviceId}">Nombre</Label>
          <Input
            id="nombrePieza_{service.serviceId}"
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
          onclick={() => handleAddPiece()}
        >
          Agregar
        </Button>
      </div>
      <div class="items-center gap-2 px-2">
        <Label for="ivrMessage_{service.serviceId}" class="py-2">Mensaje</Label>
        <Textarea
          id="ivrMessage_{service.serviceId}"
          bind:value={ivrMessage}
          placeholder="Ingrese su mensaje"
        />
      </div>
    </Accordion.Content>
  </Accordion.Item>
{:else if service.__typename === 'ServiceNarrative'}
  <Accordion.Item value={String(service.serviceId)}>
    <Accordion.Trigger class="gap-2 min-h-16 px-2 items-center">
      {service.name}
    </Accordion.Trigger>
    <Accordion.Content class="flex flex-col gap-4 text-balance">
      <div class="flex gap-3 px-2">
        <Label for="serviceNarrativeInitialPrice_{service.serviceId}">
          Hasta 3 minutos ${service.basePrice}
        </Label>
        <div class="flex items-center gap-2">
          <Label for="nombrePieza_{service.serviceId}">Nombre</Label>
          <Input
            id="nombrePieza_{service.serviceId}"
            bind:value={nombrePieza}
            type="text"
            placeholder="Nombre de la pieza"
          />
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="nonCommercialContent_{service.serviceId}"
            bind:checked={nonCommercialContent}
          />
          <Label for="nonCommercialContent_{service.serviceId}">
            Contenido no comercial (-20%)
          </Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="lypSinc_{service.serviceId}" bind:checked={lipSync} />
          <Label for="lypSinc_{service.serviceId}">Sincro labial (+20%)</Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="internetBroadcast_{service.serviceId}"
            bind:checked={internetBroadcast}
          />
          <Label for="internetBroadcast_{service.serviceId}">
            Difusión en internet (+100%)
          </Label>
        </div>
      </div>
      <div class="flex gap-3 px-2">
        <div class="flex items-center gap-2">
          <Select.Root type="single" bind:value={narrativeMinutes}>
            <Label>Minutos</Label>
            <Input
              id="narrativeMinutes_{service.serviceId}"
              bind:value={narrativeMinutes}
              type="number"
              placeholder="Minutos"
            />
          </Select.Root>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="ispriceSuggestion_{service.serviceId}"
            bind:checked={isPriceSuggested}
          />
          <Label for="ispriceSuggestion_{service.serviceId}">Sugerir precio</Label>
          {#if isPriceSuggested}
            <Input
              id="suggestedPrice_{service.serviceId}"
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
          onclick={() => handleAddPiece()}
        >
          Agregar
        </Button>
      </div>
    </Accordion.Content>
  </Accordion.Item>
{/if}
