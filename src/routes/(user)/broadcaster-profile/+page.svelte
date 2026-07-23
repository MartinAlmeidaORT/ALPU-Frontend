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
  import { CONFIRM_BROADCASTER_DEMO_UPDATE_MUTATION, REQUEST_BROADCASTER_DEMO_UPDATE_MUTATION, UPDATE_BROADCASTER_MUTATION } from '$lib/graphql/queries/user.js';
  import { REQUEST_BROADCASTER_PROFILE_PICTURE_UPDATE_MUTATION, CONFIRM_BROADCASTER_PROFILE_PICTURE_UPDATE_MUTATION } from '$lib/graphql/queries/user.js';
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
  let demos: { audioUrl: string; fileKey: string }[] = $state(broadcaster.demos ?? []);
  let demoInput: HTMLInputElement | null = $state(null);
  let uploadingDemo = $state(false);
  let photoInput: HTMLInputElement | null = $state(null);
  let photoPreview: string | null = $state(data.broadcaster.profilePictureUrl ?? null);
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
    skillIds: broadcaster.skills?.map((skill) => skill.skillId) ?? [],
    languageIds: broadcaster.languages?.map((language) => language.languageId) ?? [],
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

  async function handlePhotoChange() {
    const file = photoInput?.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    photoPreview = URL.createObjectURL(file);
    try {
      const urqlClient: Client = createUrqlClient(data.token??undefined);
      const requestResult = await urqlClient
        .mutation(REQUEST_BROADCASTER_PROFILE_PICTURE_UPDATE_MUTATION, { fileName: file.name })
        .toPromise();
      if (requestResult.error) {
        toast.error('Error al solicitar la actualización de la foto de perfil: ' + requestResult.error.message);
        return;
      }
      const requestData = requestResult.data?.requestProfilePictureUploadUrl;
      if (!requestData) {
        toast.error('No se recibió una URL de carga válida.');
        return;
      }

      const uploadResponse = await fetch(requestData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadResponse.ok) {
        toast.error('Error al subir la imagen.');
        return;
      }
      const confirmResult = await urqlClient
        .mutation(CONFIRM_BROADCASTER_PROFILE_PICTURE_UPDATE_MUTATION, { key: requestData.key })
        .toPromise();
      if (confirmResult.error) {
        toast.error('Error al confirmar la actualización de la foto de perfil: ' + confirmResult.error.message);
        return;
      }
      toast.success('Foto de perfil actualizada con éxito.');
    } catch (error) {
      toast.error('Ocurrió un error al actualizar la foto de perfil.');
    }
  }

  async function handleDemoUpload() {
    const file = demoInput?.files?.[0];
    if (!file) return;
    uploadingDemo = true;
    try {
      const urqlClient: Client = createUrqlClient(data.token ?? undefined);
      const requestResult = await urqlClient
        .mutation(REQUEST_BROADCASTER_DEMO_UPDATE_MUTATION, { fileName: file.name })
        .toPromise();
      if (requestResult.error) {
        toast.error('Error al solicitar la subida de la demo: ' + requestResult.error.message);
        return;
      }
      const requestData = requestResult.data?.requestDemoUploadUrl;
      if (!requestData) {
        toast.error('No se recibió una URL de carga válida.');
        return;
      }

      const uploadResponse = await fetch(requestData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadResponse.ok) {
        toast.error('Error al subir la demo.');
        return;
      }

      const confirmResult = await urqlClient
        .mutation(CONFIRM_BROADCASTER_DEMO_UPDATE_MUTATION, { key: requestData.key })
        .toPromise();
      if (confirmResult.error) {
        toast.error('Error al confirmar la subida de la demo: ' + confirmResult.error.message);
        return;
      }

      const newDemo = confirmResult.data?.confirmBroadcasterDemoUpload;
      if (newDemo) demos = [...demos, newDemo];
      toast.success('Demo subida con éxito.');
    } catch (error) {
      toast.error('Ocurrió un error al subir la demo.');
    } finally {
      uploadingDemo = false;
      if (demoInput) demoInput.value = '';
    }
  }

  async function handleDemoDelete(demoId: number) {
    try {
      const urqlClient: Client = createUrqlClient(data.token ?? undefined);
      const result = await urqlClient
        .mutation(DELETE_BROADCASTER_DEMO_MUTATION, { demoId })
        .toPromise();
      if (result.error) {
        toast.error('Error al eliminar la demo: ' + result.error.message);
        return;
      }
      demos = demos.filter((d) => d.fileKey !== demoId);
      toast.success('Demo eliminada con éxito.');
    } catch (error) {
      toast.error('Ocurrió un error al eliminar la demo.');
    }
  }

  const skillLabel = $derived(labelFor(newSkills, 'Ninguna aptitud seleccionada'));
  const languageLabel = $derived(labelFor(newLanguages, 'Ningún idioma seleccionado'));

  function toggleSkill(name: string, skillId: number) {
    newSkills = newSkills.includes(name)
      ? newSkills.filter((s) => s !== name)
      : [...newSkills, name];

    broadcasterUpdated.skillIds = broadcasterUpdated.skillIds.includes(skillId)
      ? broadcasterUpdated.skillIds.filter((id) => id !== skillId)
      : [...broadcasterUpdated.skillIds, skillId];
  }

  function toggleLanguage(name: string, languageId: number) {
    newLanguages = newLanguages.includes(name)
      ? newLanguages.filter((l) => l !== name)
      : [...newLanguages, name];

    broadcasterUpdated.languageIds = broadcasterUpdated.languageIds.includes(languageId)
      ? broadcasterUpdated.languageIds.filter((id) => id !== languageId)
      : [...broadcasterUpdated.languageIds, languageId];
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

<div class="mx-auto flex w-full max-w-lg flex-col gap-6 my-10">
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
     <div class="flex items-center gap-4">
      <div class="flex flex-col items-center gap-2 shrink-0">
       <button
        type="button"
        class="group relative size-20 overflow-hidden rounded-full border"
        onclick={() => photoInput?.click()}
       >
        {#if photoPreview}
         <img src={photoPreview} alt="Foto de perfil" class="size-20 rounded-full object-cover" />
        {:else if broadcaster?.photoUrl}
         <img src={broadcaster.photoUrl} alt="Foto de perfil" class="size-20 rounded-full object-cover" />
        {:else}
         <div class="flex size-20 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
          Sin foto
         </div>
        {/if}
        <div class="absolute inset-0 flex items-center justify-center bg-black/0 text-transparent transition group-hover:bg-black/40 group-hover:text-white">
         <span class="text-xs">Cambiar</span>
        </div>
       </button>
       <input
        id="tabs-demo-photo"
        type="file"
        accept="image/*"
        class="hidden"
        bind:this={photoInput}
        onchange={handlePhotoChange}
       />
      </div>
      <div class="flex flex-1 flex-col gap-3">
       <div class="grid gap-3">
        <Label for="tabs-demo-name">Nombre</Label>
        <Input id="tabs-demo-name" bind:value={broadcasterUpdated.firstName} />
       </div>
       <div class="grid gap-3">
        <Label for="tabs-demo-last-name">Apellido</Label>
        <Input id="tabs-demo-last-name" bind:value={broadcasterUpdated.lastName} />
       </div>
      </div>
     </div>
      <div class="grid gap-3">
      <Label for="tabs-demo-email">email</Label>
      <Input id="tabs-demo-email" bind:value={broadcasterUpdated.email} />
     </div>
      <div class="grid grid-cols-2 gap-4">
      <div class="grid gap-3">
      <Label for="pais">Pais</Label>
      <Select.Root
        name="countryCode"
        type="single"
        bind:value={broadcasterUpdated.address.countryCode}
      >
        <Select.Trigger id="countryCode" name="countryCode" class="w-full">
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
          <Select.Trigger id="departmentId" name="departmentId" class="w-full">
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
     </div>
      <div class="grid grid-cols-2 gap-4">
      <div class="grid gap-3">
      <Label for="tabs-demo-city">Ciudad</Label>
      <Input id="tabs-demo-city" bind:value={broadcasterUpdated.address.city} />
     </div>
      <div class="grid gap-3">
      <Label for="tabs-demo-street">Calle</Label>
      <Input id="tabs-demo-street" bind:value={broadcasterUpdated.address.street} />
     </div>
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
            onSelect={() => toggleSkill(skill.name, skill.skillId)}
            class="pr-4 cursor-pointer select-none"
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
            onSelect={() => toggleLanguage(language.name, language.languageId)}
            class="pr-4 cursor-pointer select-none"
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
     <Button onclick={handleSubmit}>Guardar cambios</Button>
    </Card.Footer>
   </Card.Root>
  </Tabs.Content>
  <Tabs.Content value="demos">
   <Card.Root>
    <Card.Header>
     <Card.Title>Demos</Card.Title>
     <Card.Description>
      Subí tus demos de audio aquí. Podés agregar nuevas o eliminar las que ya no quieras mostrar.
     </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4">
     {#if demos.length === 0}
      <p class="text-sm text-muted-foreground">Todavía no subiste ninguna demo.</p>
     {:else}
      {#each demos as demo (demo.fileKey)}
       <div class="flex items-center gap-3 rounded-lg border p-3">
        <audio src={demo.audioUrl} controls class="h-10 flex-1"></audio>
        <Button
         type="button"
         variant="outline"
         size="icon"
        >
         ✕
        </Button>
       </div>
      {/each}
     {/if}

     <input
      id="demo-upload"
      type="file"
      accept="audio/*"
      class="hidden"
      bind:this={demoInput}
      onchange={handleDemoUpload}
     />
     <Button
      type="button"
      variant="outline"
      disabled={uploadingDemo}
      onclick={() => demoInput?.click()}
     >
      {uploadingDemo ? 'Subiendo...' : 'Subir nueva demo'}
     </Button>
    </Card.Content>
   </Card.Root>
  </Tabs.Content>
 </Tabs.Root>
</div>