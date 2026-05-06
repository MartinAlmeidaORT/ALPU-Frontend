<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import FieldGroup from "$lib/components/ui/field/field-group.svelte";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import type { OperationResult } from "@urql/core";
    import {
        fetchServices,
        calculateServicePrice,
        type ServiceData,
        type ServiceDuration,
        type ServiceSpecial,
        type ServiceIVR,
        type ServiceNarrative,
        type ServiceOptions,
        type CalculateContractInput,
    } from "$lib/graphql/queries/service";
  import { onMount } from "svelte";
  
  type ServiceSelected = {
    service: ServiceDuration | ServiceSpecial | ServiceIVR | ServiceNarrative;
    selectedPrice?: number;
    selectedDurationId?: string;
  } | null;
  
    let serviceSelected: ServiceSelected = $state(null);
    let pieces = $state("0");
    let totalServices = $state<Array<{serviceId: string, options: ServiceOptions}>>([]);    
    let totalContrato = $state<any>(null);   
    let isInterior = $state(false);
    let additionalPieces = $state("0");
    let nonCommercialContent = $state(false);
    let internetBroadcast = $state(false);
    let lipSync = $state(false);
    let narrativeRoles = $state("0");
    let narrativeMinutes = $state("");
    let ivrMessage = $state("");
    let broadcastInMassMedia = $state(false);
    let fetchServicesResult = $state<OperationResult<ServiceData> | null>(
        null,
    );

    onMount(async () => {
        fetchServicesResult = await fetchServices();
    });
    let services = $derived(fetchServicesResult?.data?.services ?? []);

    async function calculateServicesSelectedPrice() {
        if (!serviceSelected) return;

        const options: ServiceOptions = {
            isInterior
        };

        options.durationId = serviceSelected.selectedDurationId;
        options.pieces = parseInt(additionalPieces);
        options.messageIVR = ivrMessage;
        options.additionalMessageIVR = parseInt(additionalPieces);
        options.narrativeMinutes =parseInt(narrativeMinutes) || 0;
        options.roleQuantity = parseInt(narrativeRoles);
        options.isNonComercial = nonCommercialContent;
        options.hasInternetPromo = internetBroadcast;
        options.hasLipSync = lipSync;
        options.hasMassMediaBroadcast = broadcastInMassMedia;


        totalServices.push({
                serviceId: serviceSelected.service.serviceId,
                options: options
        })
        const input: CalculateContractInput = {
            broadcasterId: 1,
            clientId: 2,
            services: totalServices
        };

        const result = await calculateServicePrice(input);
        if (result == null) {
            console.error("Error calculating price");
            return;
        }
        totalContrato = result.data?.calculateContract?? null;
        console.log("Total price:", totalContrato);
        serviceSelected = null;
        isInterior = false;
    }

    async function removeService(index: number) {
        totalServices = totalServices.filter((_, i) => i !== index);
        
        if (totalServices.length === 0) {
            totalContrato = null;
            return;
        }

        const input: CalculateContractInput = {
            broadcasterId: 1,
            clientId: 2,
            services: totalServices
        };

        const result = await calculateServicePrice(input);
        if (result != null) {
            totalContrato = result.data?.calculateContract?? null;
        }
    }

</script>
 
