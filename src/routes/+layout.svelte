<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
  import { IsMobile } from '$lib/components/hooks/is-mobile.svelte.js';
  import { Toaster } from '$lib/components/ui/sonner';
  import type { LayoutData } from './$types';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { onDestroy } from 'svelte';
  import { createUrqlClient } from '$lib/graphql/client';
  import {
    NOTIFICATIONS_QUERY,
    NOTIFICATION_SUB,
    DELETE_NOTIFICATION_MUTATION,
    DELETE_ALL_NOTIFICATIONS_MUTATION,
  } from '$lib/graphql/queries/notifications';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import ActiveUser from '$lib/components/custom/user/ActiveUser.svelte';
  import { Navigation } from 'lucide-svelte';

  let {
    data,
    children,
  }: {
    data: LayoutData;
    children: any;
  } = $props();

  let logoutFormRef: HTMLFormElement;
  let notifications = $state<
    Array<{ title: string; description: string; notificationId: string }>
  >([]);

  const isAuth = $derived(page.data.session);
  const isMobile = new IsMobile();
  let sub: any;
  const urqlClient = $derived(createUrqlClient(data.token));
  $effect(() => {
    if (!isAuth || !data.token) {
      notifications = [];
      return;
    }
    urqlClient
      .query(NOTIFICATIONS_QUERY, {})
      .toPromise()
      .then((response) => {
        if (response.data?.notifications) {
          notifications = response.data.notifications;
        }
      });

    const sub = urqlClient
      .subscription(NOTIFICATION_SUB, {})
      .subscribe((result) => {
        if (result.data) {
          notifications = [...notifications, result.data.onNotificationAdded];
        }
      });

    return () => {
      sub.unsubscribe();
    };
  });

  onDestroy(() => sub?.unsubscribe());

  async function borrarNotificaciones(notificationId?: string) {
    try {
      let result;
      if (notificationId) {
        result = await urqlClient.mutation(DELETE_NOTIFICATION_MUTATION, {
          notificationId,
        });
        notifications = notifications.filter(
          (n) => n.notificationId !== notificationId,
        );
      } else {
        result = await urqlClient.mutation(
          DELETE_ALL_NOTIFICATIONS_MUTATION,
          {},
        );
        notifications = [];
      }
    } catch (error) {
      return {
        token: data.token,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  function handleLogout() {
    logoutFormRef?.submit();
  }
</script>

<nav
  class="w-full border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50"
>
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
          <NavigationMenu.Item>
            {#if !isAuth}
              <NavigationMenu.Link>
                {#snippet child()}
                  <a href="/login" class={navigationMenuTriggerStyle()}>Login</a
                  >
                {/snippet}
              </NavigationMenu.Link>
            {/if}
            <NavigationMenu.Link>
              {#snippet child()}
                <a href="/voices-bank" class={navigationMenuTriggerStyle()}
                  >Banco de voces</a
                >
              {/snippet}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          {#if isAuth}
            <NavigationMenu.Item>
              {#if data.user?.role === 'Broadcaster' || data.user?.role === 'Client'}
                <NavigationMenu.Link>
                  {#snippet child()}
                    <a
                      href="/select-service"
                      class={navigationMenuTriggerStyle()}>Servicios</a
                    >
                  {/snippet}
                </NavigationMenu.Link>
              {/if}
              {#if data.user?.role === 'Accountant' || data.user?.role === 'Supervisor'}
                <NavigationMenu.Link>
                  {#snippet child()}
                    <a
                      href="/expenses-incomes"
                      class={navigationMenuTriggerStyle()}>Finanzas</a
                    >
                  {/snippet}
                </NavigationMenu.Link>
                <NavigationMenu.Link>
                  {#snippet child()}
                    <a
                      href="/statistics-dashboard"
                      class={navigationMenuTriggerStyle()}>Panel estadístico</a
                    >
                  {/snippet}
                </NavigationMenu.Link>
              {/if}
              {#if data.user?.role === 'Administrator' || data.user?.role === 'Supervisor'}
                <NavigationMenu.Link>
                  {#snippet child()}
                    <a href="/user" class={navigationMenuTriggerStyle()}
                      >Usuarios</a
                    >
                  {/snippet}
                </NavigationMenu.Link>
              {/if}
              <NavigationMenu.Link>
                {#snippet child()}
                  <a href="/contracts" class={navigationMenuTriggerStyle()}
                    >Contratos</a
                  >
                {/snippet}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          {/if}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
    <!-- Derecha: usuario + campanita + logout -->
    <div class="flex-1 flex items-center justify-end gap-3">
      {#if isAuth}
        {#if data.user}
          <ActiveUser user={data.user} />
        {/if}
        <!-- Campanita de notificaciones -->
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button
              variant="ghost"
              size="icon"
              class="relative overflow-visible text-muted-foreground hover:text-foreground"
              aria-label="Ver notificaciones"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>

              {#if notifications.length > 0}
                <span
                  class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[10px] font-medium leading-4 text-center"
                >
                  {notifications.length > 99 ? '99+' : notifications.length}
                </span>
              {/if}
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content class="sm:max-w-md">
            <AlertDialog.Header>
              <AlertDialog.Title>Panel de notificaciones</AlertDialog.Title>
            </AlertDialog.Header>

            <ScrollArea class="max-h-80 pr-4">
              {#if notifications.length === 0}
                <p class="text-sm text-muted-foreground">
                  No tienes notificaciones.
                </p>
              {:else}
                <div class="space-y-2">
                  {#each notifications as notification}
                    <div
                      class="flex items-start justify-between gap-3 rounded-md border p-3"
                    >
                      <div class="flex-1">
                        <p class="font-semibold">{notification.title}</p>
                        <p class="text-sm text-muted-foreground break-words">
                          {notification.description}
                        </p>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        class="shrink-0"
                        onclick={() =>
                          borrarNotificaciones(notification.notificationId)}
                      >
                        Borrar
                      </Button>
                    </div>
                  {/each}
                </div>
              {/if}
            </ScrollArea>

            <AlertDialog.Footer class="mt-4">
              <AlertDialog.Cancel>Volver</AlertDialog.Cancel>
              <AlertDialog.Action onclick={() => borrarNotificaciones()}>
                Borrar todas
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>

        <!-- Separador -->
        <Separator orientation="vertical" class="h-4 w-px bg-border/90" />

        <!-- Botón logout -->
        <Button
          variant="ghost"
          size="sm"
          onclick={handleLogout}
          class="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </Button>

        <form
          bind:this={logoutFormRef}
          method="POST"
          action="/auth/logout"
          class="hidden"
        ></form>
      {/if}
    </div>
  </div>
</nav>

<Toaster position="top-center" />

{@render children()}
