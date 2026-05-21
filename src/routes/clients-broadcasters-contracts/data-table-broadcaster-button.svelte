<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
  import { Button } from '$lib/components/ui/button/index.js';

  let { variant = 'ghost', ...restProps }: ComponentProps<typeof Button> =
    $props();
</script>

<Button {variant} {...restProps}>
  <div class="flex items-center gap-2">
    <span>Locutor</span>
    <ArrowUpDownIcon />
  </div>
</Button>