<div class="flex w-full justify-center px-4 pt-8">
    <div class="flex flex-row gap-8 w-full max-w-6xl">
        <div class="flex-1">
            <h1 class="text-2xl font-bold mb-4">Servicios</h1>
            <Table.Root>
            <Table.Caption>Todos los servicios.</Table.Caption>
            <Table.Header>
                <Table.Row>
                    <Table.Head class="w-25 px-1 text-base font-semibold">Medio/Tipo</Table.Head>
                    <Table.Head class="px-1 text-base font-semibold">1 semana</Table.Head>
                    <Table.Head class="px-1 text-base font-semibold">1 mes</Table.Head>
                    <Table.Head class="px-1 text-base font-semibold">3 meses</Table.Head>
                        <Table.Head class="px-1 text-base font-semibold">6 meses</Table.Head>
                    <Table.Head class="text-end px-1 text-base font-semibold">1 año</Table.Head>
                    </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each services as service (service.serviceId)}
                <Table.Row>
                {#if service.__typename === "ServiceDuration"}
                    <Table.Cell class="font-medium px-1">{service.name}</Table.Cell>
                    {#each service.servicePrices.toReversed() as servicePrice(servicePrice.durationId)}
                    <Table.Cell class="px-1">
                        <Button variant="outline"
                            bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
                            onclick={() => {
                            serviceSelected = { service, selectedPrice: servicePrice.price, selectedDurationId: servicePrice.durationId };
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
                        <Button variant="outline"
                            bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
                            onclick={() => {
                            serviceSelected = { service, selectedPrice: service.price };
                            }}
                            class="flex-1"
                            >
                            {service.price}
                        </Button>  
                    </Table.Cell>
                {:else if service.__typename === "ServiceIVR"}
                    <Table.Cell class="font-medium px-1">{service.name}</Table.Cell>
                    <Table.Cell class="px-1">
                        <Button variant="outline"
                            bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
                            onclick={() => {
                            serviceSelected = { service, selectedPrice: service.initialMessagePrice };
                            }}
                            class="flex-1"
                            >
                            {service.initialMessagePrice}
                        </Button>  
                    </Table.Cell>
                {:else if service.__typename === "ServiceNarrative"}
                    <Table.Cell class="font-medium px-1">{service.name}</Table.Cell>
                    <Table.Cell class="px-1">
                        <Button variant="outline" bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
                            onclick={() => {
                            serviceSelected = { service, selectedPrice: service.basePrice };
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

        <div class="flex-1 min-w-[300px]">
            <div>
                <h1 class="text-2xl font-bold mb-4">Detalles</h1>
                {#if serviceSelected !== null}
                    <FieldGroup columns={2} class="bg-gray-50 p-4 rounded-lg">
                        <Field.Content>
                            <Field.Description>Servicio</Field.Description>
                            <Field.Title>{serviceSelected.service.name}</Field.Title>
                        </Field.Content>
                        {#if serviceSelected.service.__typename === "ServiceNarrative"}
                            <Field.Content>
                                <Field.Description>Hasta 3 minutos</Field.Description>
                                <Field.Title>${serviceSelected.selectedPrice}</Field.Title>
                            </Field.Content>
                        {:else if serviceSelected.service.__typename === "ServiceIVR"} 
                            <Field.Content>
                                <Field.Description>Mensaje inicial</Field.Description>
                                <Field.Title>${serviceSelected.selectedPrice}</Field.Title>
                            </Field.Content>
                        {:else if serviceSelected.service.__typename === "ServiceSpecial"}
                            <Field.Content>
                                <Field.Description>Precio base</Field.Description>
                                <Field.Title>${serviceSelected.selectedPrice}</Field.Title>
                            </Field.Content>
                        {:else if serviceSelected.service.__typename === "ServiceDuration"} 
                            <Field.Content>
                                <Field.Description>Precio base</Field.Description>
                                <Field.Title>${serviceSelected.selectedPrice}</Field.Title>
                            </Field.Content>
                        {/if}
                        <Field.Field orientation="horizontal">
                            <Checkbox id="discInterior" bind:checked={isInterior}/>
                            <Field.Label for="discInterior">Descuento interior (-70%)</Field.Label>
                        </Field.Field>
                        {#if serviceSelected.service.__typename === "ServiceDuration"} 
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
                        {:else if serviceSelected.service.__typename === "ServiceIVR"}
                            <Field.Field orientation="horizontal">
                                <Select.Root type="single" bind:value={additionalPieces}>
                                    <Select.Trigger id="checkout-7j9-exp-year-f59">
                                    <span>
                                        {additionalPieces || "0"}
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
                                <Field.Label for ="ivrMessage">Mensaje</Field.Label>
                                <Textarea
                                    id="ivrMessage"
                                    bind:value={ivrMessage}
                                    placeholder="Ingrese su mensaje"
                                />
                            </Field.Field>
                        {:else if serviceSelected.service.__typename === "ServiceNarrative"}
                            <Field.Field>
                                <Field.Label for ="minutosNarrcion">Minutos de narración</Field.Label>
                                <Input
                                    id="minutosNarrcion"
                                    bind:value={narrativeMinutes}
                                    type="text"
                                    placeholder="Minuto adicional {serviceSelected.service.extraPrice}"
                                />
                            </Field.Field>
                            <Field.Field orientation="horizontal">
                                <Select.Root type="single" bind:value={narrativeRoles}>
                                    <Select.Trigger id="checkout-7j9-exp-year-f59">
                                    <span>
                                        {narrativeRoles || "0"}
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
                                <Checkbox id="nonCommercialContent" bind:checked={nonCommercialContent} />
                                <Field.Label for="nonCommercialContent">Contenido no comercial (-20%)</Field.Label>
                            </Field.Field>
                            <Field.Field orientation="horizontal">
                                <Checkbox id="internetBroadcast" bind:checked={internetBroadcast} />
                                <Field.Label for="internetBroadcast">Difusión en internet (+100%)</Field.Label>
                            </Field.Field>
                            <Field.Field orientation="horizontal">
                                <Checkbox id="lipSync" bind:checked={lipSync} />
                                <Field.Label for="lipSync">Sincronización labial (+20%)</Field.Label>
                            </Field.Field>
                        {:else if serviceSelected.service.__typename === "ServiceSpecial"}
                            {#if serviceSelected.service.name.includes("MAESTRO DE CEREMONIAS")}
                                <Field.Field orientation="horizontal">
                                    <Checkbox id="broadcastInMassMedia" bind:checked={broadcastInMassMedia} />
                                    <Field.Label for="broadcastInMassMedia">Difusión en medios masivos (+30%)</Field.Label>
                                </Field.Field>
                            {/if}
                        {/if}
                            <Button
                                type="button" class="col-span-2" variant="outline" bgColor="bg-[#1F5BB8] text-white hover:bg-[#1a4a94] hover:text-white"
                                onclick={() => calculateServicesSelectedPrice()}>Agregar</Button
                            >
                    </FieldGroup>
                {:else}
                    <p class="text-center text-gray-500 p-4">Selecciona un servicio</p>
                {/if}
            </div>
            <div>
                {#if totalContrato}
                    <div class="mt-4 space-y-2">
                        <h1 class="text-2xl font-bold mb-4">Total a pagar</h1>
                        {#each totalContrato.servicePrice as service, i (i)}
                            <div class="flex justify-between p-2 bg-gray-100 rounded">
                                <span>{service.service.name}</span>
                                <span>${service.totalPriceWithDiscount}</span>
                                <Button
                                    variant="outline"
                                    bgColor="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                                    onclick={() => removeService(i)}>Eliminar</Button
                                >
                            </div>
                        {/each}
                        {#if totalContrato !== null}
                            <h1 class="text-2xl font-bold mt-4">Total ${totalContrato.totalPrice}</h1>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>





