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

        const token = resultData.token;

        if (!token) {
          return fail(500, {
            data: null,
            messages: ['No token received'],
          });
        }

        cookies.set('session_id', token, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 day
        });
      }
    } catch (err) {
      console.error(err);
      return fail(500, {
        data: null,
        messages: ['An unexpected error occurred'],
      });
    }

    throw redirect(302, '/contracts');
  },
};
