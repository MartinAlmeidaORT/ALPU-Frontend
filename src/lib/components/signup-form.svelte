<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import type { ComponentProps } from "svelte";
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { usuario } from '$lib/store';

	

	let { ...restProps }: ComponentProps<typeof Card.Root> = $props();
	let message = $state('');
	let formData = $state({
		email: '',
		firstName: '',
		lastName: '',
		rut: '',
		countryCode: '',
		password: '',
		street: '',
		city: '',
		state: '',
		agencyName: '' // Solo para agencias
	});

	let accountType = $state<'select' | 'form'>('select');
	let selectedOption = $state<string | null>(null);

	let paises: any[] = $state([]);
	
	async function fetchPaises() {
		try {
			const response = await fetch('http://localhost:5116/graphql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `
						query {
							countries {
								countryCode
								name
							}
						}
					`
				})
			});
			const { data } = await response.json();
			paises = data.countries;
			console.log('✅ Países cargados:', paises);
		} catch (error) {
			console.error('Error fetching countries:', error);
		}
	}

	onMount(() => {
		fetchPaises();
	});
	async function handleSubmit(e: Event) {
		e.preventDefault();

		let queryResponse = `
		mutation registerClient($input: CreateClientDTOInput!) {
				registerClient(input: $input) {
					token,
					user {
						userId
						email
					}
				}
			}
		`;
		let data: Record<string, any> = {
			email: formData.email,
			firstName: formData.firstName,
			lastName: formData.lastName,
			rut: formData.rut,
			countryCode: formData.countryCode,
			password: formData.password,
			street: formData.street,
			city: formData.city,
			state: formData.state
		};
		if (selectedOption === 'Locutor') {
			queryResponse = `
			mutation registerBroadcaster($input: CreateBroadcasterDTOInput!) {
					registerBroadcaster(input: $input) {
						token,
						user {
							userId
							email
						}
					}
				}
			`;
		} else {
			data.agencyName = formData.agencyName || null;
		}
		const response = await fetch('http://localhost:5116/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: queryResponse,
				variables: {
					input : data
				}
			})
		});
	    if (response.ok) {
      		const result = await response.json();
			const userData = result.data.registerClient || result.data.registerBroadcaster;
			usuario.set({
				...userData.user,
				accountType: selectedOption,
				token: userData.token
			});
     		message = result.message;
			goto('/');
    	} else {
      	message = "Error creating user.";
    	}	

	}
</script>	

<Card.Root {...restProps}>
	{#if accountType === 'select'}
		<Card.Header>
			<Card.Title class="text-2xl">¿Qué tipo de cuenta deseas crear?</Card.Title>
			<Card.Description>Selecciona una opción para continuar</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex gap-4">
				<Button
					onclick={() => {
						selectedOption = 'Cliente';
						accountType = 'form';
					}}
					class="flex-1"
				>
					Agencia
				</Button>
				<Button
					onclick={() => {
						selectedOption = 'Locutor';
						accountType = 'form';
					}}
					variant="outline"
					class="flex-1"
				>
					Locutor
				</Button>
			</div>
		</Card.Content>
	{:else if accountType === 'form'}
		<Card.Header>
			<Card.Title class="text-2xl">Signup ({selectedOption})</Card.Title>
			<Card.Description>Ingresa tu información a continuación para crear tu cuenta</Card.Description>
		</Card.Header>
		<Card.Content>
		<form onsubmit={handleSubmit}>
			<Field.Group columns={2}>
				<Field.Field>
					<Field.Label for="name"> Nombre</Field.Label>
					<Input id="name" type="text" placeholder="Martin" bind:value={formData.firstName} required />
				</Field.Field>
				<Field.Field>
					<Field.Label for="apellido"> Apellido</Field.Label>
					<Input id="apellido" type="text" placeholder="Almeida" bind:value={formData.lastName} required />
				</Field.Field>
				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input id="email" type="email" placeholder="m@example.com" bind:value={formData.email} required />
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Contraseña</Field.Label>
					<Input id="password" type="password" bind:value={formData.password} required />
					<Field.Description></Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="rut">RUT</Field.Label>
					<Input id="rut" type="text" bind:value={formData.rut} required />
				</Field.Field>
				{#if selectedOption === 'Cliente'}
					<Field.Field>
						<Field.Label for="agencyName">Nombre de Agencia</Field.Label>
						<Input id="agencyName" type="text" bind:value={formData.agencyName} required />
					</Field.Field>
				{/if}
				<Field.Field>
					<Field.Label for="city">Ciudad</Field.Label>
					<Input id="city" type="text" bind:value={formData.city} required />
				</Field.Field>
				<Field.Field>
					<Field.Label for="state">Departamento</Field.Label>
					<Input id="state" type="text" bind:value={formData.state} required />
				</Field.Field>
				<Field.Field>
					<Field.Label for="street">Calle</Field.Label>
					<Input id="street" type="text" bind:value={formData.street} required />
				</Field.Field>
				<Field.Field>
				<Field.Label for="pais">Pais</Field.Label>
					<Select.Root type="single" bind:value={formData.countryCode}>
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
						<Button type="button"
							onclick={() => {
								accountType = 'select';
								selectedOption = null;
							}}
						>Volver</Button>
					</Field.Field>
		</Field.Group>
		</form>
	</Card.Content>
	{/if}
</Card.Root>
