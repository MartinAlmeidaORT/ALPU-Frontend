<script lang="ts">
  import DataTable from './data-table.svelte';
  import { columns } from './columns';
  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from '$lib/components/ui/alert/index.js';
  import { setContext } from 'svelte';
  import type { PageData } from './$types.js';

  let { data }: { data: PageData } = $props();
  setContext('token', data.token);
</script>

{#if data.error}
  <div class="p-4">
    <Alert>
      <AlertTitle>Error al cargar gastos e ingresos</AlertTitle>
      <AlertDescription>{data.error}</AlertDescription>
    </Alert>
  </div>
{:else}
  <DataTable data={data.bills} {columns} />
{/if}
