import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";
import DataTableBroadcasterButton from "./data-table-broadcaster-button.svelte";
import DataTableAgencyButton from "./data-table-agency-button.svelte";

export type TableContract = {
  id: string;
  broadcasterName: string;
  AgencyName: string;
  state: string;
};
 
export const columns: ColumnDef<TableContract>[] = [
  {
    accessorKey: "id",
    header: () => {
      const contractHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Contrato</div>`,
      }));
      return renderSnippet(contractHeaderSnippet);
    },
  },
  {
    accessorKey: "broadcasterName",
    header: ({column}) => {
      return renderComponent(DataTableBroadcasterButton, {
        onclick: column.getToggleSortingHandler(),
      })
    },
  },
  {
    accessorKey: "AgencyName",
    header: ({column}) => {
      return renderComponent(DataTableAgencyButton, {
        onclick: column.getToggleSortingHandler(),
      })
    },
  },
  {
    accessorKey: "state",
    header: () => {
      const amountHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-start">Estado</div>`,
      }));
      return renderSnippet(amountHeaderSnippet);
    },
  },
 {
    id: "actions",
    cell: ({ row }) => {
      if (row.original.state === "Active") {
        return renderComponent(DataTableActions, { id: row.original.id });
      }
      return null;
    },
  },
];