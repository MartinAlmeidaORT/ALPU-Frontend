<script lang="ts">
  import { cn, type WithElementRef } from '$lib/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    children,
    columns,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    columns?: number;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="field-group"
  class={cn(
    'gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 group/field-group @container/field-group w-full',
    columns ? 'grid' : 'flex flex-col',
    className,
  )}
  style={columns
    ? `grid-template-columns: repeat(${columns}, minmax(0, 1fr))`
    : undefined}
  {...restProps}
>
  {@render children?.()}
</div>
