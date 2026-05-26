<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Label from './ui/label/label.svelte';
  import { fetchClient, fetchBroadcaster } from '$lib/graphql/queries/user';
  import type {
    BroadcastersQuery,
    ClientsQuery,
  } from '$lib/graphql/types/graphql';
  import Checkbox from './ui/checkbox/checkbox.svelte';
  import { toast } from 'svelte-sonner';
  let {
    rol,
    valorId = $bindable(),
    paysCash = $bindable(false),
  }: {
    rol: string | null | undefined;
    valorId?: string | number | null | undefined;
    paysCash?: boolean;
  } = $props();
  let nombre = $state('');
  let apellido = $state('');
  let user:
    | (BroadcastersQuery['broadcasters'] | ClientsQuery['clients'])
    | null = $state(null);
</script>

<div class="bg-white rounded-lg p-4 text-center border-2 border-[#cad8e4]">
  {#if rol === 'Broadcaster'}
    <h1 class="text-xl font-bold mb-2">Buscar cliente</h1>
  {:else if rol === 'Client'}
    <h1 class="text-xl font-bold mb-2">Buscar broadcaster</h1>
  {/if}
  <div class="flex gap-2">
    <Label for="firstName" class="sr-only">Nombre</Label>
    <Input
      id="firstName"
      type="text"
      placeholder="Ingresa el nombre del cliente"
      class="flex-1"
      bind:value={nombre}
    />
    <Label for="lastName" class="sr-only">Apellido</Label>
    <Input
      id="lastName"
      type="text"
      placeholder="Ingresa el apellido del cliente"
      class="flex-1"
      bind:value={apellido}
    />
    <Button
      bgColor="bg-blue-500 text-white hover:bg-blue-600"
      onclick={async () => {
        if (rol === 'Broadcaster') {
          const result = await fetchClient({
            firstName: nombre,
            lastName: apellido,
          });
          if (result.data?.clients) {
            user = result.data.clients;
          } else {
            toast.error(
              'No se encontró ningún cliente con ese nombre y apellido',
            );
          }
        } else {
          const result = await fetchBroadcaster({
            firstName: nombre,
            lastName: apellido,
          });
          if (result.data?.broadcasters) {
            user = result.data.broadcasters;
          } else {
            toast.error(
              'No se encontró ningún broadcaster con ese nombre y apellido',
            );
          }
        }
      }}
    >
      Buscar
    </Button>
  </div>
  {#if user}
    <div class="mt-4 text-left">
      {#each user as client}
        <span
          ><strong>Cliente encontrado:</strong>
          {client.firstName}
          {client.lastName}</span
        >
        <Button
          bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white"
          onclick={() => {
            valorId = client.userId;
            toast.success(`Escogido: ${client.firstName} ${client.lastName}`);
          }}
        >
          Escoger
        </Button>
      {/each}
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="paysCash" bind:checked={paysCash} />
      <Label for="paysCash" class="text-bold">Pagar en efectivo</Label>
    </div>
  {/if}
</div>
