<script lang="ts">
    import { createUrqlClient } from "$lib/graphql/client";
    import { DASHBOARD_QUERY } from "$lib/graphql/queries/dashboard";
    import { onMount } from "svelte";
    import type { Client } from "@urql/svelte";
    import ChartBarMultiple from './chart-bar-multiple.svelte';
    import ChartPieLegend from './chart-pie-legend.svelte';
    import ChartAreaInteractive from './chart-area-interactive.svelte';
    import type { User } from "$lib/graphql/schema";

    let { data }: { data: { token: string } } = $props();

    let contractsRevenue = $state<number | null>(null);
    let institutionalRevenue = $state<number | null>(null);
    let institutionalExpenses = $state<number | null>(null);
    let topClientsByPaidContracts = $state<Array<{ firstName: string, lastName: string, paidContracts: number }>>([]);
    let topBroadcasterByContracts = $state<Array<{ user: User; contracts: number }>>([]);
    let monthlyDelinquentsGroup = $state<Array<{ month: string; clients: Array<{ lateContracts: number }> }>>([]);
    let monthlyPaidGroup = $state<Array<{ month: string; clients: Array<{ paidContracts: number }> }>>([]);

    onMount(async () => {
        const urqlClient: Client = createUrqlClient(data.token);
        const response = await urqlClient
            .query(DASHBOARD_QUERY, {})
            .toPromise();
        console.log(JSON.stringify(response.data.dashboard, null, 2)); // ← acá
        if (response.data && response.data.dashboard) {
            contractsRevenue = response.data.dashboard.totalIncome;
            institutionalRevenue = response.data.dashboard.totalIncome * 0.03;
            institutionalExpenses = response.data.dashboard.totalExpense;
            topClientsByPaidContracts = response.data.dashboard.monthlyPaidGroup;
            topBroadcasterByContracts = response.data.dashboard.topBroadcasterByContracts;
            monthlyDelinquentsGroup = response.data.dashboard.monthlyDelinquentsGroup;
            monthlyPaidGroup = response.data.dashboard.monthlyPaidGroup;
        }
    });
</script>

<div class="h-full w-full p-4 flex flex-col items-center gap-4">
    <h1 class="text-2xl font-bold">Panel Estadístico Estratégico</h1>

    <div class="w-full max-w-6xl border border-border rounded-lg shadow-sm p-8 flex flex-col gap-8">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <h2 class="text-muted-foreground text-lg">Contratos y facturación mensual</h2>
                <p class="text-4xl font-bold mt-1">${contractsRevenue?.toLocaleString() ?? '0'}</p>
            </div>
            <div>
                <h2 class="text-muted-foreground text-lg">Recaudación institucional mensual</h2>
                <p class="text-4xl font-bold mt-1">${institutionalRevenue?.toLocaleString() ?? '0'}</p>
            </div>
            <div>
                <h2 class="text-muted-foreground text-lg">Gastos institucionales mensuales</h2>
                <p class="text-4xl font-bold mt-1">${institutionalExpenses?.toLocaleString() ?? '0'}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div class="w-full h-[500px] flex flex-col">
                <ChartBarMultiple clientsByPaidMonths={topClientsByPaidContracts} />
            </div>
            <div class="w-full h-[500px] flex flex-col">
                <ChartPieLegend broadcasters={topBroadcasterByContracts} />
            </div>
        </div>

        <div class="w-full h-[550px]">
            <ChartAreaInteractive
            delinquentUsersByMonths={monthlyDelinquentsGroup}
            paidContractsByMonths={monthlyPaidGroup}
             />
        </div>

    </div>
</div>