import { getToken } from "$lib/auth/token";
import { createClient, cacheExchange, fetchExchange } from "@urql/svelte";

export const client = createClient({
  url: import.meta.env.VITE_API_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    headers: {
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
  }),
});

export const getClient = () => client;
