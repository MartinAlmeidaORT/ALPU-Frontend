<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import { IsMobile } from '$lib/components/hooks/is-mobile.svelte.js';

  let { children } = $props();
  let logoutFormRef: HTMLFormElement;

  const isAuth = $derived(page.data.session);
  const isMobile = new IsMobile();

  function handleLogout() {
    logoutFormRef?.submit();
  }
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
            {#snippet child()}
              <button
                onclick={handleLogout}
                class={`${navigationMenuTriggerStyle()} cursor-pointer`}
                >Cerrar sesión</button
              >
            {/snippet}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <form
          bind:this={logoutFormRef}
          method="POST"
          action="/auth/logout"
          style="display: none;"
        ></form>
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
