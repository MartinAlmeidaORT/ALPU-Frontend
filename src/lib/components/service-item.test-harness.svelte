<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import ServiceItem from './service-item.svelte';
  import type { ServicesQuery } from '$lib/graphql/types/graphql';

  type Service = NonNullable<ServicesQuery['services']>[number];

  let {
    service,
    onAddPiece = () => {},
  }: {
    service: Service;
    onAddPiece?: (pieceName: string, svc: Service, options: unknown) => void;
  } = $props();
</script>

<Accordion.Root type="single" class="w-full" value={String(service.serviceId)}>
  <ServiceItem {service} {onAddPiece} />
</Accordion.Root>
