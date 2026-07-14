<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Loader2, Search } from 'lucide-svelte';
	import { ALL_OPTIONS_VALUE, type BroadcasterFilters, type SelectOption } from '$lib/types/broadcaster.js';

	interface Props {
		filters: BroadcasterFilters;
		skillOptions: SelectOption[];
		languageOptions: SelectOption[];
		loading?: boolean;
		onSearch: () => void;
	}

	let { filters = $bindable(), skillOptions, languageOptions, loading = false, onSearch }: Props =
		$props();

	const skillLabel = $derived(
		skillOptions.find((o) => o.value === filters.skill)?.label ?? 'Todas las aptitudes'
	);
	const languageLabel = $derived(
		languageOptions.find((o) => o.value === filters.language)?.label ?? 'Todos los idiomas'
	);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		onSearch();
	}
</script>

<Card.Root class="border-none shadow-sm">
	<Card.Content class="pt-6">
		<form onsubmit={handleSubmit} class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
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
				<Select.Root type="single" bind:value={filters.skill}>
					<Select.Trigger class="w-full">
						{skillLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value={ALL_OPTIONS_VALUE}>Todas las aptitudes</Select.Item>
						{#each skillOptions as option (option.value)}
							<Select.Item value={option.value}>{option.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="space-y-2">
				<Label>Idioma</Label>
				<Select.Root type="single" bind:value={filters.language}>
					<Select.Trigger class="w-full">
						{languageLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value={ALL_OPTIONS_VALUE}>Todos los idiomas</Select.Item>
						{#each languageOptions as option (option.value)}
							<Select.Item value={option.value}>{option.label}</Select.Item>
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
