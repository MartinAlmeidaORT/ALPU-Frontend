<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { Broadcaster } from '$lib/graphql/schema';
  import BroadcasterCard from './BroadcasterCard.svelte';
  import EmptyState from './EmptyState.svelte';

  type PageInfo = {
    hasNextPage: boolean;
    endCursor: string | null;
  };

  interface Props {
    loading: boolean;
    broadcasters: Broadcaster[];
    pageInfo?: PageInfo;
    onOpenDetails: (broadcaster: Broadcaster) => void;
  }
  let {
    loading,
    onOpenDetails,
    pageInfo,
    broadcasters = $bindable(),
  }: Props = $props();

  function nextPage() {
    if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
      const url = new URL($page.url);
      url.searchParams.set('after', pageInfo.endCursor);
      goto(url.pathname + url.search);
    }
  }

  function previousPage() {
    window.history.back();
  }
</script>

{#if loading}
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each Array(9) as _, i (i)}
      <Card.Root class="border-border/60 shadow-sm">
        <Card.Content class="flex flex-col items-center gap-4 p-6">
          <Skeleton class="size-24 rounded-full" />
          <Skeleton class="h-4 w-32" />
          <Skeleton class="h-10 w-full rounded-md" />
        </Card.Content>
      </Card.Root>
    {/each}
  </div>
{:else if (broadcasters?.length ?? 0) === 0}
  <EmptyState />
{:else}
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each broadcasters as broadcaster (broadcaster.userId)}
      <BroadcasterCard {broadcaster} {onOpenDetails} />
    {/each}
  </div>

  {#if pageInfo}
    <div class="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onclick={previousPage}
        disabled={!$page.url.searchParams.has('after')}
      >
        Anterior
      </Button>

      <Button
        variant="outline"
        size="sm"
        onclick={nextPage}
        disabled={!pageInfo?.hasNextPage}
      >
        Siguiente
      </Button>
    </div>
  {/if}
{/if}
