<script>
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { initAuth0 } from '$lib/auth/auth0';
    
    let isProcessing = $state(true);
    
    onMount(async () => {
        if (browser) {
            try {
                console.log('🔄 Procesando callback de Auth0...');
                await initAuth0();
                console.log('✅ Callback procesado, redirigiendo a /signup-google');
                // Usar setTimeout para asegurar que todo esté listo
                setTimeout(() => {
                    window.location.href = '/signup-google';
                }, 100);
            } catch (error) {
                console.error('❌ Error procesando callback:', error);
                isProcessing = false;
            }
        }
    });
</script>

<div class="flex h-screen w-full items-center justify-center">
    {#if isProcessing}
        <p>Autenticando... Por favor espera</p>
    {:else}
        <p>Error durante la autenticación</p>
    {/if}
</div>
