<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Label from './ui/label/label.svelte';
  import { fetchClient, fetchBroadcaster, fetchAgency } from '$lib/graphql/queries/user';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import X from '@lucide/svelte/icons/x';
  import type {
    BroadcastersQuery,
    ClientsQuery,
  } from '$lib/graphql/types/graphql';
  import { toast } from 'svelte-sonner';
  let {
    valorId = $bindable(),
  }: {
    valorId?: string | number | null | undefined;
  } = $props();
  let agencyName = $state('');
  let user:
    | (BroadcastersQuery['broadcasters'] | ClientsQuery['clients'])
    | null = $state(null);
  let openAlertDialog = $state(false);
</script>

<div class="bg-white rounded-lg p-4 text-center border-2 border-[#cad8e4]">
  <div class="flex gap-2">
    <Label for="agency_name" class="sr-only">Nombre de Agencia</Label>
    <Input
      id="agency_name"
      type="text"
      placeholder="Ingresar agencia"
      class="flex-1"
      bind:value={agencyName}
    />
    <AlertDialog.Root bind:open={openAlertDialog}>
      <AlertDialog.Trigger>
        <Button
          bgColor="bg-blue-500 text-white hover:bg-blue-600"
          onclick={async () => {
            user = null;
            const result = await fetchAgency({agency: agencyName,});
            if (result.data?.clients && result.data?.clients.length > 0) {
            user = result.data.clients;
            } else {
            toast.error('No se encontró ninguna agencia con ese nombre');
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
            <AlertDialog.Title>Agencia encontrada</AlertDialog.Title>
            <AlertDialog.Description>
              Este fue el usuario encontrado con el nombre de agencia ingresado.
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
                        agencyName = '';
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
