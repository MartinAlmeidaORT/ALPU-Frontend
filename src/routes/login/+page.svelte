<!-- <script lang="ts">
    import LoginForm from "$lib/components/login-form.svelte";
    import SignupForm from "$lib/components/signup-form.svelte";
</script> -->

<script lang="ts">
    import LoginForm from "$lib/components/login-form.svelte";
    import SignupForm from "$lib/components/signup-form.svelte";

    export let form;
    let isLogin = true;
</script>

<div class="auth-container">
    <div class="flex h-screen w-full items-center justify-center px-4">
        <div class="flex flex-row justify-center w-full gap-8">
            <LoginForm {form} />
            <div class="w-full max-w-sm">
                <SignupForm {form} />
            </div>
        </div>
    </div>
    <!-- {#if isLogin}
        <LoginForm {form} />
        <button on:click={() => (isLogin = false)}
            >Need an account? Sign up</button
        >
    {:else}
        <h1>Already have an account? Login</h1>
        <div class="flex flex-row justify-center w-full gap-8">
            <SignupForm {form} />
        </div>
        <button on:click={() => (isLogin = true)}
            >Already have an account? Login</button
        >
    {/if} -->
</div>
