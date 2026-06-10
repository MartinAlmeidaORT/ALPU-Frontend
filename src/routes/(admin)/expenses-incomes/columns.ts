import {
  renderComponent,
  renderSnippet,
} from '$lib/components/ui/data-table/index.js';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from './data-table-actions.svelte';

// Tipo provisorio, reemplazar por el de GraphQL cuando exista el query de Bills en la respuesta de nodes.
export type TableBill = {
  billId: number;
  title: string;
  description: string;
  state: 'EXPENSE' | 'INCOME';
  amount: number;
  date: string;
};

export const columns: ColumnDef<TableBill>[] = [
  {
    accessorKey: 'title',
    header: () => {
      const titleHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Nombre</div>`,
      }));
      return renderSnippet(titleHeaderSnippet);
    },
  },
  {
    accessorKey: 'description',
    header: () => {
      const descHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Descripción</div>`,
      }));
      return renderSnippet(descHeaderSnippet);
    },
  },
  {
    accessorKey: 'state',
    header: () => {
      const typeHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Tipo</div>`,
      }));
      return renderSnippet(typeHeaderSnippet);
    },
    cell: ({ row }) => {
      const type = row.getValue('state');
      return type === 'EXPENSE' ? 'Gasto' : 'Ingreso';
    },
  },
  {
    accessorKey: 'amount',
    header: () => {
      const amountHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Monto</div>`,
      }));
      return renderSnippet(amountHeaderSnippet);
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: 'UYU',
      }).format(amount);
      return formatted;
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
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return renderComponent(DataTableActions, { bill: row.original });
    },
  },
];
