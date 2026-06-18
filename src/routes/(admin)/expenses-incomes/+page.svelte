<!-- (admin)/expenses-incomes/+page.svelte -->
<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import { columns } from './columns';
  import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { enhance } from '$app/forms';
  import { BillType } from '$lib/graphql/schema';
  import { toast } from 'svelte-sonner';
  import { invalidateAll } from '$app/navigation';
  import { setContext } from 'svelte';
  import type { PageData } from './$types.js';

  let { data }: { data: PageData } = $props();
  setContext('token', data.token);

  // Dialog state lives here — completely isolated from DataTable
  let dialogOpen = $state(false);
  let isContract = $state(false);
  let selectedType = $state<string>('');

  function handleSubmit() {
    return async ({ result, update }: any) => {
      if (result.type === 'failure' || result.type === 'error') {
        toast.error('Hubo un error al agregar el comprobante.');
        await update({ reset: false });
        return;
      }
      dialogOpen = false;
      await invalidateAll();
      toast.success('Comprobante agregado exitosamente.');
    };
  }
</script>

{#if data.error}
  <div class="p-4">
    <Alert>
      <AlertTitle>Error al cargar gastos e ingresos</AlertTitle>
      <AlertDescription>{data.error}</AlertDescription>
    </Alert>
  </div>
{:else}
  <!-- Dialog lives outside DataTable so its form state never triggers a table re-render -->
  <Dialog.Root bind:open={dialogOpen}>
    <DataTable
      data={data.bills}
      {columns}
      filterColumnId="title"
      filterPlaceholder="Filtrar..."
      emptyMessage="Sin resultados."
      widthClass="w-[70%]"
    >
      {#snippet actions()}
        <Dialog.Trigger
          type="button"
          class="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Agregar
        </Dialog.Trigger>
      {/snippet}
    </DataTable>

    <Dialog.Content class="sm:max-w-[425px]">
      <form
        method="POST"
        enctype="multipart/form-data"
        use:enhance={handleSubmit}
        action="/expenses-incomes"
      >
        <Dialog.Header>
          <Dialog.Title class="text-lg font-semibold">Agregar</Dialog.Title>
          <Dialog.Description>
            Selecciona el tipo de comprobante que deseas agregar y completa
            los datos necesarios para su creación.
          </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4">
          <div class="grid gap-3">
            <Label for="name">Nombre</Label>
            <Input id="name" name="name" placeholder="Comprobante de pago..." />
          </div>
          <div class="grid gap-3">
            <Label for="description">Descripción</Label>
            <Input id="description" name="description" placeholder="Descripción del comprobante.." />
          </div>
          <div class="grid gap-3">
            <Label for="amount">Monto</Label>
            <Input id="amount" name="amount" type="number" step="0.01" placeholder="Monto del comprobante.." />
          </div>
          <input type="hidden" name="type" value={selectedType} />
          <div class="grid gap-3">
            <Label for="type">Tipo de pago</Label>
            <Select.Root type="single" bind:value={selectedType}>
              <Select.Trigger class="w-full">
                {selectedType
                  ? selectedType === BillType.Income ? 'Ingreso' : 'Gasto'
                  : 'Seleccionar tipo...'}
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value={BillType.Income} label="Ingreso">Ingreso</Select.Item>
                  <Select.Item value={BillType.Expense} label="Gasto">Gasto</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <Checkbox id="is-contract" bind:checked={isContract} />
            <Label for="is-contract" class="text-sm font-medium leading-none cursor-pointer">
              Pertenece a contrato
            </Label>
          </div>
          <div
            class="grid gap-3 transition-opacity {isContract
              ? 'opacity-100'
              : 'opacity-50 pointer-events-none'}"
          >
            <Label for="contract-id">ID del Contrato</Label>
            <Input
              id="contract-id"
              name="contractId"
              placeholder="Ingresar ID del contrato..."
              disabled={!isContract}
            />
          </div>
          <div class="grid gap-3 mb-2">
            <Label for="receipt-image">Imagen del comprobante</Label>
            <Input
              id="receipt-image"
              name="receiptImage"
              type="file"
              accept="image/*"
              class="cursor-pointer"
            />
          </div>
        </div>
        <Dialog.Footer>
          <Dialog.Close
            type="button"
            class="bg-red-500 text-white hover:bg-red-600 hover:text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
          >
            Cancelar
          </Dialog.Close>
          <Button
            type="submit"
            class="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
          >
            Agregar comprobante
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{/if}