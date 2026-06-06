<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import { IsMobile } from '$lib/components/hooks/is-mobile.svelte.js';
  import { Toaster } from '$lib/components/ui/sonner';
  import type { PageData } from './$types';
  
  let {
    data,
    children,
  }: {
    data: PageData;
    children: any;
  } = $props();
  
  let logoutFormRef: HTMLFormElement;

  const isAuth = $derived(page.data.session);
  const isMobile = new IsMobile();

  function handleLogout() {
    logoutFormRef?.submit();
  }

  const rol = $derived.by(() =>  {
    switch (data.rol) {
      case 'Broadcaster':
        return 'Locutor';
      case 'Client':
        return 'Cliente';
      case 'Accountant':
        return 'Contador';
      case 'Supervisor':
        return 'Supervisor';
      case 'Administrator':
        return 'Administrador';
      default:
        return data.rol;
    }
  });
</script>

<nav class="w-full border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
  <div class="flex w-full items-center justify-between px-6 py-0 h-14">

    <!-- Brand -->
    <div class="flex-1 flex items-center">
      <a href="/">
        <img src="/logo.png" alt="ALPU" class="h-8 w-auto" />
      </a>
    </div>

    <!-- Links centrales -->
    <div class="flex shrink-0 justify-center">
      <NavigationMenu.Root viewport={isMobile.current}>
        <NavigationMenu.List class="flex-wrap items-center">
          {#if isAuth}
            <NavigationMenu.Item>
              {#if data.rol === 'Broadcaster' || data.rol === 'Client'}
                <NavigationMenu.Link>
                  {#snippet child()}
                    <a href="/select-service" class={navigationMenuTriggerStyle()}>Servicios</a>
                  {/snippet}
                </NavigationMenu.Link>
              {/if}
              {#if data.rol === 'Accountant' || data.rol === 'Supervisor'}
                <NavigationMenu.Link>
                  {#snippet child()}
                    <a href="/expenses-incomes" class={navigationMenuTriggerStyle()}>Finanzas</a>
                  {/snippet}
                </NavigationMenu.Link>
              {/if}
              {#if data.rol === 'Administrator' || data.rol === 'Supervisor'}
                <NavigationMenu.Link>
                  {#snippet child()}
                    <a href="/user" class={navigationMenuTriggerStyle()}>Usuarios</a>
                  {/snippet}
                </NavigationMenu.Link>
              {/if}
              <NavigationMenu.Link>
                {#snippet child()}
                  <a href="/contracts" class={navigationMenuTriggerStyle()}>Contratos</a>
                {/snippet}
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

    <!-- Derecha: usuario + logout -->
    <div class="flex-1 flex items-center justify-end gap-3">
      {#if isAuth}
        <!-- Chip de usuario -->
        <div class="flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1.5">
          <!-- Avatar -->
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold select-none">
            {(data.user.firstName?.[0] ?? 'U').toUpperCase()}
          </div>
          <!-- Nombre · Rol en línea -->
          <span class="text-sm font-medium leading-none whitespace-nowrap">
            {data.user.firstName || 'Usuario'}
          </span>
          <span class="text-muted-foreground/60 leading-none select-none">·</span>
          <span class="text-xs text-muted-foreground leading-none whitespace-nowrap">
            {rol}
          </span>
        </div>

        <!-- Separador -->
        <div class="h-4 w-px bg-border/60"></div>

        <!-- Botón logout -->
        <button
          onclick={handleLogout}
          class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-md hover:bg-destructive/8 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>

        <form bind:this={logoutFormRef} method="POST" action="/auth/logout" class="hidden"></form>
      {/if}
    </div>

  </div>
</nav>

<Toaster position="top-center" />

{@render children()}