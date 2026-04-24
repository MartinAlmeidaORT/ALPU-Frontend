<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { setToken } from "$lib/auth/token";
    import { googleAuth } from "$lib/graphql/mutations/auth";
    import { setGooglePrefill } from "$lib/stores/google-store";
    import { onMount } from "svelte";

    let isProcessing = $state(true);

    onMount(async () => {
        if (browser) {
            try {
                const params = new URLSearchParams(window.location.search);
                const code = params.get("code");

                if (!code) throw new Error("No authorization code found");

                const result = await googleAuth(code);

                if (result.googleAuth.requiresRegistration == true) {
                    setGooglePrefill({
                        subject: result.googleAuth.subject,
                        email: result.googleAuth.email,
                        firstName: result.googleAuth.firstName,
                        lastName: result.googleAuth.lastName,
                    });
                    goto("/signup-google");
                } else {
                    setToken(result.token);
                    goto("/");
                }
            } catch (error) {
                console.error("❌ Error procesando callback:", error);
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
