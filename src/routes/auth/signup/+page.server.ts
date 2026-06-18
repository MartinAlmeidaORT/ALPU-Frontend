import { createUrqlClient } from '$lib/graphql/client.js';
import {
  SIGNUP_BROADCASTER_MUTATION,
  SIGNUP_CLIENT_MUTATION,
} from '$lib/graphql/mutations/auth';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, cookies }) => {
    try {
      const form = await request.formData();
      const data = Object.fromEntries(form);
      data.departmentId = Number(data.departmentId);
      const { accountType, ...input } = data;

      let mutationString: string;
      let dataKey: string;

      switch (accountType) {
        case 'broadcaster':
          mutationString = SIGNUP_BROADCASTER_MUTATION;
          dataKey = 'registerBroadcaster';
          break;
        case 'client':
          mutationString = SIGNUP_CLIENT_MUTATION;
          dataKey = 'registerClient';
          break;
        default:
          return fail(400, {
            data: null,
            messages: ['Cuenta no válida'],
          });
      }

      const result = await createUrqlClient()
        .mutation(mutationString, {
          input: input,
        })
        .toPromise();

      if (result.error) {
        if (result.error.graphQLErrors.length > 0) {
          const graphQLErrorMessages = result.error.graphQLErrors.map((e) => e.message);
          return fail(400, { messages: graphQLErrorMessages });
        } else {
          return fail(400, { messages: ['Ocurrió un error inesperado. Inténtalo de nuevo.'] });
        }
      }
      if (result.data) {
        const resultData = result.data[dataKey];
        if (!resultData?.token) {
          return fail(500, {
            data: null,
            messages: ['Token no recibido'],
          });
        }
      }
    } catch (err) {
      console.error(err);
      return fail(500, {
        data: null,
        messages: ['Ocurrió un error inesperado. Inténtalo de nuevo.'],
      });
    }
    throw redirect(303, '/login?pendingState=true');
  },
};
