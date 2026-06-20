<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import Label from '$lib/components/ui/label/label.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import type { ServicesQuery } from '$lib/graphql/types/graphql';
  import { toast } from 'svelte-sonner';
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { getLocalTimeZone } from "@internationalized/date";
  import type { CalendarDate } from "@internationalized/date";
  type Service = NonNullable<ServicesQuery['services']>[number];

  // Props
  let {
    service,
    onAddPiece = () => {},
  }: {
    service: Service;
    onAddPiece?: (pieceName: string, svc: Service, options: any) => void;
  } = $props();

  // Local state
  let isInterior = $state(false);
  let isPriceSuggested = $state(false);
  let priceSuggested: number | null = $state(null);
  let nombrePieza = $state('');
  let nonCommercialContent = $state(false);
  let internetBroadcast = $state(false);
  let lipSync = $state(false);
  let narrativeRoles = $state('0');
  let narrativeMinutes = $state('');
  let broadcastInMassMedia = $state(false);
  let selectedPeriod = $state('');
  let internalUse = $state(false);
  let additionalIvrMessage = $state(0);
  let canIvrUpdate = $state(false);
  let canIvrGetMoreMessages = $state(false);
  let ivrMessage = $state('');
  let ivrUpdates = $state(0);
  let selectedDate = $state<CalendarDate | undefined>();
  let open = $state(false);
  function handleAddPiece() {
    if (!nombrePieza || nombrePieza.trim() === '') {
      toast.error('Error al agregar un medio', {
        description: 'La pieza debe tener un nombre',
      });
      return;
    }

    const options: any = {};
    switch (service.type) {
      case 'TV_GENERIC':
        options.period = selectedPeriod;
        options.isInterior = isInterior;
        break;
      case 'TV_ZOCALO':
        options.period = selectedPeriod;
        options.isInterior = isInterior;
        break;
      case 'TV_HOST':
        options.period = selectedPeriod;
        options.isInterior = isInterior;
        break;
      case 'RADIO_GENERIC':
        options.period = selectedPeriod;
        options.isInterior = isInterior;
        break;
      case 'RADIO_ZOCALO':
        options.period = selectedPeriod;
        options.isInterior = isInterior;
        break;
      case 'RADIO_HOST':
        options.period = selectedPeriod;
        options.isInterior = isInterior;
        break;
      case 'INTERNET_VIDEO':
        options.period = selectedPeriod;
        break;
      case 'INTERNET_AUDIO':
        options.period = selectedPeriod;
        break;
      case 'CINEMA':
        options.period = selectedPeriod;
        options.isInterior = isInterior;
        break;
      case 'CAMERA':
        options.period = selectedPeriod;
        options.forInternalUse = internalUse;
        break;
      case 'NARRATIVE':
        options.minutes = parseInt(narrativeMinutes) || 0;
        options.extraRoles = parseInt(narrativeRoles);
        options.isNonCommercial = nonCommercialContent;
        options.onInternet = internetBroadcast;
        options.hasLipSync = lipSync;
        options.priceOverride = priceSuggested;
        break;
      case 'IVR':
        options.messageText = ivrMessage;
        options.additionalMessages = additionalIvrMessage;
        options.isInterior = isInterior;
        options.priceOverride = priceSuggested;
        options.updates = ivrUpdates;
        break;
      case 'EVENT':
        options.forMassBroadcast = broadcastInMassMedia;
        options.date = selectedDate?.toString(); // Aquí podrías agregar un selector de fecha si es necesario
        break;
      case 'OTHERS_VIDEO':
        break;
      case 'OTHERS_AUDIO':
        break;
      case 'OTHERS':
        options.period = selectedPeriod;
        break;
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
    ivrUpdates = 0;
    broadcastInMassMedia = false;
  }

  function shouldShowInteriorDiscount(): boolean {
    return (
      service.name.includes('RADIO') ||
      service.name.includes('TELEVISIÓN') ||
      service.name.includes('CINE')
    );
  }

  function shouldShowForInteralUse(): boolean {
    return service.type == 'CAMERA';
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
      <span class="truncate hover:underline cursor-pointer">{service.name}</span
      >
      {#each service.periods as servicePrice}
        <Button
          variant="outline"
          bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
          onclick={() => (selectedPeriod = servicePrice.interval)}
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
              onclick={() => (selectedPeriod = servicePrice.interval)}
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
            <Checkbox
              id="discInterior_{service.serviceId}"
              bind:checked={isInterior}
            />
            <Label for="discInterior_{service.serviceId}"
              >Descuento interior (-70%)</Label
            >
          </div>
        {/if}
        {#if shouldShowForInteralUse()}
          <div class="flex items-center gap-2">
            <Checkbox
              id="forInternalUse_{service.serviceId}"
              bind:checked={internalUse}
            />
            <Label for="forInternalUse_{service.serviceId}"
              >Para uso interno</Label
            >
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
        {#if service.name.includes('MAESTRO DE CEREMONIAS') || service.name.includes('CONDUCCIÓN DE SHOWS')}
          <Label for="selectedDate" class="px-1">Fecha</Label>
          <Popover.Root bind:open>
            <Popover.Trigger id="selectedDate">
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  class="w-32 justify-between font-normal"
                >
                  {selectedDate
                    ? selectedDate.toDate(getLocalTimeZone()).toLocaleDateString()
                    : "Seleccionar fecha"}
                  <ChevronDownIcon class="pe-2" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-auto overflow-hidden p-0" align="start">
              <Calendar
                type="single"
                bind:value={selectedDate}
                onValueChange={() => {
                  open = false;
                }}
                captionLayout="dropdown"
              />
            </Popover.Content>
          </Popover.Root>
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
          <Label for="ispriceSuggestion_{service.serviceId}"
            >Sugerir precio</Label
          >
          {#if isPriceSuggested}
            <Input
              class="w-25"
              id="suggestedPrice_{service.serviceId}"
              bind:value={priceSuggested}
              type="number"
            />
          {/if}
          <Checkbox
            id="canIvrUpdate{service.serviceId}"
            bind:checked={canIvrUpdate}
          />
          <Label for="canIvrUpdate{service.serviceId}">Actualizar IVR</Label>
          {#if canIvrUpdate}
            <Input
              class="w-20"
              id="Updates{service.serviceId}"
              bind:value={ivrUpdates}
              type="number"
            />
          {/if}
          <Checkbox
            id="canIvrGetMoreMessages{service.serviceId}"
            bind:checked={canIvrGetMoreMessages}
          />
          <Label for="canIvrGetMoreMessages{service.serviceId}"
            >Mensajes adicionales</Label
          >
          {#if canIvrGetMoreMessages}
            <Input
              class="w-20"
              id="additionalIvrMessages{service.serviceId}"
              bind:value={additionalIvrMessage}
              type="number"
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
          <Label for="ispriceSuggestion_{service.serviceId}"
            >Sugerir precio</Label
          >
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
          onclick={() => {
            handleAddPiece();
          }}
        >
          Agregar
        </Button>
      </div>
    </Accordion.Content>
  </Accordion.Item>
{/if}
