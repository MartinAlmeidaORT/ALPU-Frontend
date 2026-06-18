<!-- (protected)/contracts/+page.svelte -->
<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import { columns } from './columns.js';
  import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert/index.js';
  import { setContext } from 'svelte';
  import type { PageData } from './$types.js';
 
  let { data }: { data: PageData } = $props();
  setContext('token', data.token);
</script>
 
{#if data.error}
  <div class="p-4">
    <Alert>
      <AlertTitle>Error al cargar contratos</AlertTitle>
      <AlertDescription>{data.error}</AlertDescription>
    </Alert>
  </div>
{:else}
  <DataTable
    data={data.contracts}
    {columns}
    filterColumnId="broadcaster"
    filterPlaceholder="Filtrar por usuario"
    emptyMessage="No hay contratos disponibles"
    stateOptions={[
      { value: 'PENDING',   label: 'Pendiente'  },
      { value: 'COMPLETED', label: 'Completado' },
      { value: 'ACTIVE',    label: 'Activo'     },
      { value: 'CANCELED',  label: 'Cancelado'  },
    ]}
  />
{/if}