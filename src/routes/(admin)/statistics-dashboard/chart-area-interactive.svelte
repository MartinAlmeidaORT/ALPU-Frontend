<script lang="ts">
  import * as Chart from '$lib/components/ui/chart/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { scaleUtc } from 'd3-scale';
  import { Area, AreaChart, ChartClipPath } from 'layerchart';
  import { curveNatural } from 'd3-shape';
  import ChartContainer from '$lib/components/ui/chart/chart-container.svelte';
  import { cubicInOut } from 'svelte/easing';

  let {
    delinquentUsersByMonths,
    paidContractsByMonths,
  }: {
    delinquentUsersByMonths: Array<{
      month: string;
      clients: Array<{ lateContracts: number }>;
    }>;
    paidContractsByMonths: Array<{
      month: string;
      clients: Array<{ paidContracts: number }>;
    }>;
  } = $props();

  const chartData = $derived.by(() => {
    const morososMap = new Map<string, number>();
    for (const entry of delinquentUsersByMonths) {
      const total = entry.clients.reduce((sum, c) => sum + c.lateContracts, 0);
      const [mm, yyyy] = entry.month.split('-');
      morososMap.set(`${yyyy}-${mm}`, total);
    }
    const puntualesMap = new Map<string, number>();
    for (const entry of paidContractsByMonths) {
      const total = entry.clients.reduce((sum, c) => sum + c.paidContracts, 0);
      const [mm, yyyy] = entry.month.split('-');
      puntualesMap.set(`${yyyy}-${mm}`, total);
    }
    const allMonths = Array.from(
      new Set([...morososMap.keys(), ...puntualesMap.keys()]),
    ).sort();
    return allMonths
      .map((month) => ({
        date: new Date(`${month}-01`),
        Puntual: puntualesMap.get(month) ?? 0,
        Morosos: morososMap.get(month) ?? 0,
      }))
      .filter((d) => d.Puntual > 0 || d.Morosos > 0); // ← filtrá meses vacíos
  });

  let timeRange = $state('6m');

  const selectedLabel = $derived.by(() => {
    switch (timeRange) {
      case '1m':
        return 'Último mes';
      case '3m':
        return 'Últimos 3 meses';
      case '6m':
        return 'Últimos 6 meses';
      default:
        return 'Último año';
    }
  });

  const filteredData = $derived.by(() => {
    if (chartData.length === 0) return [];

    const now = new Date();
    const cutoff = new Date(now);

    switch (timeRange) {
      case '1m':
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
      case '3m':
        cutoff.setMonth(cutoff.getMonth() - 3);
        break;
      case '6m':
        cutoff.setMonth(cutoff.getMonth() - 6);
        break;
      default:
        cutoff.setFullYear(cutoff.getFullYear() - 1);
    }

    return chartData.filter((item) => item.date >= cutoff);
  });

  const chartConfig = {
    Puntual: { label: 'Puntuales', color: '#3b82f6' },
    Morosos: { label: 'Morosos', color: '#f97316' },
  } satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex flex-col w-full h-full">
  <Card.Header
    class="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row"
  >
    <div class="grid flex-1 gap-1 text-center sm:text-start">
      <Card.Title>Contratos puntuales vs morosos</Card.Title>
      <Card.Description>Comparativa mensual de cumplimiento</Card.Description>
    </div>
    <Select.Root type="single" bind:value={timeRange}>
      <Select.Trigger
        class="w-48 rounded-lg sm:ms-auto"
        aria-label="Seleccionar rango"
      >
        {selectedLabel}
      </Select.Trigger>
      <Select.Content class="rounded-xl">
        <Select.Item value="1m" class="rounded-lg">Último mes</Select.Item>
        <Select.Item value="3m" class="rounded-lg">Últimos 3 meses</Select.Item>
        <Select.Item value="6m" class="rounded-lg">Últimos 6 meses</Select.Item>
        <Select.Item value="1y" class="rounded-lg">Último año</Select.Item>
      </Select.Content>
    </Select.Root>
  </Card.Header>

  <Card.Content class="flex-1 min-h-0 pt-4">
    <ChartContainer
      config={chartConfig}
      class="-ml-3 aspect-auto h-full w-full"
    >
      <AreaChart
        legend
        data={filteredData}
        x="date"
        xScale={scaleUtc()}
        series={[
          {
            key: 'Puntual',
            label: 'Puntuales',
            color: chartConfig.Puntual.color,
          },
          {
            key: 'Morosos',
            label: 'Morosos',
            color: chartConfig.Morosos.color,
          },
        ]}
        props={{
          xAxis: {
            format: (v: Date) =>
              v.toLocaleDateString('es-UY', {
                month: 'short',
                year: '2-digit',
              }),
          },
          yAxis: { format: (v: number) => String(Math.round(v)) },
        }}
      >
        {#snippet marks({ context })}
          <defs>
            <linearGradient id="fillPuntual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stop-color="#3b82f6" stop-opacity={0.6} />
              <stop offset="95%" stop-color="#3b82f6" stop-opacity={0.05} />
            </linearGradient>
            <linearGradient id="fillMorosos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stop-color="#f97316" stop-opacity={0.6} />
              <stop offset="95%" stop-color="#f97316" stop-opacity={0.05} />
            </linearGradient>
          </defs>
          <ChartClipPath
            initialWidth={0}
            motion={{
              width: { type: 'tween', duration: 1000, easing: cubicInOut },
            }}
          >
            {#each context.series.visibleSeries as s (s.key)}
              <Area
                seriesKey={s.key}
                curve={curveNatural}
                fillOpacity={0.4}
                line={{ class: 'stroke-1' }}
                motion="tween"
                {...s.props}
                fill={s.key === 'Puntual'
                  ? 'url(#fillPuntual)'
                  : 'url(#fillMorosos)'}
              />
            {/each}
          </ChartClipPath>
        {/snippet}
        {#snippet tooltip()}
          <Chart.Tooltip
            labelFormatter={(v: Date) =>
              v.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })}
            indicator="line"
          />
        {/snippet}
      </AreaChart>
    </ChartContainer>
  </Card.Content>
</Card.Root>
