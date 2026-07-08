<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import Label from '$lib/components/ui/label/label.svelte';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { ServiceDate } from '$lib/graphql/schema';
  import DatePicker from './DatePicker.svelte';
  import type { BaseService, ServiceEventUI } from './types';
  import { validateDate } from '$lib/browser/utils';

  let {
    service = $bindable(),
    handleAddPiece = () => {},
    handleAddService = () => {},
  }: ServiceDateData = $props();
  type ServiceDateData = {
    service: ServiceDate;
    handleAddPiece: (pieceName: string, baseService: BaseService) => void;
    handleAddService: (serviceUi: ServiceEventUI) => void;
  };

  let serviceUi = $state<ServiceEventUI>({
    id: service.serviceId,
    pieces: [],
    forMassBroadcast: false,
    date: undefined,
    type: service.type,
  });
  let pieceName = $state<string>('');

  function confirmService() {
    if (validateDate(serviceUi.date)) {
      handleAddPiece(pieceName, serviceUi);
      handleAddService(serviceUi);
    }
  }

</script>

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
            bind:checked={serviceUi.forMassBroadcast}
          />
          <Label for="broadcastInMassMedia_{service.serviceId}">
            Difusión en medios masivos (+30%)
          </Label>
        </div>
      {/if}
      <DatePicker bind:selectedDate={serviceUi.date} />
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
  </Accordion.Content>
</Accordion.Item>
