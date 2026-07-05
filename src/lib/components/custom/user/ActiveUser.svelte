<script lang="ts">
  import { translateRole } from '$lib/browser/utils';
  import type { User } from '$lib/components/types';

  let { user }: { user: User } = $props();
</script>

<div
  class="flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1.5"
>
  <div
    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold select-none"
  >
    {(user.firstName?.[0] ?? 'U').toUpperCase()}
  </div>
  <span class="text-sm font-medium leading-none whitespace-nowrap">
    {user.firstName || 'Usuario'}
  </span>
  <span class="text-muted-foreground/60 leading-none select-none">·</span>
  <span class="text-xs text-muted-foreground leading-none whitespace-nowrap">
    {translateRole(user.role)}
  </span>
</div>
