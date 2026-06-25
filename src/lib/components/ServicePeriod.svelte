<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import Label from '$lib/components/ui/label/label.svelte';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { ServicePeriod } from '$lib/graphql/schema';

  let {
    service = $bindable(),
    selectedPeriod = $bindable(),
    isInterior = $bindable(),
    internalUse = $bindable(),
    nombrePieza = $bindable(),
    handleAddPiece = () => {},
  }: ServicePeriodData = $props();
  type ServicePeriodData = {
    service: ServicePeriod;
    selectedPeriod: string;
    isInterior: boolean;
    internalUse: boolean;
    nombrePieza: string;
    handleAddPiece: () => void;
  };

  function shouldShowSubsiguiente(): boolean {
    return !(
      service.name.includes('PRESENTACIÓN DE PROGRAMAS') ||
      service.name.includes('LOCUCIÓN A CÁMARA') ||
      service.name.includes('ZÓCALO') ||
      service.name.includes('NOTICIA EMPRESARIAL')
    );
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
</script>

<Accordion.Item value={String(service.serviceId)}>
  <Accordion.Trigger
    class="grid grid-cols-[1fr_repeat(5,70px)] gap-2 min-h-16 px-2 items-center"
  >
    <span class="truncate hover:underline cursor-pointer">{service.name}</span>
    {#each service.periods as servicePrice}
      <Button
        variant="outline"
        bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
        onclick={() => (selectedPeriod = servicePrice.interval)}
        class="flex-1"
      >
        ${servicePrice.basePrice}
      </Button>
    {/each}
  </Accordion.Trigger>
  <Accordion.Content class="flex flex-col gap-4 text-balance">
    {#if shouldShowSubsiguiente()}
      <div
        class="grid grid-cols-[1fr_repeat(5,70px)] gap-2 px-2 pb-3 mb-2 border-b border-border items-center"
      >
        <span
          class="truncate text-sm font-medium text-muted-foreground uppercase tracking-wider"
        >
          Subsiguiente
        </span>
        {#each service.periods as servicePrice}
          <div class="text-center text-sm font-medium text-muted-foreground">
            ${servicePrice.extraPrice}
          </div>
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
