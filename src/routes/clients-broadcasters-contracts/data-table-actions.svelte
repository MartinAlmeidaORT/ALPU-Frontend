<script lang="ts">
 import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
 import { Button } from "$lib/components/ui/button/index.js";
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
 import type { TableContract } from "./columns";
 import { getContext } from "svelte";
 import { UPDATE_CONTRACT_QUERY } from "$lib/graphql/queries/contracts";
 import { ContractState, type UpdateContractStateInput } from "$lib/graphql/schema";
 import type { Client } from "@urql/svelte";
 import {createUrqlClient} from "$lib/graphql/client";
 import { invalidateAll } from "$app/navigation";
 let token = getContext("token") as string;
 let { contract }: { contract: TableContract } = $props();

 const getMenuItems = (state: string) => {
   switch (state) {
     case "PENDING":
       return [
         { label: "Aprobar", action: "approve" },
         { label: "Cancelar", action: "cancel" },
       ];
     case "APPROVED":
     case "ACTIVE":
       return [
         { label: "Cancelar", action: "cancel" },
       ];
     default:
       return [];
   }
 };

 const handleAction = async (action: string) => {
   const input: UpdateContractStateInput = {
     contractId: contract.contractId,
     newState: action === "approve" ? ContractState.Approved : ContractState.Canceled,
   }; 
   const urqlClient : Client= createUrqlClient(token);
   const result = await urqlClient.mutation(UPDATE_CONTRACT_QUERY, { input }).toPromise();
    if (result.error) {
    } else {
      await invalidateAll();
    }
 };  
</script>
 
<DropdownMenu.Root>
 <DropdownMenu.Trigger>
  {#snippet child({ props })}
   <Button
    {...props}
    variant="ghost"
    size="icon"
    class="relative size-8 p-0"
   >
    <span class="sr-only">Open menu</span>
    <EllipsisIcon />
   </Button>
  {/snippet}
 </DropdownMenu.Trigger>
 <DropdownMenu.Content>
  <DropdownMenu.Group>
   <DropdownMenu.Label>Acciones</DropdownMenu.Label>
   {#each getMenuItems(contract.state) as item (item.action)}
    <DropdownMenu.Item onclick={() => handleAction(item.action)}>
     {item.label}
    </DropdownMenu.Item>
   {/each}
  </DropdownMenu.Group>
  <DropdownMenu.Separator />
 </DropdownMenu.Content>
</DropdownMenu.Root>