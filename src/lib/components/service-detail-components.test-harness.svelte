<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import type {
    ServiceDate,
    ServiceIvr,
    ServiceNarrative,
    ServicePeriod,
  } from '$lib/graphql/schema';
  import type { CalendarDate } from '@internationalized/date';
  import ServiceDateComponent from './ServiceDate.svelte';
  import ServiceIVRComponent from './ServiceIVR.svelte';
  import ServiceNarrativeComponent from './ServiceNarrative.svelte';
  import ServicePeriodComponent from './ServicePeriod.svelte';

  type Kind = 'period' | 'date' | 'ivr' | 'narrative';
  type Service = ServicePeriod | ServiceDate | ServiceIvr | ServiceNarrative;

  let {
    kind,
    service,
    handleAddPiece = () => {},
  }: {
    kind: Kind;
    service: Service;
    handleAddPiece?: () => void;
  } = $props();

  let selectedPeriod = $state('');
  let isInterior = $state(false);
  let internalUse = $state(false);
  let nombrePieza = $state('');
  let broadcastInMassMedia = $state(false);
  let selectedDate = $state<CalendarDate | undefined>();
  let isPriceSuggested = $state(false);
  let priceSuggested = $state<number | null>(null);
  let canIvrUpdate = $state(false);
  let ivrUpdates = $state(0);
  let canIvrGetMoreMessages = $state(false);
  let additionalIvrMessage = $state(0);
  let ivrMessage = $state('');
  let isExtraRoles = $state(false);
  let extraRoles = $state<number | null>(0);
  let nonCommercialContent = $state(false);
  let lipSync = $state(false);
  let internetBroadcast = $state(false);
  let narrativeMinutes = $state<string | undefined>('');
</script>

<Accordion.Root type="single" value={String(service.serviceId)}>
  {#if kind === 'period'}
    <ServicePeriodComponent
      bind:service={service as ServicePeriod}
      bind:selectedPeriod
      bind:isInterior
      bind:internalUse
      bind:nombrePieza
      {handleAddPiece}
    />
  {:else if kind === 'date'}
    <ServiceDateComponent
      bind:service={service as ServiceDate}
      bind:broadcastInMassMedia
      bind:nombrePieza
      bind:selectedDate
      {handleAddPiece}
    />
  {:else if kind === 'ivr'}
    <ServiceIVRComponent
      bind:service={service as ServiceIvr}
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
  {:else if kind === 'narrative'}
    <ServiceNarrativeComponent
      bind:service={service as ServiceNarrative}
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
</Accordion.Root>

<output aria-label="selected-period">{selectedPeriod}</output>
<output aria-label="is-interior">{String(isInterior)}</output>
<output aria-label="internal-use">{String(internalUse)}</output>
<output aria-label="piece-name">{nombrePieza}</output>
<output aria-label="broadcast-in-mass-media">{String(broadcastInMassMedia)}</output>
<output aria-label="is-price-suggested">{String(isPriceSuggested)}</output>
<output aria-label="price-suggested">{priceSuggested ?? ''}</output>
<output aria-label="can-ivr-update">{String(canIvrUpdate)}</output>
<output aria-label="ivr-updates">{ivrUpdates}</output>
<output aria-label="can-ivr-get-more-messages">{String(canIvrGetMoreMessages)}</output>
<output aria-label="additional-ivr-message">{additionalIvrMessage}</output>
<output aria-label="ivr-message">{ivrMessage}</output>
<output aria-label="is-extra-roles">{String(isExtraRoles)}</output>
<output aria-label="extra-roles">{extraRoles ?? ''}</output>
<output aria-label="non-commercial-content">{String(nonCommercialContent)}</output>
<output aria-label="lip-sync">{String(lipSync)}</output>
<output aria-label="internet-broadcast">{String(internetBroadcast)}</output>
<output aria-label="narrative-minutes">{narrativeMinutes ?? ''}</output>
