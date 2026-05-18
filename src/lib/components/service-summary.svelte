<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Alert from '$lib/components/ui/alert/index.js';

  interface ServicePrice {
    pieceName: string;
    service: string;
    totalPriceWithDiscount: number;
    serviceFlags: Array<{ label: string } | null | boolean>;
  }

  interface TotalContrato {
    servicePrice: ServicePrice[];
    totalPrice: number;
  }

  // Props
  export let totalContrato: TotalContrato | null = null;
  export let errorMessages: string | null = null;
  export let onRemoveService: (index: number) => void = () => {};
  export let onRemoveAllServices: () => void = () => {};
</script>

<div class="space-y-2 bg-white rounded-lg p-4 text-center">
  {#if errorMessages}
    <Alert.Root class="border-red-400 bg-red-100">
      <Alert.Title class="text-red-700">{errorMessages}</Alert.Title>
    </Alert.Root>
  {/if}

  <h1 class="text-2xl font-bold mb-4">Total a pagar</h1>

  {#if !totalContrato}
    <span>No ha seleccionado ningún servicio.</span>
  {:else}
    <div class="space-y-2 max-h-96 overflow-y-auto">
      {#each totalContrato.servicePrice as service, i (i)}
        <div>
          <div class="flex justify-between items-center p-2 bg-gray-100 rounded gap-2 flex-wrap">
            <div class="flex flex-col gap-1 flex-1 text-left">
              <span class="font-semibold">{service.pieceName}</span>
              <span class="text-sm text-gray-600">{service.service}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-bold">${service.totalPriceWithDiscount}</span>

              {#each service.serviceFlags as flag}
                {#if flag != null && flag != false && typeof flag === 'object' && 'label' in flag}
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {flag.label}
                  </span>
                {/if}
              {/each}

              <Button
                variant="outline"
                bgColor="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                onclick={() => onRemoveService(i)}
                class="text-xs px-2 py-1 h-auto"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if totalContrato !== null}
      <div class="border-t-2 pt-4 mt-4">
        <h1 class="text-2xl font-bold">Total ${totalContrato.totalPrice}</h1>

        <Button
          type="button"
          variant="outline"
          bgColor="bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
          onclick={() => onRemoveAllServices()}
          class="mt-4 w-full"
        >
          Borrar todo
        </Button>
      </div>
    {/if}
  {/if}
</div>
