<script lang="ts">
  import { PieChart } from "layerchart";
  import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  let {
    broadcasters,
  }: {
    broadcasters: Array<{ user: { firstName: string; lastName: string }; contracts: number }>;  
  } = $props();

  let chartData = $derived(
    broadcasters
      .map((broadcaster) => ({
        cliente: broadcaster.user.firstName + " " + broadcaster.user.lastName,
        contratos: broadcaster.contracts,
      }))
      .sort((a, b) => b.contratos - a.contratos)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        color: `var(--chart-${index + 1})`
      }))
  );

  const chartConfig = {
    contratos: { label: "Contratos" }
  } satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex flex-col w-full h-full">
  <Card.Header class="items-center">
    <Card.Title>Gráfico de Torta - Top 5 Locutores</Card.Title>
    <Card.Description>Ordenados por cantidad de contratos</Card.Description>
  </Card.Header>
  
  <Card.Content class="flex-1 min-h-0">
    <Chart.Container config={chartConfig} class="w-full h-full">
      <PieChart
        data={chartData}
        key="cliente"
        value="contratos"
        label={(d) => d.cliente}
        cRange={chartData.map((d) => d.color)}
        props={{
          pie: {
            motion: "tween",
          },
        }}
        legend={false} >
        {#snippet tooltip()}
          <Chart.Tooltip hideLabel />
        {/snippet}
      </PieChart>
    </Chart.Container>
  </Card.Content>

  <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 px-6 pb-6 text-xs">
    {#each chartData as item}
      <div class="flex items-center gap-1.5 min-w-[100px]">
        <span 
          class="size-3 rounded-sm shrink-0" 
          style:background-color={item.color}
        ></span>
        <span class="truncate" title={item.cliente}>{item.cliente}</span>
        <span class="text-muted-foreground ml-auto pl-1">({item.contratos})</span>
      </div>
    {/each}
  </div>
</Card.Root>