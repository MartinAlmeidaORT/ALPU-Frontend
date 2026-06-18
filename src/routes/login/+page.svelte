<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation'; // 👈 Importamos goto
  import LoginForm from '$lib/components/login-form.svelte';
  import SignupForm from '$lib/components/signup-form.svelte';
  import { toast, Toaster } from 'svelte-sonner';
  
  import type { PageData, ActionData } from './$types';

  let { 
    form, 
  }: { 
    form: ActionData | null | undefined;
  } = $props();

  let hasPendingState = $derived(page.url.searchParams.get('pendingState') === 'true');

  $effect(() => {
    if (hasPendingState) {
      toast.error(
        'Cuenta creada. Espera a que un administrador confirme tu aprobación.',
        { duration: 5000 }
      );

      // Limpiamos el parámetro avisándole al enrutador de SvelteKit
      const newUrl = new URL(page.url);
      newUrl.searchParams.delete('pendingState');
      
      // keepFocus y noScroll evitan saltos extraños en la interfaz al limpiar la URL
      goto(newUrl, { replaceState: true, keepFocus: true, noScroll: true });
    }
  });
</script>

<div class="auth-container">
  <div class="flex h-screen w-full items-center justify-center px-4">
    <div class="flex flex-row justify-center w-full gap-8">
      <LoginForm {form}  />
      <div class="w-full max-w-sm">
        <SignupForm {form} />
      </div>
    </div>
  </div>
</div>

<Toaster position="top-center" />