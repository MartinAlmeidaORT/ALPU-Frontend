<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import LoginForm from '$lib/components/login-form.svelte';
  import SignupForm from '$lib/components/signup-form.svelte';
  import { toast, Toaster } from 'svelte-sonner';
  import type { ActionData, PageData } from './$types';

  let {
    form,
    data,
  }: {
    form: ActionData | null | undefined;
    data: PageData | null | undefined;
  } = $props();
  let hasPendingState = $derived(data?.pendingState);
  $effect(() => {
    if (hasPendingState) {
      toast.error(
        'Cuenta creada. Espera a que un administrador confirme tu aprobación.',
        {
          duration: 5000,
        },
      );

      const newUrl = new URL(page.url.href);
      newUrl.searchParams.delete('pendingState');
      goto(newUrl.toString(), {
        replaceState: true,
        keepFocus: true,
        noScroll: true,
      });
    }
  });
</script>

<div class="auth-container">
  <div class="flex h-screen w-full items-center justify-center px-4">
    <div class="flex flex-row justify-center w-full gap-8">
      <LoginForm {form} />
      <div class="w-full max-w-sm">
        <SignupForm {form} />
      </div>
    </div>
  </div>
</div>

<Toaster position="top-center" />
