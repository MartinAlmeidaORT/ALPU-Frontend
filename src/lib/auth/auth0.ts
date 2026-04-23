 import { browser } from '$app/environment';
 import { createAuth0Client } from '@auth0/auth0-spa-js';
 import type { Auth0Client, User } from '@auth0/auth0-spa-js';
import { writable } from 'svelte/store';
 let auth0Client: Auth0Client | null = null;

export const isAuthenticated = writable<boolean>(false);
export const user = writable<User | undefined>(undefined);
export const token = writable<string | null>(null);

// export async function initAuth0() {
//     if (!browser) return null;
    
//     auth0Client = await createAuth0Client({
//         domain: import.meta.env.VITE_AUTH0_DOMAIN,
//         clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
//         authorizationParams: {
//             redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
//         },
//         useRefreshTokens: true,        
//         cacheLocation: 'localstorage'
//     });

//     return auth0Client;
// }

// export function getAuth0Client() {
//     return auth0Client;
// }

 export async function login() {
     await auth0Client?.loginWithRedirect();
 }

export async function loginWithGoogle() {
    await auth0Client?.loginWithRedirect({
        authorizationParams: {
            connection: 'google-oauth2',
        }
    });
}

export async function logout() {
    if (!browser || !auth0Client) return;
    console.log('🔒 Cerrando sesión...');
    // Limpiar el store
    user.set(undefined);
    token.set(null);
    isAuthenticated.set(false);
    console.log('✅ Stores limpiados');
    console.log(user);
    // Logout en Auth0
    auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
}

export async function getUser() {
    return await auth0Client?.getUser();
}

 export async function getToken() {
    return await auth0Client?.getTokenSilently();
 }

export async function initAuth0() {
  console.log('🔄 Inicializando Auth0...');
  auth0Client = await createAuth0Client({ 
     domain: import.meta.env.VITE_AUTH0_DOMAIN,
     clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
     authorizationParams: {
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
        },
         useRefreshTokens: true,        
         cacheLocation: 'localstorage'

   });
   console.log('✅ Auth0 inicializado:', auth0Client);
  if (window.location.search.includes('code=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/signup-google');
  }
  console.log('🔍 Verificando autenticación...');
  const authed = await auth0Client.isAuthenticated();
  isAuthenticated.set(authed);

  if (authed) {
    const userData = await auth0Client.getUser();
    const accessToken = await auth0Client.getTokenSilently();

    user.set(userData);
    token.set(accessToken);

    // 👇 Esto te dice si funcionó
    console.log('✅ Usuario:', userData);
    console.log('✅ Token:', accessToken);
  } else {
    console.log('❌ No autenticado');
  }
}
