<script lang="ts" generics="TData, TValue">
  import {
    type ColumnDef,
    type PaginationState,
    type SortingState,
    type ColumnFiltersState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
  } from '@tanstack/table-core';
  import {
    createSvelteTable,
    FlexRender,
  } from '$lib/components/ui/data-table/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

  let { data, columns }: DataTableProps<TData, TValue> = $props();
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });
  let sorting = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);
  const initialState = $page.url.searchParams.get('state') ?? 'ALL';
  let selectedState = $state<string>(initialState);

  function handleStateChange() {
    const url = new URL($page.url);
    if (selectedState && selectedState !== 'ALL') {
      url.searchParams.set('state', selectedState);
    } else {
      url.searchParams.delete('state');
    }
    // Al cambiar filtros, reseteamos la paginación al principio
    url.searchParams.delete('after');
    goto(url.pathname + url.search);
  }

  $effect(() => {
    // Escucha cambios en selectedState y actualiza la URL si es distinta
    const currentParam = $page.url.searchParams.get('state') ?? 'ALL';
    if (selectedState !== currentParam) {
      handleStateChange();
    }
  });

  // Extract pageInfo from SvelteKit's $page.data
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
    // getPaginationRowModel no es necesario si paginas en el servidor,
    // pero si está lo deshabilitamos para usar los datos tal cual vienen
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
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
</script>

<div class="mx-auto w-[80%] p-4">
  <div class="rounded-md border bg-white">
    <div class="flex items-center gap-4 mx-1 py-4">
      <Input
        placeholder="Filtrar por usuario"
        value={(table.getColumn('broadcaster')?.getFilterValue() as string) ??
          ''}
        onchange={(e) => {
          const value = e.currentTarget.value;
          table.getColumn('broadcaster')?.setFilterValue(value);
        }}
        oninput={(e) => {
          const value = e.currentTarget.value;
          table.getColumn('broadcaster')?.setFilterValue(value);
        }}
        class="max-w-sm"
      />
      <Select.Root type="single" bind:value={selectedState}>
        <Select.Trigger class="w-[180px]">
          {#if selectedState === 'PENDING'}
            Pendiente
          {:else if selectedState === 'COMPLETED'}
            Completado
          {:else if selectedState === 'ACTIVE'}
            Activo
          {:else if selectedState === 'CANCELED'}
            Cancelado
          {:else}
            Todos los estados
          {/if}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="ALL" label="Todos los estados" />
          <Select.Item value="PENDING" label="Pendiente" />
          <Select.Item value="COMPLETED" label="Completado" />
          <Select.Item value="ACTIVE" label="Activo" />
          <Select.Item value="CANCELED" label="Cancelado" />
        </Select.Content>
      </Select.Root>
    </div>
    <div>
      <Table.Root>
        <Table.Header>
          {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
            <Table.Row>
              {#each headerGroup.headers as header (header.id)}
                <Table.Head colspan={header.colSpan}>
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
                No hay contratos disponibles
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
</div>
