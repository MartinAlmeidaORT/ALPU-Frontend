import {
  renderComponent,
  renderSnippet,
} from '$lib/components/ui/data-table/index.js';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from './data-table-actions.svelte';

export type TableContract = {
  contractId: string;
  contractSerial: string;
  broadcaster: {
    firstName: string;
    lastName: string;
  };
  client: {
    firstName: string;
    lastName: string;
    agency: {
      name: string;
    } | null;
  };
  state: string;
  date: string | Date;
  dueDate: string | Date;
};

export const columns: ColumnDef<TableContract>[] = [
  {
    accessorKey: 'contractSerial',
    header: () => {
      const contractHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">ID Contrato</div>`,
      }));
      return renderSnippet(contractHeaderSnippet);
    },
    cell: ({ row }) => {
      return row.original.contractSerial;
    },
  },
  {
    accessorKey: 'broadcaster',
    header: () => {
      const broadcasterHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Broadcaster</div>`,
      }));
      return renderSnippet(broadcasterHeaderSnippet);
    },
    cell: ({ row }) => {
      return `${row.original.broadcaster.firstName} ${row.original.broadcaster.lastName}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const broadcasterFullName =
        `${row.original.broadcaster.firstName} ${row.original.broadcaster.lastName}`.toLowerCase();
      const clientFullName =
        `${row.original.client.firstName} ${row.original.client.lastName}`.toLowerCase();
      const searchValue = (filterValue as string).toLowerCase();
      return (
        broadcasterFullName.includes(searchValue) ||
        clientFullName.includes(searchValue)
      );
    },
  },
  {
    accessorKey: 'client',
    header: () => {
      const clientHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Cliente</div>`,
      }));
      return renderSnippet(clientHeaderSnippet);
    },
    cell: ({ row }) => {
      return `${row.original.client.firstName} ${row.original.client.lastName}`;
    },
    filterFn: () => {
      // No filtrar en esta columna, solo usar broadcaster
      return true;
    },
  },
  {
    accessorKey: 'agency',
    header: () => {
      const agencyHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Agencia</div>`,
      }));
      return renderSnippet(agencyHeaderSnippet);
    },
    cell: ({ row }) => {
      return row.original.client.agency?.name || 'N/A';
    },
  },
  {
    accessorKey: 'state',
    header: () => {
      const stateHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Estado</div>`,
      }));
      return renderSnippet(stateHeaderSnippet);
    },
    cell: ({ row }) => {
      const stateMap: Record<string, string> = {
        PENDING: 'Pendiente',
        APPROVED: 'Aprobado',
        ACTIVE: 'Activo',
        COMPLETED: 'Completado',
        CANCELED: 'Cancelado',
        PAID: 'Pagado',
      };
      return stateMap[row.original.state] || row.original.state;
    },
  },
  {
    accessorKey: 'date',
    header: () => {
      const dateHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Fecha</div>`,
      }));
      return renderSnippet(dateHeaderSnippet);
    },
    cell: ({ row }) => {
      return new Date(row.original.date).toISOString().split('T')[0];
    },
  },
  {
    accessorKey: 'dueDate',
    header: () => {
      const dueDateHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Fecha Vencimiento</div>`,
      }));
      return renderSnippet(dueDateHeaderSnippet);
    },
    cell: ({ row }) => {
      return new Date(row.original.dueDate).toISOString().split('T')[0];
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return renderComponent(DataTableActions, { contract: row.original });
    },
  },
];
