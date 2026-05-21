<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import Label from './ui/label/label.svelte';
  import type { PageData } from '../../routes/select-service/$types';
  let data: PageData = $props();
</script>

<div class="bg-white rounded-lg p-4 text-center border-2 border-[#cad8e4]">
  <h1 class="text-xl font-bold mb-2">Buscar cliente</h1>
  <div class="flex gap-4">
    <Label for="search" class="sr-only">Buscar</Label>
    <Input
      id="search"
      type="text"
      placeholder="Ingresa el nombre del cliente"
      class="flex-1"
    />
    <Button
      bgColor="bg-blue-500 text-white hover:bg-blue-600"
      onclick={() => alert('Funcionalidad de búsqueda no implementada')}
    >
      Buscar
    </Button>
  </div>
</div>
