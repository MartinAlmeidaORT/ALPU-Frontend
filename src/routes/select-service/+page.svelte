<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import FieldGroup from "$lib/components/ui/field/field-group.svelte";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import type { OperationResult } from "@urql/core";
    import {
        fetchServices,
        type ServiceData,
    } from "$lib/graphql/queries/service";
  import { onMount } from "svelte";
    let serviceSelected = $state({name: "", price: 0, type: ""});
    let totalServices = $state([])
    let pieces = $state("0");
    let roles = $state("0");
    let fetchServicesResult = $state<OperationResult<ServiceData> | null>(
        null,
    );

    onMount(async () => {
        fetchServicesResult = await fetchServices();
    });
    let services = $derived(fetchServicesResult?.data?.services ?? []);

</script>
 
<div class="flex w-full justify-center px-4 pt-8">
    <div class="flex flex-row gap-8 w-full max-w-6xl">
        <div class="flex-1">
            <h1 class="text-2xl font-bold mb-4">Servicios</h1>
            <Table.Root>
            <Table.Caption>Todos los servicios.</Table.Caption>
            <Table.Header>
                <h1 class="text-2xl font-bold -mb-2">Servicios</h1>
                <Table.Row>
                    <Table.Head class="w-25 px-1">Medio/Tipo</Table.Head>
                    <Table.Head class="px-1">1 semana</Table.Head>
                    <Table.Head class="px-1">1 mes</Table.Head>
                    <Table.Head class="px-1">3 meses</Table.Head>
                        <Table.Head class="px-1">6 meses</Table.Head>
                    <Table.Head class="text-end px-1">1 año</Table.Head>
                    </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each services as service (service.serviceId)}
                <Table.Row>
                {#if service.__typename === "ServiceDuration"}
                    <Table.Cell class="font-medium px-1">{service.name}</Table.Cell>
                    {#each service.servicePrices.toReversed() as servicePrice(servicePrice.durationId)}
                    <Table.Cell class="px-1">
                        <Button
                            onclick={() => {
                            serviceSelected = {name: service.name, price: servicePrice.price, type: service.__typename};
                            }}
                            class="flex-1"
                            >
                            {servicePrice.price}
                        </Button>  
                    </Table.Cell>
                    {/each}
                {:else if service.__typename === "ServiceSpecial"}
                    <Table.Cell class="font-medium px-1">{service.name}</Table.Cell>
                    <Table.Cell class="px-1">
                        <Button
                            onclick={() => {
                            serviceSelected = {name: service.name, price: service.price, type: service.__typename};
                            }}
                            class="flex-1"
                            >
                            {service.price}
                        </Button>  
                    </Table.Cell>
                {:else if service.__typename === "ServiceIVR"}
                    <Table.Cell class="font-medium px-1">{service.name}</Table.Cell>
                    <Table.Cell class="px-1">
                        <Button
                            onclick={() => {
                            serviceSelected = {name: service.name, price: service.initialMessagePrice, type: service.__typename};
                            }}
                            class="flex-1"
                            >
                            {service.initialMessagePrice}
                        </Button>  
                    </Table.Cell>
                {:else if service.__typename === "ServiceNarrative"}
                    <Table.Cell class="font-medium px-1">{service.name}</Table.Cell>
                    <Table.Cell class="px-1">
                        <Button
                            onclick={() => {
                            serviceSelected = {name: service.name, price: service.basePrice, type: service.__typename};
                            }}
                            class="flex-1"
                            >
                            {service.basePrice}
                        </Button>  
                    </Table.Cell>
                {/if}
                </Table.Row>
                {/each}
            </Table.Body>
            <Table.Footer>
            </Table.Footer>
        </Table.Root>
        </div>

        <div class="flex-1">
            <h1 class="text-2xl font-bold mb-4">Detalles</h1>
            {#if serviceSelected.name != ""}
                <FieldGroup columns={2} class="bg-gray-50 p-4 rounded-lg">
                    <Field.Content>
                        <Field.Description>Servicio seleccionado</Field.Description>
                        <Field.Title>{serviceSelected.name}</Field.Title>
                    </Field.Content>
                    <Field.Content>
                        <Field.Description>Precio base</Field.Description>
                        <Field.Title>${serviceSelected.price}</Field.Title>
                    </Field.Content>
                    <Field.Field orientation="horizontal">
                        <Checkbox id="discInterior" />
                        <Field.Label for="discInterior">Descuento interior (-70%)</Field.Label>
                    </Field.Field>
                    {#if serviceSelected.type === "ServiceDuration"} 
                    <Field.Field orientation="horizontal">
                        <Select.Root type="single" bind:value={pieces}>
                            <Select.Trigger id="checkout-7j9-exp-year-f59">
                            <span>
                                {pieces || "0"}
                            </span>
                            </Select.Trigger>
                            <Select.Content>
                            <Select.Item value="1">1</Select.Item>
                            <Select.Item value="2">2</Select.Item>
                            <Select.Item value="3">3</Select.Item>
                            <Select.Item value="4">4</Select.Item>
                            <Select.Item value="5">5</Select.Item>
                            </Select.Content>
                        </Select.Root>
                        <Field.Label for="piezas">Piezas</Field.Label>
                    </Field.Field>
                    {:else if serviceSelected.type === "ServiceIVR"}
                    <Field.Field orientation="horizontal">
                        <Select.Root type="single" bind:value={pieces}>
                            <Select.Trigger id="checkout-7j9-exp-year-f59">
                            <span>
                                {pieces || "0"}
                            </span>
                            </Select.Trigger>
                            <Select.Content>
                            <Select.Item value="1">1</Select.Item>
                            <Select.Item value="2">2</Select.Item>
                            <Select.Item value="3">3</Select.Item>
                            <Select.Item value="4">4</Select.Item>
                            <Select.Item value="5">5</Select.Item>
                            </Select.Content>
                        </Select.Root>
                        <Field.Label for="mensajes">Mensajes adicionales</Field.Label>
                    </Field.Field>
                    <Field.Field class="col-span-2">
                        <Field.Label for ="mensajeIVR">Mensaje</Field.Label>
                        <Input
                            id="mensajeIVR"
                            type="text"
                            placeholder="Ingrese su mensaje"
                        />
                    </Field.Field>
                    {:else if serviceSelected.type === "ServiceNarrative"}
                    <Field.Field>
                        <Field.Label for ="minutosNarrcion">Minutos de narración</Field.Label>
                        <Input
                            id="minutosNarrcion"
                            type="text"
                            placeholder="0"
                        />
                    </Field.Field>
                    <Field.Field orientation="horizontal">
                        <Select.Root type="single" bind:value={roles}>
                            <Select.Trigger id="checkout-7j9-exp-year-f59">
                            <span>
                                {roles || "0"}
                            </span>
                            </Select.Trigger>
                            <Select.Content>
                            <Select.Item value="1">1</Select.Item>
                            <Select.Item value="2">2</Select.Item>
                            <Select.Item value="3">3</Select.Item>
                            <Select.Item value="4">4</Select.Item>
                            <Select.Item value="5">5</Select.Item>
                            </Select.Content>
                        </Select.Root>
                        <Field.Label for="roles">Roles</Field.Label>
                    </Field.Field>
                    <Field.Field orientation="horizontal">
                        <Checkbox id="contenidoNoComercial" />
                        <Field.Label for="contenidoNoComercial">Contenido no comercial (-20%)</Field.Label>
                    </Field.Field>
                    <Field.Field orientation="horizontal">
                        <Checkbox id="difusionEninternet" />
                        <Field.Label for="difusionEninternet">Difusión en internet (+100%)</Field.Label>
                    </Field.Field>
                    <Field.Field orientation="horizontal">
                        <Checkbox id="sincroLabial" />
                        <Field.Label for="sincroLabial">Sincronización labial (+20%)</Field.Label>
                    </Field.Field>
                    {/if}
                        <Button
                            type="button" class="col-span-2" onclick={() => {

                            }}>Agregar</Button
                        >
                </FieldGroup>
            {:else}
                <p class="text-center text-gray-500 p-4">Selecciona un servicio</p>
            {/if}
        </div>
    </div>
</div>

{#if totalServices.length > 0}
<div class="flex w-full justify-center px-4 pt-8">
            <h1 class="text-2xl font-bold mb-4">Total a pagar</h1>
                <div class="space-y-4 p-4 bg-gray-50 rounded-lg">
                    for
                </div>
</div>
{/if}




