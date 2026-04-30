<script lang="ts">
    import LoginForm from "$lib/components/login-form.svelte";
    import SignupForm from "$lib/components/signup-form.svelte";

    let form = $props();
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
</div>
