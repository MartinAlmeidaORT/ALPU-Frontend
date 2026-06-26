<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { ServiceType } from '$lib/graphql/schema';

    let {
    service,
    onRemoveService = () => {},
    onRemovePiece = () => {},
    valorId = $bindable(),
  }: {
    service: any;
    onRemoveService?: () => void;
    onRemovePiece?: (pieceIndex: number) => void;
    valorId?: string | number | null | undefined;
  } = $props();
</script>

<div class="grid grid-cols-2 gap-2">
  <div
    class="flex flex-col gap-1 text-left bg-[#ffffff] rounded p-2 border border-[#cad8e4]"
  >
    <span class="font-bold text-[#1e293b]">Medio</span>
    {#each service.pieces as piece, pieceIndex}
      <div class="flex justify-between items-center gap-2 my-2">
        <div class="flex flex-col gap-1">
          <span class="text-sm text-[#1e293b]"
            >Nombre de pieza: {piece.name}</span
          >
          {#if service.serviceType === ServiceType.Ivr || service.serviceType === ServiceType.Narrative}
            <span class="text-sm text-[#1e293b]"
              >Precio sin descuento: ${service.beforeDiscount}</span
            >
          {:else}
            <span class="text-sm text-[#1e293b]"
              >Precio sin descuento: ${piece.price}</span
            >
          {/if}
        </div>
        {#if service.pieces.length > 1}
          <Button
            bgColor="bg-red-300 text-white hover:bg-red-400 hover:text-white"
            onclick={() => onRemovePiece(pieceIndex)}
            class="text-xs px-2 py-1 h-auto"
          >
            ✕
          </Button>
        {/if}
      </div>
    {/each}
    <span class="text-sm text-[#1e293b]"
      >Nombre del servicio: {service.serviceName}</span
    >
  </div>

  <div
    class="flex flex-col text-left gap-2 bg-[#ffffff] rounded p-2 border border-[#cad8e4]"
  >
    {#if service.adjustments.length > 0}
      <span class="font-bold text-[#1e293b]"
        >Descuentos del medio</span
      >
    {/if}
    {#each service.adjustments as flag}
      <span class="text-sm text-[#1e293b]"
        >{flag.name} de un total de $ {Math.abs(
          flag.applyDiscount,
        )}</span
      >
    {/each}
    <div class="flex gap-3 my-2 justify-between">
      <span class="font-bold text-[#1e293b]"
        >Total medio ${service.subTotal}</span
      >
      <Button
        bgColor="bg-red-500 text-white hover:bg-red-600 hover:text-white"
        onclick={() => onRemoveService()}
        class="text-xs px-2 py-1 h-auto"
      >
        Eliminar medio
      </Button>
    </div>
  </div>
</div>