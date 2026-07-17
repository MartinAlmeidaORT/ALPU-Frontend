<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Loader2, Search } from 'lucide-svelte';
	import { fetchSkills } from '$lib/graphql/queries/skills.js';
	import { fetchLanguages } from '$lib/graphql/queries/languages.js';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import type { LanguagesQuery, SkillsQuery } from '$lib/graphql/types/graphql.js';
  	import type { BroadcasterFilters } from './broadcaster';
  import { page } from '$app/state';
  import { fetchBroadcasters } from '$lib/graphql/queries/user';

	interface Props {
		loading?: boolean;
	}

	let filters = $state<BroadcasterFilters>({
		firstName: '',
		lastName: '',
		skills: [],
		languages: []
	});

	let pagination = $state({
		first: 15,
		after: 'MG=='
	});
	let { loading = false }: Props = $props();

	let skillOptions: SkillsQuery['skills'] = $state([]);
	let languageOptions: LanguagesQuery['languages'] = $state([]);
	let loadingOptions = $state(true);

	onMount(async () => {
		try {
			const [skillsFetch, languagesFetch] = await Promise.all([fetchSkills(), fetchLanguages()]);
			if (!skillsFetch.error && !languagesFetch.error) {
				skillOptions = skillsFetch.data?.skills ?? [];
				languageOptions = languagesFetch.data?.languages ?? [];
			} else {
				toast.error('Ocurrió un error al cargar las opciones de búsqueda.');
			}
		} catch {
			toast.error('Ocurrió un error al cargar las opciones de búsqueda.');
		} finally {
			loadingOptions = false;
		}
	});

	function onSearch() {
		/*const queryParams = new URLSearchParams();
		if (filters.firstName) queryParams.append('firstName', filters.firstName);
		if (filters.lastName) queryParams.append('lastName', filters.lastName);
		if (filters.skills.length > 0) queryParams.append('skills', filters.skills.join(','));
		if (filters.languages.length > 0) queryParams.append('languages', filters.languages.join(','));

		const newUrl = `/voices-bank?${queryParams.toString()}`;
		history.pushState(null, '', newUrl);*/
		try {
			let broadcastersFiltered = fetchBroadcasters(pagination,filters);
			page.data.broadcasters = broadcastersFiltered;
		} catch (error) {
			toast.error('Ocurrió un error al aplicar los filtros de búsqueda.');
		}
	}

	function labelFor(options: { value: string; label: string }[], selected: string[]) {
		if (selected.length === 0) return null;
		return `${selected.length} seleccionadas`;
	}

	const skillLabel = $derived(labelFor(skillOptions, filters.skills) ?? 'Todas las aptitudes');
	const languageLabel = $derived(labelFor(languageOptions, filters.languages) ?? 'Todos los idiomas');

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		onSearch();
	}
</script>

<Card.Root class="border-none shadow-sm">
	<Card.Content class="pt-6">
		<form
			onsubmit={handleSubmit}
			class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
		>
			<p class="text-sm text-muted-foreground">
				Filtrá por nombre, apellido, aptitud e idioma para encontrar al locutor ideal.
			</p>
			<div class="space-y-2">
				<Label for="firstName">Nombre</Label>
				<Input
					id="firstName"
					placeholder="Buscar por nombre"
					bind:value={filters.firstName}
					autocomplete="off"
				/>
			</div>

			<div class="space-y-2">
				<Label for="lastName">Apellido</Label>
				<Input
					id="lastName"
					placeholder="Buscar por apellido"
					bind:value={filters.lastName}
					autocomplete="off"
				/>
			</div>

			<div class="space-y-2">
				<Label>Aptitud</Label>
				<Select.Root type="multiple" bind:value={filters.skills}>
					<Select.Trigger class="w-full" disabled={loadingOptions}>
						{skillLabel}
					</Select.Trigger>
					<Select.Content>
						{#each skillOptions as option (option.skillId)}
							<Select.Item value={String(option.skillId)} label={option.name}>
								{option.name}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="space-y-2">
				<Label>Idioma</Label>
				<Select.Root type="multiple" bind:value={filters.languages}>
					<Select.Trigger class="w-full" disabled={loadingOptions}>
						{languageLabel}
					</Select.Trigger>
					<Select.Content>
						{#each languageOptions as option (option.languageId)}
							<Select.Item value={String(option.languageId)} label={option.name}>
								{option.name}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<Button type="submit" class="w-full lg:w-auto" disabled={loading}>
				{#if loading}
					<Loader2 class="mr-2 size-4 animate-spin" />
				{:else}
					<Search class="mr-2 size-4" />
				{/if}
				Buscar
			</Button>
		</form>
	</Card.Content>
</Card.Root>