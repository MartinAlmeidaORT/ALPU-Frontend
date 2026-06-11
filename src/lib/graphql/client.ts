import {
  cacheExchange,
  createClient,
  fetchExchange,
  subscriptionExchange,
  type Client,
} from '@urql/svelte';
import { createClient as createWsClient, type SubscribePayload } from 'graphql-ws';


export const createUrqlClient = (token?: string): Client => {
  const wsClient = createWsClient({
    url: import.meta.env.VITE_WS_URL,
    connectionParams: () => ({
      Authorization: token ? `Bearer ${token}` : ''
    })
  });

  return createClient({
    url: import.meta.env.VITE_API_URL,
    exchanges: [
      cacheExchange,
      fetchExchange,
      subscriptionExchange({
        forwardSubscription: (request) => ({
            subscribe: (sink) => ({
                unsubscribe: wsClient.subscribe(request as SubscribePayload, sink)
            })
        })
      })
    ],
    fetchOptions: () => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return {
        headers,
        credentials: 'include',
      };
    },
  });
};