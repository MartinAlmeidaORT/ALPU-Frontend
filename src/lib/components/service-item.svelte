<script lang="ts">

  import type { ServicesQuery } from '$lib/graphql/types/graphql';
  import { toast } from 'svelte-sonner';
  import ServicePeriod from './ServicePeriod.svelte';
  import type { CampaignServiceInput, ServicePeriod as ServicePeriodType } from '$lib/graphql/schema';
  import type { ServiceDate as ServiceDateType } from '$lib/graphql/schema';
  import type { ServiceIvr as ServiceIVRType } from '$lib/graphql/schema';
  import type { ServiceNarrative as ServiceNarrativeType } from '$lib/graphql/schema';
  import type { BaseService, ServiceEventUI, ServiceIvrUI, ServiceNarrativeUI, ServicePeriodUI } from '$lib/components/types';

  import ServiceDate from './ServiceDate.svelte';
  import ServiceIVR from './ServiceIVR.svelte';
  import ServiceNarrative from './ServiceNarrative.svelte';
  type Service = NonNullable<ServicesQuery['services']>[number];

  let {
    service,
    calculateService = () => {},
  }: {
    service: Service;
    calculateService: (service: CampaignServiceInput) => void;
  } = $props();

  function handleAddPiece(pieceName: string, BaseService: BaseService ) {
    if (!pieceName || pieceName.trim() === '') {
      toast.error('Error al agregar un medio', {
        description: 'La pieza debe tener un nombre',
      });
      return;
    }
    BaseService.pieces.push({ name: pieceName });
  }

  function handleAddService(service: BaseService) {
    let serviceInput : CampaignServiceInput | null = null;
    if (service.type == 'NARRATIVE') {
      const narrativeService = service as ServiceNarrativeUI;
      serviceInput = {
        serviceId: service.id,
        pieces: service.pieces,
          options: {
          minutes: narrativeService.narrativeMinutes,
          extraRoles: narrativeService.isExtraRoles,
          isNonCommercial: narrativeService.isNonCommercialContent,
          onInternet: narrativeService.isInternetBroadcast,
          hasLipSync: narrativeService.isLipSync,
          priceOverride: narrativeService.isPriceSuggested,
          date: narrativeService.date,
          },
        };
    } else if (service.type == 'IVR') {
      const ivrService = service as ServiceIvrUI;
      serviceInput = {
        serviceId: service.id,
        pieces: service.pieces,
          options: {
            messageText: ivrService.messageText,
            additionalMessages: ivrService.additionalMessages,
            isInterior: ivrService.isInterior,
            priceOverride: ivrService.priceOverride,
            updates: ivrService.updates,
            date: ivrService.date,
          },
        };
    } else if (service.type == 'EVENT') {
      const eventService = service as ServiceEventUI;
      serviceInput = {
        serviceId: service.id,
        pieces: service.pieces,
          options: {
            forMassBroadcast: eventService.forMassBroadcast,
            date: eventService.date,
          },
        };
    } else if (service.type == 'TV_GENERIC' || service.type == 'RADIO_GENERIC' || service.type == 'CINEMA' || service.type == 'TV_ZOCALO' || 
              service.type == 'RADIO_ZOCALO' || service.type == 'TV_HOST' || service.type == 'RADIO_HOST') {
      const periodService = service as ServicePeriodUI;
      serviceInput = {
        serviceId: service.id,
        pieces: service.pieces,
          options: {
            period: periodService.period,
            isInterior: periodService.isInterior,
          },
        };
    } else if (service.type == 'CAMERA') {
      const periodService = service as ServicePeriodUI;
      serviceInput = {
        serviceId: service.id,
        pieces: service.pieces,
          options: {
            period: periodService.period,
            forInternalUse: periodService.isInternalUse,
          },
        };
    } else if (service.type == 'INTERNET_VIDEO' || service.type == 'INTERNET_AUDIO' || service.type == 'OTHERS_VIDEO' || service.type == 'OTHERS_AUDIO' || service.type == 'OTHERS') {
      const periodService = service as ServicePeriodUI;
      serviceInput = {
        serviceId: service.id,
        pieces: service.pieces,
          options: {
            period: periodService.period,
          },
        };
    }
    if (!serviceInput) {
      toast.error('Error al agregar un medio', {
        description: 'Tipo de servicio no reconocido',
      });
      return;
    }
    calculateService(serviceInput);
  }
</script>

{#if service.__typename === 'ServicePeriod'}
  <ServicePeriod
    bind:service={service as ServicePeriodType}
    handleAddPiece={handleAddPiece}
    handleAddService={handleAddService}
  />
{:else if service.__typename === 'ServiceDate'}
  <ServiceDate
    bind:service={service as ServiceDateType}
    handleAddPiece={handleAddPiece}
    handleAddService={handleAddService}
  />
{:else if service.__typename === 'ServiceIvr'}
  <ServiceIVR
    bind:service={service as ServiceIVRType}
    handleAddPiece={handleAddPiece}
    handleAddService={handleAddService}
  />
{:else if service.__typename === 'ServiceNarrative'}
  <ServiceNarrative
    bind:service={service as ServiceNarrativeType}
    handleAddPiece={handleAddPiece}
    handleAddService={handleAddService}
  />
{/if}
