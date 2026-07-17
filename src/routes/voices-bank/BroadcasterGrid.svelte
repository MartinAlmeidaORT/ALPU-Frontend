<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  	import type { Broadcaster } from '$lib/graphql/schema';
	import BroadcasterCard from './BroadcasterCard.svelte';
	import EmptyState from './EmptyState.svelte';
  import { page } from '$app/state';

	interface Props {
		loading: boolean;
		onOpenDetails: (broadcaster: Broadcaster) => void;
	}
	let { loading, onOpenDetails }: Props = $props();
</script>

{#if loading}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each Array(6) as _, i (i)}
			<Card.Root class="border-border/60 shadow-sm">
				<Card.Content class="flex flex-col items-center gap-4 p-6">
					<Skeleton class="size-24 rounded-full" />
					<Skeleton class="h-4 w-32" />
					<Skeleton class="h-10 w-full rounded-md" />
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
{:else if (page?.data?.broadcasters?.length ?? 0) === 0}
	<EmptyState />
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each page?.data?.broadcasters as broadcaster (broadcaster.userId)}
			<BroadcasterCard {broadcaster} {onOpenDetails} />
		{/each}
	</div>
{/if}
