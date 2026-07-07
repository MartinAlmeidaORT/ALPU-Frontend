<script lang="ts">
  // Stub genérico usado para reemplazar componentes de UI (Card.*, Chart.Container,
  // ChartContainer, Select.*) en los tests. Simplemente renderiza sus children/snippets
  // y expone cualquier prop relevante como data-attribute por si algún test la necesita.
  let { children, value, ...rest }: Record<string, unknown> = $props();
</script>

<div data-testid="stub" data-value={value as string | undefined} {...rest}>
  {@render (children as (() => unknown) | undefined)?.()}
</div>
