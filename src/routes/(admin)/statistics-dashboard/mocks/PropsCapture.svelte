<script lang="ts">
  // Stub genérico para componentes hijos de +page.svelte (ChartBarMultiple,
  // ChartPieLegend, ChartAreaInteractive). Serializa todas las props recibidas
  // como JSON en un data-attribute para poder verificar en los tests qué le
  // llegó exactamente a cada gráfico, sin depender de su implementación interna.
  let props: Record<string, unknown> = $props();
</script>

<div data-testid="props-capture" data-props={JSON.stringify(props)}></div>
