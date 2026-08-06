<script lang="ts">
  import { fetchCountries } from '$lib/graphql/queries/country';
  import type { CountriesQuery } from '$lib/graphql/types/graphql';
  import { onMount } from 'svelte';
  import type { OperationResult } from '@urql/core';
  import * as Field from '$lib/components/ui/field/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  let countriesFetch = $state<OperationResult<CountriesQuery> | null>(null);

  let {
    countryCode = $bindable(),
  }: {
    countryCode?: string;
  } = $props();

  let selectedContractCountryName = $derived(
    countriesFetch?.data?.countries.find((c) => c.countryCode === countryCode)
      ?.name ?? 'Escoger',
  );

  $effect(() => {
    if (countriesFetch?.data?.countries) {
      const country = countriesFetch.data.countries.find(
        (c) => c.countryCode === countryCode,
      );
      selectedContractCountryName = country ? country.name : 'Escoger';
    }
  });
  onMount(async () => {
    countriesFetch = await fetchCountries();
  });
</script>

<div class="bg-white rounded-lg p-4 text-center border-2 border-[#cad8e4] w-full h-full">
  <h3 class="text-center font-semibold mb-4">País del contrato</h3>
  <Field.Field>
    <div class="flex items-center justify-center">
      <Select.Root name="countryCode" type="single" bind:value={countryCode}>
        <Select.Trigger
          id="countryCode"
          name="countryCode"
          class="h-11 px-4 text-base min-w-[160px]"
        >
          <span>{selectedContractCountryName}</span>
        </Select.Trigger>

        <Select.Content class="max-h-60 overflow-y-auto">
          {#each countriesFetch?.data?.countries as country}
            <Select.Item value={country.countryCode}>
              {country.name}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
  </Field.Field>
</div>