<script lang="ts">
  import type { ActionData } from '../../routes/auth/signup/$types';
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Field from '$lib/components/ui/field/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
  import type { ComponentProps } from 'svelte';
  import { onMount } from 'svelte';
  import { fetchCountries } from '$lib/graphql/queries/country';
  import { fetchDepartments } from '$lib/graphql/queries/department';
  import type { OperationResult } from '@urql/core';
  import type { CountriesQuery, DepartmentsQuery } from '$lib/graphql/types/graphql';

  let {
    form,
    ...restProps
  }: { form: ActionData } & ComponentProps<typeof Card.Root> = $props();

  let hasUserChooseAccountType = $state(false);
  let accountType: 'client' | 'broadcaster' | null = $state(null);
  let messages: string[] | null = $state(null);

  let countriesFetch = $state<OperationResult<CountriesQuery> | null>(null);
  let departmentsFetch = $state<OperationResult<DepartmentsQuery> | null>(null);
  let selectedCountryCode: string = $state("UY ");
  let selectedDepartmentId: string | undefined = $state();
  let selectedCountryName: string | undefined = $state();

  $effect( () => {
    fetchDepartments(selectedCountryCode).then(result => {
    departmentsFetch = result;
    });
  });

  $effect(() => {
    if (countriesFetch?.data?.countries) {
      const country = countriesFetch.data.countries.find(c => c.countryCode === selectedCountryCode);
      selectedCountryName = country ? country.name : 'Selecciona un país';
    }
  });
  let selectedDepartmentName: string | undefined = $derived(
    departmentsFetch?.data?.departments.find(
      (d) => d.departmentId === Number(selectedDepartmentId),
    )?.name ?? 'Selecciona un departamento',
  );

  onMount(async () => {
    departmentsFetch = await fetchDepartments(selectedCountryCode);
    countriesFetch = await fetchCountries();
  });

  function chooseAccount(type: 'client' | 'broadcaster' | null) {
    accountType = type;
    hasUserChooseAccountType = type != null;
    if (!hasUserChooseAccountType) messages = null;
  }

  function handleSubmit() {
    return async ({ result, update }: any) => {
      messages = null;

      if (result.type === 'failure') {
        messages = result.data.messages;
      }
      await update();
    };
  }
</script>

<Card.Root {...restProps}>
  {#if !hasUserChooseAccountType}
    <Card.Header>
      <Card.Title class="text-2xl">¿Qué tipo de cuenta deseas crear?</Card.Title
      >
      <Card.Description>Selecciona una opción para continuar</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="flex gap-4">
        <Button class="flex-1" onclick={() => chooseAccount('client')}
          >Agencia</Button
        >
        <Button
          onclick={() => chooseAccount('broadcaster')}
          variant="outline"
          class="flex-1"
        >
          Locutor
        </Button>
      </div>
    </Card.Content>
  {:else}
    <Card.Header>
      <Card.Title class="text-2xl"
        >Registro {accountType == 'client' ? 'cliente' : 'locutor'}</Card.Title
      >
      <Card.Description
        >Ingresa tu información a continuación para crear tu cuenta</Card.Description
      >
    </Card.Header>
    <Card.Content>
      <form method="POST" action="/auth/signup" use:enhance={handleSubmit}>
        <input type="hidden" name="accountType" value={accountType} />
        <Field.Group columns={2}>
          <Field.Field>
            <Field.Label for="name">Nombre</Field.Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Nombre"
              required
              minlength={3}
              maxlength={50}
              pattern="[A-Za-z]+"
              oninvalid={(e) => {
                const input = e.target as HTMLInputElement;
                if (input.validity.patternMismatch) {
                  input.setCustomValidity('Solo se permiten letras');
                }
              }}
              oninput={(e) => {
                (e.target as HTMLInputElement).setCustomValidity('');
              }}
            />
          </Field.Field>
          <Field.Field>
            <Field.Label for="apellido">Apellido</Field.Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Apellido"
              required
              minlength={3}
              maxlength={50}
              pattern="[A-Za-z]+"
              oninvalid={(e) => {
                const input = e.target as HTMLInputElement;
                if (input.validity.patternMismatch) {
                  input.setCustomValidity('Solo se permiten letras');
                }
              }}
              oninput={(e) => {
                (e.target as HTMLInputElement).setCustomValidity('');
              }}
            />
          </Field.Field>
          <Field.Field>
            <Field.Label for="email">Email</Field.Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              required
              minlength={10}
              maxlength={100}
            />
          </Field.Field>
          <Field.Field>
            <Field.Label for="password">Contraseña</Field.Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              required
              minlength={10}
              maxlength={60}
            />
            <Field.Description></Field.Description>
          </Field.Field>
          <Field.Field>
            <Field.Label for="rut">RUT</Field.Label>
            <Input
              id="rut"
              name="rut"
              type="text"
              placeholder="RUT"
              required
              minlength={12}
              maxlength={12}
            />
          </Field.Field>
          {#if accountType === 'client'}
            <Field.Field>
              <Field.Label for="agencyName">Nombre de Agencia</Field.Label>
              <Input
                id="agencyName"
                name="agencyName"
                placeholder="Agencia"
                type="text"
                required
                minlength={3}
                maxlength={100}
              />
            </Field.Field>
          {/if}
          <Field.Field>
            <Field.Label for="city">Ciudad</Field.Label>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Ciudad"
              required
              minlength={4}
              maxlength={100}
              pattern="[A-Za-z]+"
              oninvalid={(e) => {
                const input = e.target as HTMLInputElement;
                if (input.validity.patternMismatch) {
                  input.setCustomValidity('Solo se permiten letras');
                }
              }}
              oninput={(e) => {
                (e.target as HTMLInputElement).setCustomValidity('');
              }}
            />
          </Field.Field>
          <Field.Field>
            <Field.Label for="department">Departamento</Field.Label>
            <Select.Root
              name="departmentId"
              type="single"
              bind:value={selectedDepartmentId}
              required
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
          </Field.Field>
          <Field.Field>
            <Field.Label for="street">Calle</Field.Label>
            <Input
              id="street"
              name="street"
              type="text"
              placeholder="Calle"
              required
              minlength={4}
              maxlength={100}
            />
          </Field.Field>
          <Field.Field>
            <Field.Label for="pais">Pais</Field.Label>
            <Select.Root
              name="countryCode"
              type="single"
              bind:value={selectedCountryCode}
              required
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
          </Field.Field>
        </Field.Group>
        <Field.Group class="mt-4" columns={2}>
          <Field.Field>
            <Button type="submit">Crear</Button>
          </Field.Field>
          <Field.Field>
            <Button type="button" onclick={() => chooseAccount(null)}
              >Volver</Button
            >
          </Field.Field>
        </Field.Group>
      </form>
    </Card.Content>
  {/if}
</Card.Root>

{#if messages}
  <div class="grid w-full max-w-xl items-start gap-4">
    <Alert.Root variant="destructive">
      <AlertCircleIcon />
      <Alert.Title>Error en el registro</Alert.Title>
      <Alert.Description>
        <p>Por favor verifique los siguientes datos.</p>
        {#each messages as msg}
          <p>{msg}</p>
        {/each}
      </Alert.Description>
    </Alert.Root>
  </div>
{/if}
