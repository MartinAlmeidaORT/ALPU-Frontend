<script lang="ts">
  import type { ServicesQuery } from '$lib/graphql/types/graphql';
  import { toast } from 'svelte-sonner';
  import ServicePeriod from './ServicePeriod.svelte';
  import type { ServicePeriod as ServicePeriodType } from '$lib/graphql/schema';
  import type { ServiceDate as ServiceDateType } from '$lib/graphql/schema';
  import type { ServiceIvr as ServiceIVRType } from '$lib/graphql/schema';
  import type { ServiceNarrative as ServiceNarrativeType } from '$lib/graphql/schema';
  import ServiceDate from './ServiceDate.svelte';
  import ServiceIVR from './ServiceIVR.svelte';
  import ServiceNarrative from './ServiceNarrative.svelte';
  import type { BaseServiceUI } from './Contract.svelte';
  type Service = NonNullable<ServicesQuery['services']>[number];

  let {
    service,
    onAddService = () => {},
  }: {
    service: Service;
    onAddService: (service: BaseServiceUI) => void;
  } = $props();

  function handleAddPiece(pieceName: string, BaseService: BaseServiceUI) {
    if (!pieceName || pieceName.trim() === '') {
      toast.error('Error al agregar un medio', {
        description: 'La pieza debe tener un nombre',
      });
      return;
    }
    BaseService.pieces.push({ name: pieceName });
  }

  function handleAddService(service: BaseServiceUI) {
    onAddService(service);
  }
</script>

{#if service.__typename === 'ServicePeriod'}
  <ServicePeriod
    bind:service={service as ServicePeriodType}
    {handleAddPiece}
    {handleAddService}
  />
{:else if service.__typename === 'ServiceDate'}
  <ServiceDate
    bind:service={service as ServiceDateType}
    {handleAddPiece}
    {handleAddService}
  />
{:else if service.__typename === 'ServiceIvr'}
  <ServiceIVR
    bind:service={service as ServiceIVRType}
    {handleAddPiece}
    {handleAddService}
  />
{:else if service.__typename === 'ServiceNarrative'}
  <ServiceNarrative
    bind:service={service as ServiceNarrativeType}
    {handleAddPiece}
    {handleAddService}
  />
{/if}
