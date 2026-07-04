<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Label from './ui/label/label.svelte';
  import { fetchClient, fetchBroadcaster } from '$lib/graphql/queries/user';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import X from '@lucide/svelte/icons/x';
  import type {
    BroadcastersQuery,
    ClientsQuery,
  } from '$lib/graphql/types/graphql';
  import { toast } from 'svelte-sonner';
  let {
    rol,
    valorId = $bindable(),
    disabled = false,
  }: {
    rol: string | null | undefined;
    valorId?: string | number | null | undefined;
    disabled?: boolean;
  } = $props();
  let email = $state('');
  let user:
    | (BroadcastersQuery['broadcasters'] | ClientsQuery['clients'])
    | null = $state(null);
  let openAlertDialog = $state(false);
</script>

<div class="bg-white rounded-lg p-4 text-center border-2 border-[#cad8e4]">
  <div class="flex gap-2">
    <Label for="email" class="sr-only">Email</Label>
    <Input
      id="email"
      type="email"
      placeholder="Ingresar email"
      class="flex-1"
      bind:value={email}
    />
    <AlertDialog.Root bind:open={openAlertDialog}>
      <AlertDialog.Trigger>
        <Button
          bgColor="bg-blue-500 text-white hover:bg-blue-600"
          disabled={disabled}
          onclick={async () => {
            user = null;
            if (rol === 'Broadcaster') {
              const result = await fetchClient({
                email: email,
              });
              if (result.data?.clients && result.data?.clients.length > 0) {
                user = result.data.clients;
              } else {
                toast.error('No se encontró ningún cliente con ese email');
              }
            } else {
              const result = await fetchBroadcaster({
                email: email,
              });
              if (
                result.data?.broadcasters &&
                result.data?.broadcasters.length > 0
              ) {
                user = result.data.broadcasters;
              } else {
                toast.error('No se encontró ningún broadcaster con ese email');
              }
            }
          }}
        >
          Buscar
        </Button>
      </AlertDialog.Trigger>
      {#if user}
        <AlertDialog.Content>
          <AlertDialog.Cancel
            class="absolute top-4 right-4 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100"
          >
            <X class="h-4 w-4" />
          </AlertDialog.Cancel>
          <AlertDialog.Header>
            {#if rol === 'Broadcaster'}
              <AlertDialog.Title>Cliente encontrado</AlertDialog.Title>
            {:else if rol === 'Client'}
              <AlertDialog.Title>Locutor encontrado</AlertDialog.Title>
            {/if}
            <AlertDialog.Description>
              Este fue el usuario encontrado con el email ingresado.
              <div class="mt-6 text-left">
                {#each user as client}
                  <div class="flex justify-between items-center p-2 border-b">
                    {client.firstName}
                    {client.lastName}
                    <AlertDialog.Action
                      onclick={() => {
                        valorId = client.userId;
                        toast.success(
                          `Usuario seleccionado: ${client.firstName} ${client.lastName}`,
                        );
                        openAlertDialog = false;
                        email = '';
                      }}
                    >
                      Escoger
                    </AlertDialog.Action>
                  </div>
                {/each}
              </div>
            </AlertDialog.Description>
          </AlertDialog.Header>
        </AlertDialog.Content>
      {/if}
    </AlertDialog.Root>
  </div>
</div>
