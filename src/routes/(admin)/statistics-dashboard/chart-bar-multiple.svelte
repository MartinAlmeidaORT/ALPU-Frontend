<script lang="ts">
  import { scaleBand } from 'd3-scale';
  import { BarChart } from 'layerchart';
  import * as Chart from '$lib/components/ui/chart/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { cubicInOut } from 'svelte/easing';

  let {
    clientsByPaidMonths,
  }: {
    clientsByPaidMonths: Array<{
      month: string;
      clients: Array<{
        firstName: string;
        lastName: string;
        paidContracts: number;
      }>;
    }>;
  } = $props();

  let chartData = $derived(
    (clientsByPaidMonths ?? [])
      .flatMap((group) => group.clients ?? [])
      .map((client) => ({
        cliente: client.firstName + ' ' + client.lastName,
        contratos: client.paidContracts,
      }))
      .sort((a, b) => b.contratos - a.contratos)
      .slice(0, 10),
  );

  const chartConfig = {
    contratos: { label: 'Contratos', color: 'var(--chart-1)' },
  } satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex flex-col w-full h-full">
  <Card.Header class="items-center">
    <Card.Title>Gráfico de Barras - Top 10 Clientes</Card.Title>
    <Card.Description>Ordenados por cantidad de contratos</Card.Description>
  </Card.Header>

  <Card.Content class="flex-1 min-h-0 flex flex-col gap-4 pb-4">
    <div class="flex-1 min-h-0">
      <Chart.Container config={chartConfig} class="w-full h-full">
        <BarChart
          labels={{ offset: 12 }}
          data={chartData}
          xScale={scaleBand().padding(0.25)}
          x="cliente"
          series={[
            {
              key: 'contratos',
              label: 'Contratos',
              color: chartConfig.contratos.color,
            },
          ]}
          axis="x"
          rule={false}
          props={{
            bars: {
              stroke: 'none',
              radius: 4,
              rounded: 'top',
              motion: { type: 'tween', duration: 500, easing: cubicInOut },
            },
            highlight: { area: { fill: 'none' } },
            xAxis: {
              format: (d) => (d.length > 12 ? d.slice(0, 10) + '...' : d),
            },
          }}
        >
          {#snippet tooltip()}
            <Chart.Tooltip />
          {/snippet}
        </BarChart>
      </Chart.Container>
    </div>
  </Card.Content>
</Card.Root>
