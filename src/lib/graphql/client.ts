import { createClient, cacheExchange, fetchExchange, type Client } from "@urql/svelte";

export const createUrqlClient = (token?: string): Client => {
  return createClient({
    url: import.meta.env.VITE_API_URL,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => {
      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      return {
        headers,
        // Importante: permite que las cookies se envíen en peticiones cross-origin
        credentials: 'include',
      };
    },
  });
};
