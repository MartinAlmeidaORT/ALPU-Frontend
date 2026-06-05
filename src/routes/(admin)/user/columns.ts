import {
  renderComponent,
  renderSnippet,
} from '$lib/components/ui/data-table/index.js';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from './data-table-actions.svelte';

export type TableUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  rut: string;
  userState: string;
  __typename: string;
};

export const columns: ColumnDef<TableUser>[] = [
  {
    accessorKey: 'userId',
    header: () => {
      const headerSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">ID</div>`,
      }));
      return renderSnippet(headerSnippet);
    },
    cell: ({ row }) => {
      return `#${row.original.userId}`;
    },
  },
  {
    accessorKey: 'name',
    header: () => {
      const nameHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Nombre</div>`,
      }));
      return renderSnippet(nameHeaderSnippet);
    },
    cell: ({ row }) => {
      return `${row.original.firstName} ${row.original.lastName}`;
    },
    filterFn: (row, columnId, filterValue) => {
      const fullName =
        `${row.original.firstName} ${row.original.lastName}`.toLowerCase();
      const searchValue = (filterValue as string).toLowerCase();
      return fullName.includes(searchValue);
    },
  },
  {
    accessorKey: 'email',
    header: () => {
      const emailHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Correo</div>`,
      }));
      return renderSnippet(emailHeaderSnippet);
    },
    cell: ({ row }) => {
      return row.original.email;
    },
  },
  {
    accessorKey: 'rut',
    header: () => {
      const rutHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">RUT</div>`,
      }));
      return renderSnippet(rutHeaderSnippet);
    },
    cell: ({ row }) => {
      return row.original.rut;
    },
  },
  {
    accessorKey: '__typename',
    header: () => {
      const stateHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Tipo de Usuario</div>`,
      }));
      return renderSnippet(stateHeaderSnippet);
    },
    cell: ({ row }) => {
      const stateMap: Record<string, string> = {
        Client: 'Cliente',
        Broadcaster: 'Locutor',
        Administrator: 'Administrador',
        Supervisor: 'Supervisor',
        Accountant: 'Contador',
      };
      return stateMap[row.original.__typename] || row.original.__typename;
    },
  },
  {
    accessorKey: 'userState',
    header: () => {
      const stateHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Estado</div>`,
      }));
      return renderSnippet(stateHeaderSnippet);
    },
    cell: ({ row }) => {
      const stateMap: Record<string, string> = {
        PENDING: 'Pendiente',
        ENABLED: 'Habilitado',
        PENALIZED: 'Penalizado',
      };
      return stateMap[row.original.userState] || row.original.userState;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return renderComponent(DataTableActions, { user: row.original });
    },
  },
];
