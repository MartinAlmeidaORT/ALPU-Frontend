<script lang="ts">
  import { onMount } from 'svelte';
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { cn } from "$lib/utils.js";
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import type {
    LanguagesQuery,
    SkillsQuery,
  } from '$lib/graphql/types/graphql.js';
  import { fetchSkills } from '$lib/graphql/queries/skills';
  import { fetchLanguages } from '$lib/graphql/queries/languages';
  import { toast } from 'svelte-sonner';
  import { Command } from 'bits-ui';
  import * as Select from '$lib/components/ui/select/index.js';
  import type { PageData } from './$types.js';
  import { createUrqlClient } from '$lib/graphql/client';
  import type { Client } from '@urql/svelte';
  import type { Broadcaster } from './broadcaster.js';
  import { UPDATE_BROADCASTER_MUTATION } from '$lib/graphql/queries/user.js';
  import { fetchCountries } from '$lib/graphql/queries/country.js';
  import type { OperationResult } from '@urql/core';
  import type {
    CountriesQuery,
    DepartmentsQuery,
  } from '$lib/graphql/types/graphql';
  import { fetchDepartments } from '$lib/graphql/queries/department.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';

  let { data }: { data: PageData } = $props();

  let broadcaster: any = $state(data.broadcaster);
  let error: string | null = null;
  let skillOptions: SkillsQuery['skills'] = $state([]);
  let languageOptions: LanguagesQuery['languages'] = $state([]);
  let newSkills: string[] = $state([]);
  let newLanguages: string[] = $state([]);
  let skillsPopoverOpen = $state(false);
  let languagesPopoverOpen = $state(false);

  let photoInput: HTMLInputElement | null = $state(null);
  let photoPreview: string | null = $state(null);
  let countriesFetch = $state<OperationResult<CountriesQuery> | null>(null);
  let departmentsFetch = $state<OperationResult<DepartmentsQuery> | null>(null);
  let broadcasterUpdated: Broadcaster = $state( {
    firstName: broadcaster.firstName,
    lastName: broadcaster.lastName,
    email: broadcaster.email,
    phoneNumber: broadcaster.phoneNumber,
    website: broadcaster.website,
    description: broadcaster.description,
    address: {
      countryCode: undefined,
      departmentId: undefined,
      city: broadcaster.address.city,
      street: broadcaster.address.street,
    },
    skillIds: [],
    languageIds: [],
  });
  function labelFor(selected: string[], emptyLabel: string) {
    if (selected.length === 0) return emptyLabel;
    return `${selected.length} seleccionada${selected.length > 1 ? 's' : ''}`;
  }

   $effect(() => {
    if (broadcasterUpdated.address.countryCode) {
      fetchDepartments(broadcasterUpdated.address.countryCode).then((result) => {
        departmentsFetch = result;
      });
    }
  });

  let selectedCountryName = $derived(
    countriesFetch?.data?.countries.find(
      (c) => c.countryCode === broadcasterUpdated.address.countryCode,
    )?.name ?? 'Seleccionar país',
  );

  let selectedDepartmentName: string | undefined = $derived(
    departmentsFetch?.data?.departments.find(
      (d) => d.departmentId === Number(broadcasterUpdated.address.departmentId),
    )?.name ?? 'Seleccionar departamento',
  );

  $effect(() => {
    if (countriesFetch?.data?.countries) {
      const country = countriesFetch.data.countries.find(
        (c) => c.countryCode === broadcasterUpdated.address.countryCode,
      );
      selectedCountryName = country ? country.name : 'Seleccionar país';
    }
  });
       /* <div class="grid gap-3">
        <Label for="tabs-demo-photo">Foto</Label>
        <div class="flex items-center gap-4">
        {#if photoPreview}
          <img src={photoPreview} alt="Foto de perfil" class="size-16 rounded-full object-cover" />
        {:else if broadcaster?.photoUrl}
          <img src={broadcaster.photoUrl} alt="Foto de perfil" class="size-16 rounded-full object-cover" />
        {:else}
          <div class="flex size-16 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
          Sin foto
          </div>
        {/if}
        <input
          id="tabs-demo-photo"
          type="file"
          accept="image/*"
          class="hidden"
          bind:this={photoInput}
          onchange={handlePhotoChange}
        />
        <Button type="button" variant="outline" onclick={() => photoInput?.click()}>
          Subir foto
        </Button>
        </div>
     </div>
    
  function handlePhotoChange() {
  const file = photoInput?.files?.[0];
  if (!file) return;
  if (photoPreview) URL.revokeObjectURL(photoPreview);
  photoPreview = URL.createObjectURL(file);
  }*/

  const skillLabel = $derived(labelFor(newSkills, 'Ninguna aptitud seleccionada'));
  const languageLabel = $derived(labelFor(newLanguages, 'Ningún idioma seleccionado'));

  function toggleSkill(name: string) {
    newSkills = newSkills.includes(name)
      ? newSkills.filter((s) => s !== name)
      : [...newSkills, name];
  }

  function toggleLanguage(name: string) {
    newLanguages = newLanguages.includes(name)
      ? newLanguages.filter((l) => l !== name)
      : [...newLanguages, name];
  }

  onMount(async () => {
    countriesFetch = await fetchCountries();
    error = data.error || null;
    broadcasterUpdated.address.countryCode = broadcaster.address.country?.countryCode;
    broadcasterUpdated.address.departmentId = broadcaster.address.department?.departmentId;
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
    }
    newSkills = skillOptions
      .filter((skill) =>
        broadcaster?.skills?.some((s) => s.name === skill.name),
      )
      .map((skill) => skill.name);

    newLanguages = languageOptions
      .filter((language) =>
        broadcaster?.languages?.some((l) => l.name === language.name),
      )
      .map((language) => language.name);
  });

  async function handleSubmit() {
    try {
      const UpdateBroadcasterInput = broadcasterUpdated;
      const urqlClient: Client = createUrqlClient(data.token??undefined);
      const result = await urqlClient
        .mutation(UPDATE_BROADCASTER_MUTATION, { input: UpdateBroadcasterInput })
        .toPromise();
      if (result.error) {
        toast.error('Error al actualizar la información del perfil: ' + result.error.message);
        return;
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar la información del perfil.');
      return;
    }
    toast.success('Información del perfil actualizada con éxito.');
  };
</script>

<div class="mx-auto flex w-full max-w-sm flex-col gap-6 my-10">
 <Tabs.Root value="account">
  <Tabs.List>
   <Tabs.Trigger value="account">Información</Tabs.Trigger>
   <Tabs.Trigger value="skills">Aptitudes y Lenguajes</Tabs.Trigger>
   <Tabs.Trigger value="demos">Demos</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
   <Card.Root>
    <Card.Header>
     <Card.Title>Información</Card.Title>
     <Card.Description>
      Haz cambios a tu información de perfil aquí. Esta información se mostrará públicamente, así que ten cuidado con lo que compartes.
     </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-6">
     <div class="grid gap-3">
      <Label for="tabs-demo-name">Nombre</Label>
      <Input id="tabs-demo-name" bind:value={broadcasterUpdated.firstName} />
     </div>
     <div class="grid gap-3">
      <Label for="tabs-demo-last-name">Apellido</Label>
      <Input id="tabs-demo-last-name" bind:value={broadcasterUpdated.lastName} />
     </div>
      <div class="grid gap-3">
      <Label for="tabs-demo-email">email</Label>
      <Input id="tabs-demo-email" bind:value={broadcasterUpdated.email} />
     </div>
      <div class="grid gap-3">
      <Label for="pais">Pais</Label>
      <Select.Root
        name="countryCode"
        type="single"
        bind:value={broadcasterUpdated.address.countryCode}
      >
        <Select.Trigger id="countryCode" name="countryCode">
          <span>{selectedCountryName}</span>
        </Select.Trigger>
        <Select.Content>
          {#each countriesFetch?.data?.countries as country}
            <Select.Item value={country.countryCode}>
              {country.name}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
     </div>
      <div class="grid gap-3">
        <Label for="department">Departamento</Label>
        <Select.Root
          name="departmentId"
          type="single"
          bind:value={broadcasterUpdated.address.departmentId}
        >
          <Select.Trigger id="departmentId" name="departmentId">
            <span>{selectedDepartmentName}</span>
          </Select.Trigger>
          <Select.Content>
            {#each departmentsFetch?.data?.departments as department}
              <Select.Item value={String(department.departmentId)}>
                {department.name}
              </Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
     </div>
      <div class="grid gap-3">
      <Label for="tabs-demo-city">Ciudad</Label>
      <Input id="tabs-demo-city" bind:value={broadcasterUpdated.address.city} />
     </div>
      <div class="grid gap-3">
      <Label for="tabs-demo-street">Calle</Label>
      <Input id="tabs-demo-street" bind:value={broadcasterUpdated.address.street} />
     </div>
      <div class="grid gap-3">
      <Label for="tabs-demo-street">Teléfono</Label>
      <Input id="tabs-demo-street" bind:value={broadcasterUpdated.phoneNumber} />
     </div>
      <div class="grid gap-3">
      <Label for="tabs-demo-website">Sitio web</Label>
      <Input id="tabs-demo-website" bind:value={broadcasterUpdated.website} />
     </div>
      <div class="grid gap-3">
      <Label for="tabs-demo-description">Descripción</Label>
      <Textarea id="tabs-demo-description" bind:value={broadcasterUpdated.description} />
     </div>
    </Card.Content>
    <Card.Footer class="flex justify-end">
     <Button onclick={handleSubmit}>Guardar cambios</Button>
    </Card.Footer>
   </Card.Root>
  </Tabs.Content>
  <Tabs.Content value="skills">
   <Card.Root>
    <Card.Header>
     <Card.Title>Aptitudes y Lenguajes</Card.Title>
     <Card.Description>
      Selecciona tus aptitudes y lenguajes aquí. Esta información se mostrará públicamente, así que ten cuidado con lo que compartes.
     </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-6">
     <div class="grid gap-3">
      <Label for="skills-trigger">Aptitudes</Label>
      <Popover.Root bind:open={skillsPopoverOpen}>
       <Popover.Trigger id="skills-trigger">
        {#snippet child({ props })}
         <Button
          variant="outline"
          role="combobox"
          aria-expanded={skillsPopoverOpen}
          class="w-full justify-between font-normal"
          {...props}
         >
          {skillLabel}
          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
         </Button>
        {/snippet}
       </Popover.Trigger>
       <Popover.Content class="w-[--bits-popover-anchor-width] p-0">
        <Command.Root>
         <Command.List>
          <Command.Empty>No se encontraron aptitudes.</Command.Empty>
          <Command.Group class="flex flex-col gap-2">
           {#each skillOptions as skill (skill.name)}
            <Command.Item
             value={skill.name}
             onSelect={() => toggleSkill(skill.name)}
             class="pr-4"
            >
             <span class="flex items-center gap-2">
              <Check
               class={cn(
                "size-4 shrink-0",
                !newSkills.includes(skill.name) && "text-transparent",
               )}
              />
              {skill.name}
             </span>
            </Command.Item>
           {/each}
          </Command.Group>
         </Command.List>
        </Command.Root>
       </Popover.Content>
      </Popover.Root>
      {#if newSkills.length > 0}
       <div class="flex flex-wrap gap-2">
        {#each newSkills as skill (skill)}
         <span class="inline-flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          {skill}
         </span>
        {/each}
       </div>
      {/if}
     </div>

     <div class="grid gap-3">
      <Label for="languages-trigger">Lenguajes</Label>
      <Popover.Root bind:open={languagesPopoverOpen}>
       <Popover.Trigger id="languages-trigger">
        {#snippet child({ props })}
         <Button
          variant="outline"
          role="combobox"
          aria-expanded={languagesPopoverOpen}
          class="w-full justify-between font-normal"
          {...props}
         >
          {languageLabel}
          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
         </Button>
        {/snippet}
       </Popover.Trigger>
       <Popover.Content class="w-[--bits-popover-anchor-width] p-0">
        <Command.Root>
         <Command.List>
          <Command.Empty>No se encontraron idiomas.</Command.Empty>
          <Command.Group class="flex flex-col gap-2">
           {#each languageOptions as language (language.name)}
            <Command.Item
             value={language.name}
             onSelect={() => toggleLanguage(language.name)}
             class="pr-4"
            >
             <span class="flex items-center gap-2">
              <Check
               class={cn(
                "size-4 shrink-0",
                !newLanguages.includes(language.name) && "text-transparent",
               )}
              />
              {language.name}
             </span>
            </Command.Item>
           {/each}
          </Command.Group>
         </Command.List>
        </Command.Root>
       </Popover.Content>
      </Popover.Root>
      {#if newLanguages.length > 0}
       <div class="flex flex-wrap gap-2">
        {#each newLanguages as language (language)}
         <span class="inline-flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          {language}
         </span>
        {/each}
       </div>
      {/if}
     </div>
    </Card.Content>
    <Card.Footer class="flex justify-end">
     <Button>Guardar cambios</Button>
    </Card.Footer>
   </Card.Root>
  </Tabs.Content>
 </Tabs.Root>
</div>