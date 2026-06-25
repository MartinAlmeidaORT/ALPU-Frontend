<script lang="ts">
    import * as Accordion from '$lib/components/ui/accordion/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Checkbox } from '$lib/components/ui/checkbox/index.js';
    import Label from '$lib/components/ui/label/label.svelte';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Textarea } from '$lib/components/ui/textarea/index.js';
    import type { ServiceIvr } from '$lib/graphql/schema';
    import DatePicker from './DatePicker.svelte';
    import type { CalendarDate } from '@internationalized/date';
    
    let {
        service = $bindable(),
        nombrePieza = $bindable(),
        isPriceSuggested = $bindable(),
        priceSuggested = $bindable(),
        canIvrUpdate = $bindable(),
        ivrUpdates = $bindable(),
        canIvrGetMoreMessages = $bindable(),
        additionalIvrMessage = $bindable(),
        ivrMessage = $bindable(),
        selectedDate = $bindable(),
        handleAddPiece = () => {},
    }: ServiceIvrData = $props();
    type ServiceIvrData = {
        service: ServiceIvr;
        nombrePieza: string;
        isPriceSuggested: boolean;
        priceSuggested: number | null;
        canIvrUpdate: boolean;
        ivrUpdates: number;
        canIvrGetMoreMessages: boolean;
        additionalIvrMessage: number;
        ivrMessage: string;
        selectedDate: CalendarDate | undefined;
        handleAddPiece: () => void;
    };
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
          <DatePicker bind:selectedDate={selectedDate} />
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