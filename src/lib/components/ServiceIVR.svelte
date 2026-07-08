<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import Label from '$lib/components/ui/label/label.svelte';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import type { ServiceIvr } from '$lib/graphql/schema';
  import DatePicker from './DatePicker.svelte';
  import type { ServiceIvrUI, BaseService } from './types';
  import { validateDate } from '$lib/browser/utils';
  import { toast } from 'svelte-sonner';

  let {
    service = $bindable(),
    handleAddPiece = () => {},
    handleAddService = () => {},
  }: ServiceIvrData = $props();
  type ServiceIvrData = {
    service: ServiceIvr;
    handleAddPiece: (pieceName: string, baseService: BaseService) => void;
    handleAddService: (serviceUi: ServiceIvrUI) => void;
  };

  let serviceUi = $state<ServiceIvrUI>({
    id: service.serviceId,
    pieces: [],
    messageText: '',
    additionalMessages: 0,
    isInterior: false,
    priceOverride: null,
    updates: null,
    date: undefined,
    type: service.type,
  });
  let pieceName = $state<string>('');

  let isPriceSuggested = $state<boolean>(false);
  let areAdditionalMessages = $state<boolean>(false);
  let hasUpdates = $state<boolean>(false);

    function confirmService() {
      if (validateIvr()) {
        handleAddPiece(pieceName, serviceUi);
        handleAddService(serviceUi);
      }
    }

    function validateIvr() {
      if (!validateDate(serviceUi.date)) {
        return false;
      }
      if (isPriceSuggested && (serviceUi.priceOverride === null || serviceUi.priceOverride <= service.basePrice)) {
        toast.error('Error al agregar un medio', {
          description: 'Debe ingresar un precio sugerido válido y mayor al mínimo',
        });
        return false;
      }
      if (areAdditionalMessages && (serviceUi.additionalMessages === null || serviceUi.additionalMessages < 0)) {
        toast.error('Error al agregar un medio', {
          description: 'Debe ingresar una cantidad válida de mensajes adicionales',
        });
        return false;
      }
      if (hasUpdates && (serviceUi.updates === null || serviceUi.updates < 0)) {
        toast.error('Error al agregar un medio', {
          description: 'Debe ingresar una cantidad válida de actualizaciones',
        });
        return false;
      }
      return true;
    }
</script>

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
        <Label for="ispriceSuggestion_{service.serviceId}">Sugerir precio</Label
        >
        {#if isPriceSuggested}
          <Input
            class="w-25"
            id="suggestedPrice_{service.serviceId}"
            bind:value={serviceUi.priceOverride}
            type="number"
          />
        {/if}
        <Checkbox
          id="canIvrUpdate{service.serviceId}"
          bind:checked={hasUpdates}
        />
        <Label for="canIvrUpdate{service.serviceId}">Actualizar IVR</Label>
        {#if hasUpdates}
          <Input
            class="w-20"
            id="Updates{service.serviceId}"
            bind:value={serviceUi.updates}
            type="number"
          />
        {/if}
        <Checkbox
          id="canIvrGetMoreMessages{service.serviceId}"
          bind:checked={areAdditionalMessages}
        />
        <Label for="canIvrGetMoreMessages{service.serviceId}"
          >Mensajes adicionales</Label
        >
        {#if areAdditionalMessages}
          <Input
            class="w-20"
            id="additionalIvrMessages{service.serviceId}"
            bind:value={serviceUi.additionalMessages}
            type="number"
          />
        {/if}
        <DatePicker bind:selectedDate={serviceUi.date} />
      </div>
      <div class="flex items-center gap-2">
        <Label for="nombrePieza_{service.serviceId}">Nombre</Label>
        <Input
          id="nombrePieza_{service.serviceId}"
          bind:value={pieceName}
          type="text"
          placeholder="Nombre de la pieza"
        />
      </div>
      <Button
        type="button"
        class="col-span-2"
        variant="outline"
        bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white"
        onclick={() => confirmService()}
      >
        Agregar
      </Button>
    </div>
    <div class="items-center gap-2 px-2">
      <Label for="ivrMessage_{service.serviceId}" class="py-2">Mensaje</Label>
      <Textarea
        id="ivrMessage_{service.serviceId}"
        bind:value={serviceUi.messageText}
        placeholder="Ingrese su mensaje"
      />
    </div>
  </Accordion.Content>
</Accordion.Item>
