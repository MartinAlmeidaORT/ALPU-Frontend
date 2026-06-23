<!-- (admin)/user/+page.svelte -->
<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import { columns } from './columns.js';
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
      <AlertTitle>Error al cargar usuarios</AlertTitle>
      <AlertDescription>{data.error}</AlertDescription>
    </Alert>
  </div>
{:else}
  <DataTable
    data={data.users}
    {columns}
    filterColumnId="name"
    filterPlaceholder="Filtrar por nombre"
    emptyMessage="No hay usuarios disponibles"
    stateOptions={[
      { value: 'PENDING', label: 'Pendiente' },
      { value: 'ENABLED', label: 'Habilitado' },
      { value: 'PENALIZED', label: 'Penalizado' },
    ]}
  />
{/if}
