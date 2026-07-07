<script lang="ts">
  // Stub de BarChart / PieChart / AreaChart (layerchart). No dibuja nada real:
  // solo serializa la prop `data` en un data-attribute para poder inspeccionar
  // en los tests exactamente qué datos calculó el componente bajo test.
  let { data = [] }: { data?: unknown[] } = $props();
</script>

<div data-testid="mock-chart" data-chart={JSON.stringify(data)}></div>
