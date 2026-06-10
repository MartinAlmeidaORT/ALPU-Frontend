<script lang="ts">
  import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
  } from '@tanstack/table-core';
  import {
    createSvelteTable,
    FlexRender,
  } from '$lib/components/ui/data-table/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Label } from '$lib/components/ui/label';
  import * as Select from '$lib/components/ui/select/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  import { enhance } from '$app/forms';
  import { BillType } from '$lib/graphql/schema';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  type TData = any;
  type TValue = any;

  let {
    data,
    columns,
  }: {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
  } = $props();

  let sorting = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 15 });
  let isContract = $state(false);
  let selectedType = $state<string>('');

  const pageInfo = $derived($page.data.pageInfo);

  function nextPage() {
    if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
      const url = new URL($page.url);
      url.searchParams.set('after', pageInfo.endCursor);
      // Mantener la historia del navegador para poder volver con el botón "Atrás"
      goto(url.pathname + url.search);
    }
  }

  function previousPage() {
    // Para simplificar, ir a la página anterior requiere navegar "hacia atrás" en el historial,
    // o se podría remover el 'after' para volver al inicio.
    // Usamos window.history.back() asumiendo que hemos navegado secuencialmente,
    // o simplemente volvemos sin cursor para la primera página.
    window.history.back();
  }

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    state: {
      get pagination() {
        return pagination;
      },
      get sorting() {
        return sorting;
      },
      get columnFilters() {
        return columnFilters;
      },
    },
  });

  function handleSubmit() {
    return async ({ result, update }: any) => {
      if (result.type === 'failure') {
        toast.error('Hubo un error al agregar el comprobante.');
      }
      await update();
      toast.success('Comprobante agregado exitosamente.');
    };
  }
</script>

<div class="w-[70%] mx-auto">
  <div class="flex items-center py-4">
    <Input
      placeholder="Filtrar..."
      value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
      oninput={(e) =>
        table.getColumn('title')?.setFilterValue(e.currentTarget.value)}
      class="max-w-sm border-[#cad8e4] bg-white"
    />
  </div>
  <div class="rounded-md border border-[#cad8e4] bg-[#ffff] overflow-hidden">
    <Table.Root>
      <Table.Header class="bg-[#1f5bb8] text-white pointer-events-none">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head>
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && 'selected'}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell>
                <FlexRender
                  content={cell.column.columnDef.cell}
                  context={cell.getContext()}
                />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">
              Sin resultados.
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onclick={previousPage}
        disabled={!$page.url.searchParams.has('after')}
      >
        Anterior
      </Button>
    <Dialog.Root>
      <Dialog.Trigger
        type="button"
        class="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
      >
        Agregar
      </Dialog.Trigger>
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
              <Input
                id="name"
                name="name"
                placeholder="Comprobante de pago..."
              />
            </div>
            <div class="grid gap-3">
              <Label for="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                placeholder="Descripción del comprobante.."
              />
            </div>
            <div class="grid gap-3">
              <Label for="amount">Monto</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Monto del comprobante.."
              />
            </div>
            <input type="hidden" name="type" value={selectedType} />
            <div class="grid gap-3">
              <Label for="type">Tipo de pago</Label>
              <Select.Root type="single" bind:value={selectedType}>
                <Select.Trigger class="w-full">
                  {selectedType
                    ? selectedType === BillType.Income
                      ? 'Ingreso'
                      : 'Gasto'
                    : 'Seleccionar tipo...'}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Item value={BillType.Income} label="Ingreso"
                      >Ingreso</Select.Item
                    >
                    <Select.Item value={BillType.Expense} label="Gasto"
                      >Gasto</Select.Item
                    >
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
            <div class="flex items-center space-x-2 mt-2">
              <Checkbox id="is-contract" bind:checked={isContract} />
              <Label
                for="is-contract"
                class="text-sm font-medium leading-none cursor-pointer"
              >
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
            <div class="grid gap-3">
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
      <Button
        variant="outline"
        size="sm"
        onclick={nextPage}
        disabled={!pageInfo?.hasNextPage}
      >
        Siguiente
      </Button>
  </div>
</div>
