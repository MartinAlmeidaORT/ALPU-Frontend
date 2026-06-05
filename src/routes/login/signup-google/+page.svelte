<script lang="ts">
  import SignupGoogleForm from '$lib/components/signup-google-form.svelte';
  import { Toaster } from 'svelte-sonner';
  let { form } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <div class="flex flex-row justify-center w-full gap-8">
    <div class="w-full max-w-sm">
      <SignupGoogleForm {form} />
    </div>
  </div>
</div>

