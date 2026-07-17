<script lang="ts">
	import BroadcasterGrid from './BroadcasterGrid.svelte';
	import BroadcasterDialog from './BroadcasterDialog.svelte';
  	import type { Broadcaster } from '$lib/graphql/schema';
  	import SearchFilters from './SearchFilters.svelte';
    import type { PageData } from './$types.js';
	let { data }: { data: PageData } = $props();
	let loading = $state(false);
	let broadcasters: Broadcaster[] = $state(data?.broadcasters);
	let selectedBroadcaster: Broadcaster | null = $state(null);
	let dialogOpen = $state(false);
	function handleOpenDetails(broadcaster: Broadcaster) {
		selectedBroadcaster = broadcaster;
		dialogOpen = true;
	}

</script>

<svelte:head>
	<title>Buscar locutores</title>
</svelte:head>

<div class="mx-auto max-w-6xl space-y-6 px-4 py-8">
	<div class="space-y-1">
		<h1 class="text-2xl font-semibold tracking-tight">Buscar locutores</h1>
	</div>
	<SearchFilters {loading} bind:broadcasters />
	<BroadcasterGrid {loading} bind:broadcasters onOpenDetails={handleOpenDetails} />
</div>

<BroadcasterDialog bind:open={dialogOpen} broadcaster={selectedBroadcaster} />
