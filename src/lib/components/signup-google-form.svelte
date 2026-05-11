<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Field from '$lib/components/ui/field/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
  import { onMount } from 'svelte';
  import { fetchCountries } from '$lib/graphql/queries/country';
  import type { OperationResult } from '@urql/core';
  import type { ActionData } from '../../routes/login/signup-google/$types';
  import type { CountriesQuery } from '$lib/graphql/types/graphql';

  let {
    form,
    data,
    use = $bindable(),
    ...restProps
  }: {
    form: ActionData;
    data: any;
    use: any;
    [key: string]: any;
  } = $props();

  let googleData = $state({
    lastName: '',
    firstName: '',
  });

  $effect(() => {
    if (data?.pendingData) {
      googleData.lastName = data.pendingData.lastName ?? '';
      googleData.firstName = data.pendingData.firstName ?? '';
    }
  });

  let hasUserChooseAccountType = $state(false);
  let accountType: 'client' | 'broadcaster' | null = $state(null);
  let messages: string[] | null = $state(null);

  let countriesFetch = $state<OperationResult<CountriesQuery> | null>(null);
  let selectedCountryCode: string | undefined = $state();
  let selectedCountryName: string | undefined = $derived(
    countriesFetch?.data?.countries?.find(
      (c) => c.countryCode === selectedCountryCode,
    )?.name ?? 'Selecciona un país',
  );

  onMount(async () => {
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
        <Button onclick={() => chooseAccount('client')} class="flex-1">
          Agencia
        </Button>
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
      <form
        method="POST"
        action="/login/signup-google"
        use:enhance={handleSubmit}
      >
        <input type="hidden" name="accountType" value={accountType} />
        <Field.Group columns={2}>
          <Field.Field>
            <Field.Label for="firstName">Nombre</Field.Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Nombre"
              bind:value={googleData.firstName}
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
            <Field.Label for="lastName">Apellido</Field.Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Apellido"
              bind:value={googleData.lastName}
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
            <Field.Label for="street">Calle</Field.Label>
            <Input
              id="street"
              name="street"
              type="text"
              placeholder="Calle"
              required
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
          <Field.Field>
            <Field.Label for="state">Estado</Field.Label>
            <Input
              id="state"
              name="state"
              type="text"
              placeholder="Departamento"
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
