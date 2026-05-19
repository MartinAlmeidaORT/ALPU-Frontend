<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Alert from '$lib/components/ui/alert/index.js';
  import type { CalculateContractQuery } from '$lib/graphql/types/graphql';

  // Props
  export let totalContrato: CalculateContractQuery['calculateContract'] | null = null;
  export let errorMessages: string | null = null;
  export let onRemoveService: (index: number) => void = () => {};
  export let onRemoveAllServices: () => void = () => {};
  export let onRemovePiece: (serviceIndex: number, pieceIndex: number) => void = () => {};
</script>

<div class="space-y-2 bg-white rounded-lg p-4 text-center border-2 border-[#cad8e4]">
  {#if errorMessages}
    <Alert.Root class="border-red-400 bg-red-100">
      <Alert.Title class="text-red-700">{errorMessages}</Alert.Title>
    </Alert.Root>
  {/if}

  <h1 class="text-2xl font-bold mb-4">Total a pagar</h1>

  {#if !totalContrato}
    <span>No ha seleccionado ningún servicio.</span>
  {:else}
    <div class="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
      <!-- Columna 1: Adjustments -->
      <div class="space-y-2 border border-[#cad8e4] rounded p-2 flex flex-col text-left">
        <span class="font-bold text-[#1e293b]">Descuentos del contrato</span>
        {#each totalContrato.adjustments as adjustment}
          <div class="flex bg-[#ffffff] rounded gap-2">
            <span class="text-sm text-[#1e293b]">{adjustment.name} de un total de $ {Math.abs(adjustment.applyDiscount)}</span>
          </div>
        {/each}
      </div>

      <!-- Columnas 2-3: Servicios -->
      <div class="col-span-2 space-y-2">
        {#each totalContrato.services as service, i (i)}
          <div class="grid grid-cols-2 gap-2">
            <!-- Piezas (Columna 2) -->
            <div class="flex flex-col gap-1 text-left bg-[#ffffff] rounded p-2 border border-[#cad8e4]">
              <span class="font-bold text-[#1e293b]">Medio</span>
              {#each service.pieces as piece, pieceIndex}
                <div class="flex justify-between items-center gap-2 my-2">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm text-[#1e293b]">Nombre de pieza: {piece.name}</span>
                    <span class="text-sm text-[#1e293b]">Precio sin descuento: ${piece.price}</span>
                  </div>
                  {#if service.pieces.length > 1}
                    <Button
                      bgColor="bg-red-300 text-white hover:bg-red-400 hover:text-white"
                      onclick={() => onRemovePiece(i, pieceIndex)}
                      class="text-xs px-2 py-1 h-auto"
                    >
                      ✕
                    </Button>
                  {/if}
                </div>
              {/each}
              <span class="text-sm text-[#1e293b]">Nombre del servicio: {service.serviceName}</span>
            </div>

            <!-- Total (Columna 3) -->
            <div class="flex flex-col text-left gap-2 bg-[#ffffff] rounded p-2 border border-[#cad8e4]">
              {#if service.adjustments.length > 0}
                <span class="font-bold text-[#1e293b]">Descuentos del medio</span>
              {/if}
              {#each service.adjustments as flag}
                <span class="text-sm text-[#1e293b]">{flag.name} de un total de $ {Math.abs(flag.applyDiscount)}</span>
              {/each}
                <div class="flex gap-3 my-2 justify-between">
                  <span class="font-bold text-[#1e293b]">Total medio ${service.subTotal}</span>
                  <Button
                    bgColor="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                    onclick={() => onRemoveService(i)}
                    class="text-xs px-2 py-1 h-auto"
                  >
                    Eliminar medio
                  </Button>
                </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    {#if totalContrato !== null}
      <div class="border-t-2 pt-4 mt-4">
        <div class="flex gap-2 justify-between">
          <h1 class="text-2xl font-bold">Total con descuentos: ${totalContrato.total}</h1>
        </div>
        <div class="flex gap-2">
        <Button
          type="button"
          bgColor="bg-[#22964F] text-white hover:bg-[#1a6d3b] hover:text-whit"
          onclick={() => onRemoveAllServices()}
          class="mt-4 flex-1"
        >
          Generar contrato
        </Button>
        <Button
          type="button"
          bgColor="bg-red-500 text-white hover:bg-red-600 hover:text-white"
          onclick={() => onRemoveAllServices()}
          class="mt-4 flex-1"
        >
          Borrar todo
        </Button>
        </div>
      </div>
    {/if}
  {/if}
</div>
