<script lang="ts">

  import type { ServicesQuery } from '$lib/graphql/types/graphql';
  import { toast } from 'svelte-sonner';
  import type { CalendarDate } from '@internationalized/date';
  import ServicePeriod from './ServicePeriod.svelte';
  import type { ServicePeriod as ServicePeriodType } from '$lib/graphql/schema';
  import type { ServiceDate as ServiceDateType } from '$lib/graphql/schema';
  import type { ServiceIvr as ServiceIVRType } from '$lib/graphql/schema';
  import type { ServiceNarrative as ServiceNarrativeType } from '$lib/graphql/schema';
  import type { BaseService } from '$lib/components/types';

  import ServiceDate from './ServiceDate.svelte';
  import ServiceIVR from './ServiceIVR.svelte';
  import ServiceNarrative from './ServiceNarrative.svelte';
  type Service = NonNullable<ServicesQuery['services']>[number];

  let {
    service,
    onAddPiece = () => {},
  }: {
    service: Service;
    onAddPiece?: (pieceName: string, svc: Service, options: any) => void;
  } = $props();

  function handleAddPiece(BaseService: BaseService, pieceName: string) {
    if (!pieceName || pieceName.trim() === '') {
      toast.error('Error al agregar un medio', {
        description: 'La pieza debe tener un nombre',
      });
      return;
    }
    BaseService.pieces.push({ name: pieceName });

    /////////////////////////////////////////////
    if (
      (service.type === 'NARRATIVE' || service.type === 'IVR' || service.type === 'EVENT') &&
      (!selectedDate || selectedDate.toString() === '')
    ) {
      toast.error('Error al agregar un medio', {
        description: 'Debe seleccionar una fecha',
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
        options.extraRoles = extraRoles;
        options.date = selectedDate?.toString();
        break;
      case 'IVR':
        options.messageText = ivrMessage;
        options.additionalMessages = additionalIvrMessage;
        options.isInterior = isInterior;
        options.priceOverride = priceSuggested;
        options.updates = ivrUpdates;
        options.date = selectedDate?.toString();
        break;
      case 'EVENT':
        options.ForMassBroadcast = broadcastInMassMedia;
        options.date = selectedDate?.toString();
        break;
      case 'OTHERS_VIDEO':
        options.period = selectedPeriod;
        break;
      case 'OTHERS_AUDIO':
        options.period = selectedPeriod;
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
    selectedDate = undefined;
    canIvrUpdate = false;
    canIvrGetMoreMessages = false;
    additionalIvrMessage = 0;
    extraRoles = 0;
    internalUse = false;
  }
</script>

{#if service.__typename === 'ServicePeriod'}
  <ServicePeriod
    bind:service={service as ServicePeriodType}
    {handleAddPiece}
  />
{:else if service.__typename === 'ServiceDate'}
  <ServiceDate
    bind:service={service as ServiceDateType}
    bind:broadcastInMassMedia
    bind:nombrePieza
    bind:selectedDate
    {handleAddPiece}
  />
{:else if service.__typename === 'ServiceIvr'}
  <ServiceIVR
    bind:service={service as ServiceIVRType}
    bind:nombrePieza
    bind:isPriceSuggested
    bind:priceSuggested
    bind:canIvrUpdate
    bind:ivrUpdates
    bind:canIvrGetMoreMessages
    bind:additionalIvrMessage
    bind:ivrMessage
    bind:selectedDate
    {handleAddPiece}
  />
{:else if service.__typename === 'ServiceNarrative'}
  <ServiceNarrative
    bind:service={service as ServiceNarrativeType}
    bind:nombrePieza
    bind:isPriceSuggested
    bind:priceSuggested
    bind:isExtraRoles
    bind:extraRoles
    bind:nonCommercialContent
    bind:lipSync
    bind:internetBroadcast
    bind:narrativeMinutes
    bind:selectedDate
    {handleAddPiece}
  />
{/if}
