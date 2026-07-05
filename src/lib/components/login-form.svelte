<script lang="ts">
  import type { ActionData } from '../../routes/auth/login/$types';
  import * as Card from '$lib/components/ui/card';
  import * as Field from '$lib/components/ui/field';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { enhance } from '$app/forms';
  import { redirectToGoogle } from '$lib/browser/auth/google';

  let {
    form,
  }: {
    form: ActionData | null | undefined;
  } = $props();

  let messages: string[] | null = $state(null);

  $effect(() => {
    if (form?.messages) messages = form.messages;
  });

  function handleSubmit() {
    return async ({ result, update }: any) => {
      messages = null;
      if (result.type === 'failure') {
        messages = result.data?.messages;
      }
      await update();
    };
  }
</script>

<Card.Root class=" w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Iniciar Sesión</Card.Title>
    <Card.Description
      >Ingresa tu email y contraseña a continuación para iniciar sesión en tu
      cuenta</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <form method="POST" action="/auth/login" use:enhance={handleSubmit}>
      <Field.Group>
        <Field.Field>
          <Field.Label for="email">Email</Field.Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </Field.Field>
        <Field.Field>
          <div class="flex items-center">
            <Field.Label for="password">Contraseña</Field.Label>
          </div>
          <Input id="password" name="password" type="password" required />
        </Field.Field>
        <Field.Field>
          <Button type="submit" class="w-full">Iniciar Sesión</Button>
          <Button variant="outline" class="w-full" onclick={redirectToGoogle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Iniciar sesión con Google
          </Button>
        </Field.Field>
      </Field.Group>
      {#if messages}
        {#each messages as msg}
          <p class="text-sm font-medium text-destructive">
            {msg}
          </p>
        {/each}
      {/if}
    </form>
  </Card.Content>
</Card.Root>
