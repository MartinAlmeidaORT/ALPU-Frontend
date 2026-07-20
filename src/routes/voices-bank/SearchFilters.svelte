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
  import type {
    LanguagesQuery,
    SkillsQuery,
  } from '$lib/graphql/types/graphql.js';
  import type { BroadcasterFilters } from './broadcaster';
  import { fetchBroadcasters } from '$lib/graphql/queries/user';
  import type { Broadcaster } from '$lib/graphql/schema';

  interface Props {
    loading: boolean;
    broadcasters: Broadcaster[];
  }

  let filters = $state<BroadcasterFilters>({
    firstName: '',
    lastName: '',
    skills: [],
    languages: [],
  });

  let { loading, broadcasters = $bindable() }: Props = $props();
  let pagination = $state({
    first: 15,
    after: null,
  });

  function buildWhere(filters: BroadcasterFilters) {
    const where: Record<string, unknown> = {
      userState: { eq: 'ENABLED' },
    };

    if (filters.firstName) where.firstName = { contains: filters.firstName };
    if (filters.lastName) where.lastName = { contains: filters.lastName };
    if (filters.skills?.length)
      where.skills = { some: { skillId: { in: filters.skills } } };
    if (filters.languages?.length)
      where.languages = { some: { languageId: { in: filters.languages } } };

    return where;
  }

  let skillOptions: SkillsQuery['skills'] = $state([]);
  let languageOptions: LanguagesQuery['languages'] = $state([]);
  let loadingOptions = $state(true);

  onMount(async () => {
    try {
      const [skillsFetch, languagesFetch] = await Promise.all([
        fetchSkills(),
        fetchLanguages(),
      ]);
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

  async function onSearch() {
    try {
      let where = buildWhere(filters);
      let broadcastersFiltered = await fetchBroadcasters(pagination, where);
      broadcasters = broadcastersFiltered.data?.broadcastersPaged?.nodes ?? [];
    } catch (error) {
      toast.error('Ocurrió un error al aplicar los filtros de búsqueda.');
    }
  }

  function labelFor(
    options: { value: string; label: string }[],
    selected: string[],
  ) {
    if (selected.length === 0) return null;
    return `${selected.length} seleccionadas`;
  }

  const skillLabel = $derived(
    labelFor(skillOptions, filters.skills) ?? 'Todas las aptitudes',
  );
  const languageLabel = $derived(
    labelFor(languageOptions, filters.languages) ?? 'Todos los idiomas',
  );

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    onSearch();
  }
</script>

<Card.Root class="border-none shadow-sm">
  <p class="text-sm text-muted-foreground text-center pt-0">
    Filtrá por nombre, apellido, aptitud e idioma para encontrar al locutor
    ideal.
  </p>
  <Card.Content class="pt-2">
    <form
      onsubmit={handleSubmit}
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
    >
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
              <Select.Item
                value={option.skillId}
                datatype="number"
                label={option.name}
              >
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
              <Select.Item
                value={option.languageId}
                datatype="number"
                label={option.name}
              >
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
