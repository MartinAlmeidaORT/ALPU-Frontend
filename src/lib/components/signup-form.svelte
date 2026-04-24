<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
    import type { ComponentProps } from "svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { setToken } from "$lib/auth/token";
    import { client } from "$lib/graphql/client";
    import {
        REGISTER_CLIENT_MUTATION,
        REGISTER_BROADCASTER_MUTATION,
    } from "$lib/graphql/mutations/auth";
    import { setUser } from "$lib/stores/store";

    let { ...restProps }: ComponentProps<typeof Card.Root> = $props();
    let message = $state("");
    let formData = $state({
        email: "",
        firstName: "",
        lastName: "",
        rut: "",
        countryCode: "",
        password: "",
        street: "",
        city: "",
        state: "",
        agencyName: "", // Solo para agencias
    });

    let accountType = $state<"select" | "form">("select");
    let selectedOption = $state<string | null>(null);

    let paises: any[] = $state([]);

    async function fetchPaises() {
        try {
            const response = await fetch("http://localhost:5116/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
						query {
							countries {
								countryCode
								name
							}
						}
					`,
                }),
            });
            const { data } = await response.json();
            paises = data.countries;
            console.log("✅ Países cargados:", paises);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    }

    onMount(() => {
        fetchPaises();
    });


    async function handleSubmit(e: Event) {
        e.preventDefault();
        message = "";


        try {
            const baseInput = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                rut: formData.rut,
                countryCode: formData.countryCode,
                street: formData.street,
                city: formData.city,
                state: formData.state,
            };

            const result =
                selectedOption === "Cliente"
                    ? await client
                          .mutation(REGISTER_CLIENT_MUTATION, {
                              input: {
                                  ...baseInput,
                                  agencyName: formData.agencyName,
                              },
                          })
                          .toPromise()
                    : await client
                          .mutation(REGISTER_BROADCASTER_MUTATION, {
                              input: baseInput,
                          })
                          .toPromise();

            if (result.error) {
                message =
                    result.error.graphQLErrors[0]?.extensions?.message ??
                    result.error.message;
                return;
            }

            const payload =
                selectedOption === "Cliente"
                    ? result.data.registerClient
                    : result.data.registerBroadcaster;

            setUser({
                userId: payload.user.userId,
                email: payload.user.email,
                firstName: payload.user.firstName,
                lastName: payload.user.lastName,
                userType: payload.user.__typename,
            });

            setToken(payload.token);

            goto("/");
        } catch (error) {
            message = "Error inesperado, intente nuevamente.";
            console.error(error);
        }
    }
</script>

<Card.Root {...restProps}>
    {#if accountType === "select"}
        <Card.Header>
            <Card.Title class="text-2xl"
                >¿Qué tipo de cuenta deseas crear?</Card.Title
            >
            <Card.Description
                >Selecciona una opción para continuar</Card.Description
            >
        </Card.Header>
        <Card.Content>
            <div class="flex gap-4">
                <Button
                    onclick={() => {
                        selectedOption = "Cliente";
                        accountType = "form";
                    }}
                    class="flex-1"
                >
                    Agencia
                </Button>
                <Button
                    onclick={() => {
                        selectedOption = "Locutor";
                        accountType = "form";
                    }}
                    variant="outline"
                    class="flex-1"
                >
                    Locutor
                </Button>
            </div>
        </Card.Content>
    {:else if accountType === "form"}
        <Card.Header>
            <Card.Title class="text-2xl">Signup ({selectedOption})</Card.Title>
            <Card.Description
                >Ingresa tu información a continuación para crear tu cuenta</Card.Description
            >
        </Card.Header>
        <Card.Content>
            <form onsubmit={handleSubmit}>
                <Field.Group columns={2}>
                    <Field.Field>
                        <Field.Label for="name">Nombre</Field.Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Martin"
                            bind:value={formData.firstName}
                            required
                            minlength={3}
                            maxlength={50}
                            pattern="[A-Za-z]+"
                            oninvalid={(e) => {
                                const input = e.target as HTMLInputElement;
                                if (input.validity.patternMismatch) {
                                    input.setCustomValidity("Solo se permiten letras");
                                }
                            }}
                            oninput={(e) => {
                                (e.target as HTMLInputElement).setCustomValidity("");
                            }}
                        />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="apellido">Apellido</Field.Label>
                        <Input
                            id="apellido"
                            type="text"
                            placeholder="Almeida"
                            bind:value={formData.lastName}
                            required
                            minlength={3}
                            maxlength={50}
                            pattern="[A-Za-z]+"
                            oninvalid={(e) => {
                                const input = e.target as HTMLInputElement;
                                if (input.validity.patternMismatch) {
                                    input.setCustomValidity("Solo se permiten letras");
                                }
                            }}
                            oninput={(e) => {
                                (e.target as HTMLInputElement).setCustomValidity("");
                            }}
                        />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="email">Email</Field.Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            bind:value={formData.email}
                            required
                            minlength={10}
                            maxlength={100}
                        />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="password">Contraseña</Field.Label>
                        <Input
                            id="password"
                            type="password"
                            bind:value={formData.password}
                            required
                            minlength={10}
                            maxlength={60}
                        />
                        <Field.Description></Field.Description>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="rut">RUT</Field.Label>
                        <Input
                            id="rut"
                            type="text"
                            bind:value={formData.rut}
                            required
                            minlength={12}
                            maxlength={12}
                        />
                    </Field.Field>
                    {#if selectedOption === "Cliente"}
                        <Field.Field>
                            <Field.Label for="agencyName"
                                >Nombre de Agencia</Field.Label
                            >
                            <Input
                                id="agencyName"
                                type="text"
                                bind:value={formData.agencyName}
                                required
                                minlength={3}
                                maxlength={100}
                            />
                        </Field.Field>
                    {/if}
                    <Field.Field>
                        <Field.Label for="city">Ciudad</Field.Label>
                        <Input
                            id="city"
                            type="text"
                            bind:value={formData.city}
                            required
                            minlength={4}
                            maxlength={100}
                            pattern="[A-Za-z]+"
                            oninvalid={(e) => {
                                const input = e.target as HTMLInputElement;
                                if (input.validity.patternMismatch) {
                                    input.setCustomValidity("Solo se permiten letras");
                                }
                            }}
                            oninput={(e) => {
                                (e.target as HTMLInputElement).setCustomValidity("");
                            }}
                        />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="state">Departamento</Field.Label>
                        <Input
                            id="state"
                            type="text"
                            bind:value={formData.state}
                            required
                            minlength={4}
                            maxlength={100}
                            pattern="[A-Za-z]+"
                            oninvalid={(e) => {
                                const input = e.target as HTMLInputElement;
                                if (input.validity.patternMismatch) {
                                    input.setCustomValidity("Solo se permiten letras");
                                }
                            }}
                            oninput={(e) => {
                                (e.target as HTMLInputElement).setCustomValidity("");
                            }}
                        />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="street">Calle</Field.Label>
                        <Input
                            id="street"
                            type="text"
                            bind:value={formData.street}
                            required
                            minlength={4}
                            maxlength={100}
                        />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="pais">Pais</Field.Label>
                        <Select.Root
                            type="single"
                            bind:value={formData.countryCode}
                            required
                        >
                            <Select.Trigger id="pais">
                                <span>
                                    {formData.countryCode || "Seleccionar Pais"}
                                </span>
                            </Select.Trigger>
                            <Select.Content>
                                {#each paises as country (country.countryCode)}
                                    <Select.Item value={country.countryCode}>
                                        {country.name}
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </Field.Field>
                </Field.Group>
                <Field.Group class="mt-4" columns={2}>
                    <Field.Field>
                        <Button type="submit">Crear</Button>
                    </Field.Field>
                    <Field.Field>
                        <Button
                            type="button"
                            onclick={() => {
                                accountType = "select";
                                selectedOption = null;
                                message = "";
                            }}>Volver</Button
                        >
                    </Field.Field>
                </Field.Group>
            </form>
        </Card.Content>
    {/if}
</Card.Root>

{#if message}
    <div class="grid w-full max-w-xl items-start gap-4">
    <Alert.Root variant="destructive">
        <AlertCircleIcon />
        <Alert.Title>Error en el inicio de sesión</Alert.Title>
        <Alert.Description>
        <p>Por favor verifique los siguientes datos.</p>
        <p>{message}</p>
        </Alert.Description>
    </Alert.Root>
    </div>
{/if}
