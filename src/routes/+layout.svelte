<script lang="ts">
    import "./layout.css";
    let { children, data } = $props();
    import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
    import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
    import { IsMobile } from "$lib/components/hooks/is-mobile.svelte.js";

    let user: any = $state(null);
    let token: any = $state("");
    const isMobile = new IsMobile();
    // let authReady = $state(false);
</script>

<div class="w-full flex justify-center py-4">
    <!-- {#if authReady} -->
    <NavigationMenu.Root viewport={isMobile.current}>
        <NavigationMenu.List class="flex-wrap align-items-center">
            <NavigationMenu.Item>
                <NavigationMenu.Link>
                    {#snippet child()}
                        <a href="/" class={navigationMenuTriggerStyle()}>Home</a
                        >
                    {/snippet}
                </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
                <NavigationMenu.Link>
                    {#snippet child()}
                        <a
                            href="login-signup"
                            class={navigationMenuTriggerStyle()}>Sesion</a
                        >
                    {/snippet}
                </NavigationMenu.Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
    </NavigationMenu.Root>
    <!-- {/if} -->
</div>

<!-- {#if authReady} -->
{@render children()}
<!-- {/if} -->
