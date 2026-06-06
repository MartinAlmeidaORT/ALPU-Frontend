import { createUrqlClient } from '$lib/graphql/client.js';
import {
  SIGNUP_BROADCASTER_MUTATION,
  SIGNUP_CLIENT_MUTATION,
} from '$lib/graphql/mutations/auth';
import { fail } from '@sveltejs/kit';

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
            messages: ['Invalid account type'],
          });
      }

      const result = await createUrqlClient()
        .mutation(mutationString, {
          input: input,
        })
        .toPromise();

      if (result.error) {
        return fail(400, {
          data: null,
          messages: result.error.graphQLErrors?.map((e) => e.message) || [
            'Invalid signup data',
          ],
        });
      }
      if (result.data) {
        const resultData = result.data[dataKey];
        if (!resultData?.token) {
          return fail(500, {
            data: null,
            messages: ['No token received'],
          });
        }
      }
    } catch (err) {
      console.error(err);
      return fail(500, {
        data: null,
        messages: ['An unexpected error occurred'],
      });
    }
    return fail(400, { pendingState: true, messages: null });
  },
};
