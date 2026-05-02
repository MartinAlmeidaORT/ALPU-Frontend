<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import { IsMobile } from '$lib/components/hooks/is-mobile.svelte.js';

  let { children } = $props();

  const isAuth = $derived(page.data.session);
  const isMobile = new IsMobile();
</script>

<div class="w-full flex justify-center py-4">
  <NavigationMenu.Root viewport={isMobile.current}>
    <NavigationMenu.List class="flex-wrap align-items-center">
      {#if isAuth}
        <NavigationMenu.Item>
          <NavigationMenu.Link>
            {#snippet child()}
              <a href="/" class={navigationMenuTriggerStyle()}>Home</a>
            {/snippet}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link>
            <form method="POST" action="/auth/logout">
              <button class={navigationMenuTriggerStyle()}>Cerrar sesión</button
              >
            </form>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {:else}
        <NavigationMenu.Item>
          <NavigationMenu.Link>
            {#snippet child()}
              <a href="/login" class={navigationMenuTriggerStyle()}>Login</a>
            {/snippet}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {/if}
    </NavigationMenu.List>
  </NavigationMenu.Root>
</div>

{@render children()}
