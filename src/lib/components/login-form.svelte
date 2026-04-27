<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { client } from "$lib/graphql/client";
    import { setUser } from "$lib/stores/store";
    import {
        FieldGroup,
        Field,
        FieldLabel,
    } from "$lib/components/ui/field/index.js";
    import { redirectToGoogle } from "$lib/auth/google";
  import { setToken } from "$lib/auth/token";
  import { goto } from "$app/navigation";
  import { LOGIN_MUTATION } from "$lib/graphql/mutations/auth";

    const id = Math.random().toString(36).substr(2, 9);
    let message = $state("");
    let formData = $state({
        email: "",
        password: "",
    });
    async function handleSubmit(event: Event) {
        event.preventDefault();
        message = "";
        
        try {
            const baseInput = {
                email: formData.email,
                password: formData.password,
            };

            const result = await client.mutation(LOGIN_MUTATION, {
                input: baseInput,
            })
            .toPromise();

            if (result.error) {
                message =
                    result.error.graphQLErrors[0]?.extensions?.message ??
                    result.error.message;
                return;
            }

            const payload = result.data.login;

            setUser({
                userId: payload.user.userId,
                email: payload.user.email,
                firstName: payload.user.firstName,
                lastName: payload.user.lastName,
                userType: payload.user.__typename,
            })

            setToken(payload.token);
            goto("/");
        } catch (error) {
            message = "Error inesperado, intente nuevamente.";
            console.error(error);
        }

    }
</script>

<Card.Root class=" w-full max-w-sm">
    <Card.Header>
        <Card.Title class="text-2xl">Login</Card.Title>
        <Card.Description
            >Ingresa tu email y contraseña a continuación para iniciar sesión en
            tu cuenta</Card.Description
        >
    </Card.Header>
    <Card.Content>
        <form onsubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel for="email-{id}">Email</FieldLabel>
                    <Input
                        id="email-{id}"
                        type="email"
                        placeholder="m@example.com"
                        required
                        bind:value={formData.email}
                    />
                </Field>
                <Field>
                    <div class="flex items-center">
                        <FieldLabel for="password-{id}">Contraseña</FieldLabel>
                        <a
                            href="##"
                            class="ms-auto inline-block text-sm underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                    <Input id="password-{id}" type="password" required bind:value={formData.password} />
                </Field>
                <Field>
                    <Button type="submit" class="w-full">Iniciar Sesión</Button>
                    <Button
                        variant="outline"
                        class="w-full"
                        onclick={redirectToGoogle}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Iniciar sesión con Google
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    </Card.Content>
</Card.Root>
