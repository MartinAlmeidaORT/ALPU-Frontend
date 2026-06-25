<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import Label from '$lib/components/ui/label/label.svelte';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import type { ServiceNarrative } from '$lib/graphql/schema';
  import DatePicker from './DatePicker.svelte';
  import type { CalendarDate } from '@internationalized/date';

  let {
    service = $bindable(),
    nombrePieza = $bindable(),
    isPriceSuggested = $bindable(),
    priceSuggested = $bindable(),
    isExtraRoles = $bindable(),
    extraRoles = $bindable(),
    nonCommercialContent = $bindable(),
    lipSync = $bindable(),
    internetBroadcast = $bindable(),
    narrativeMinutes = $bindable(),
    selectedDate = $bindable(),
    handleAddPiece = () => {},
  }: ServiceNarrativeData = $props();
  type ServiceNarrativeData = {
    service: ServiceNarrative;
    nombrePieza: string;
    isPriceSuggested: boolean;
    priceSuggested: number | null;
    isExtraRoles: boolean;
    extraRoles: number | null;
    nonCommercialContent: boolean;
    lipSync: boolean;
    internetBroadcast: boolean;
    narrativeMinutes: string | undefined;
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
        <Label for="ispriceSuggestion_{service.serviceId}">Sugerir precio</Label
        >
        {#if isPriceSuggested}
          <Input
            class="w-40"
            id="suggestedPrice_{service.serviceId}"
            bind:value={priceSuggested}
            type="number"
            placeholder="Precio sugerido"
          />
        {/if}
        <Checkbox
          id="isExtraRoles_{service.serviceId}"
          bind:checked={isExtraRoles}
        />
        <Label for="isExtraRoles_{service.serviceId}">Roles extra</Label>
        {#if isExtraRoles}
          <Input
            class="w-20"
            id="extraRoles_{service.serviceId}"
            bind:value={extraRoles}
            type="number"
            placeholder="Roles extra"
          />
        {/if}
        <DatePicker bind:selectedDate />
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
