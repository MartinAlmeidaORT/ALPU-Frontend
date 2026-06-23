<script lang="ts" generics="TData, TValue">
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
  import * as Select from '$lib/components/ui/select/index.js';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { Snippet } from 'svelte';

  type SelectOption = {
    value: string;
    label: string;
  };

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterColumnId: string;
    filterPlaceholder?: string;
    emptyMessage?: string;
    stateOptions?: SelectOption[];
    stateParamKey?: string;
    stateTriggerLabel?: (value: string) => string;
    widthClass?: string;
    actions?: Snippet;
  };

  let {
    data,
    columns,
    filterColumnId,
    filterPlaceholder = 'Filtrar...',
    emptyMessage = 'Sin resultados.',
    stateOptions,
    stateParamKey = 'state',
    stateTriggerLabel,
    widthClass = 'w-[80%]',
    actions,
  }: DataTableProps<TData, TValue> = $props();

  let sorting = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 15 });

  // Read once from URL — no $effect, no reactivity loop
  let selectedState = $state<string>(
    $page.url.searchParams.get(stateParamKey) ?? 'ALL',
  );

  function handleStateChange(value: string) {
    selectedState = value;
    const url = new URL($page.url);
    if (value && value !== 'ALL') {
      url.searchParams.set(stateParamKey, value);
    } else {
      url.searchParams.delete(stateParamKey);
    }
    url.searchParams.delete('after');
    goto(url.pathname + url.search);
  }

  const pageInfo = $derived($page.data.pageInfo);

  function nextPage() {
    if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
      const url = new URL($page.url);
      url.searchParams.set('after', pageInfo.endCursor);
      goto(url.pathname + url.search);
    }
  }

  function previousPage() {
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
      sorting = typeof updater === 'function' ? updater(sorting) : updater;
    },
    onColumnFiltersChange: (updater) => {
      columnFilters =
        typeof updater === 'function' ? updater(columnFilters) : updater;
    },
    onPaginationChange: (updater) => {
      pagination =
        typeof updater === 'function' ? updater(pagination) : updater;
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

  const allStateOptions: SelectOption[] = stateOptions
    ? [{ value: 'ALL', label: 'Todos los estados' }, ...stateOptions]
    : [];

  function getTriggerLabel(value: string): string {
    if (stateTriggerLabel) return stateTriggerLabel(value);
    return (
      allStateOptions.find((o) => o.value === value)?.label ??
      'Todos los estados'
    );
  }
</script>

<div class="{widthClass} mx-auto p-4">
  <div class="rounded-md border bg-white overflow-hidden">
    <div class="flex items-center gap-4 mx-1 py-4">
      <Input
        placeholder={filterPlaceholder}
        value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ??
          ''}
        oninput={(e) =>
          table
            .getColumn(filterColumnId)
            ?.setFilterValue(e.currentTarget.value)}
        onchange={(e) =>
          table
            .getColumn(filterColumnId)
            ?.setFilterValue(e.currentTarget.value)}
        class="max-w-sm border-[#cad8e4]"
      />
      {#if stateOptions}
        <Select.Root
          type="single"
          value={selectedState}
          onValueChange={handleStateChange}
        >
          <Select.Trigger class="w-[180px]">
            {getTriggerLabel(selectedState)}
          </Select.Trigger>
          <Select.Content>
            {#each allStateOptions as option (option.value)}
              <Select.Item value={option.value} label={option.label} />
            {/each}
          </Select.Content>
        </Select.Root>
      {/if}
    </div>

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
              {emptyMessage}
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>

    <div class="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onclick={previousPage}
        disabled={!$page.url.searchParams.has('after')}
      >
        Anterior
      </Button>

      {#if actions}
        {@render actions()}
      {/if}

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
