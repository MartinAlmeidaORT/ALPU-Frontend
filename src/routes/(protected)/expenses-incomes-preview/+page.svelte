<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index.js';

  let proofFileUrl = $state<string | null>(null);

  onMount(() => {
    const storedData = sessionStorage.getItem('billPreview');
    if (!storedData) {
      goto('/expenses-incomes');
    } else {
      const data = JSON.parse(storedData);
      proofFileUrl = data.proofFileUrl;
      sessionStorage.removeItem('billPreview');
    }
  });

  const isImage = (url: string) => {
    try {
      const urlObj = new URL(url);
      return /\.(jpeg|jpg|gif|png|webp)$/i.test(urlObj.pathname);
    } catch {
      return /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(url);
    }
  };
</script>

<div class="h-full w-full p-4 flex flex-col items-center gap-4">
  {#if proofFileUrl}
    <h1 class="text-2xl font-bold text-center">Preview del Comprobante</h1>
    <div class="preview-container w-full max-w-6xl flex justify-center bg-gray-100 p-4 rounded-lg">
      {#if isImage(proofFileUrl)}
        <img
          src={proofFileUrl}
          alt="Comprobante"
          class="max-w-full max-h-[800px] object-contain"
        />
      {:else}
        <iframe
          src={proofFileUrl}
          title="Visor de Comprobante"
          width="100%"
          height="800px"
          frameborder="0"
        ></iframe>
      {/if}
    </div>
    <div class="flex gap-4 p-4 w-full max-w-6xl">
      <Button
        onclick={() => goto('/expenses-incomes')}
        bgColor="bg-[#D9D9D9] text-[#1F5BB8] hover:bg-white"
        class="mt-4 flex-1"
      >
        Volver
      </Button>
    </div>
  {:else}
    <div class="flex flex-col items-center gap-2 mt-20">
      <div
        class="w-8 h-8 rounded-full border-4 border-gray-300 border-t-[#22964F] animate-spin"
      ></div>
    </div>
  {/if}
</div>
