<script lang="ts">
	import { toast } from 'svelte-sonner';
	import SearchFilters from './SearchFilters.svelte';
	import BroadcasterGrid from './BroadcasterGrid.svelte';
	import BroadcasterDialog from './BroadcasterDialog.svelte';
	import { BROADCASTER_QUERY } from '$lib/graphql/queries/user';
	import {
		ALL_OPTIONS_VALUE,
    type BroadcasterFilters,
	} from './broadcaster';
	import {fetchSkills} from '$lib/graphql/queries/skills';
	import {fetchLanguages} from '$lib/graphql/queries/languages';
  	import type { Broadcaster } from '$lib/graphql/schema';

	let filters: BroadcasterFilters = $state({
		firstName: '',
		lastName: '',
		skill: ALL_OPTIONS_VALUE,
		language: ALL_OPTIONS_VALUE
	});

	let broadcasters: Broadcaster[] = $state([]);

	let loading = $state(false);
	let optionsLoading = $state(true);

	let selectedBroadcaster: Broadcaster | null = $state(null);
	let dialogOpen = $state(false);

	async function onMount() {
		try {
			const [skills, languages] = await Promise.all([
				fetchSkills(),
				fetchLanguages()
			]);
		} catch {
			toast.error('Ocurrió un error al cargar la información.');
		}
	}

	async function searchBroadcasters() {
		loading = true;
		try {
			broadcasters = await fetchBroadcasters(filters);
		} catch {
			toast.error('Ocurrió un error al cargar la información.');
			broadcasters = [];
		} finally {
			loading = false;
		}
	}

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
		<p class="text-sm text-muted-foreground">
			Filtrá por nombre, apellido, aptitud e idioma para encontrar al locutor ideal.
		</p>
	</div>

	<SearchFilters
		bind:filters
		{skillOptions}
		{languageOptions}
		loading={loading || optionsLoading}
		onSearch={searchBroadcasters}
	/>

	<BroadcasterGrid {broadcasters} {loading} onOpenDetails={handleOpenDetails} />
</div>

<BroadcasterDialog bind:open={dialogOpen} broadcaster={selectedBroadcaster} />
