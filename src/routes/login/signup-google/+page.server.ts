import { createUrqlClient } from '$lib/graphql/client';
import {
  COMPLETE_GOOGLE_SIGNUP_BROADCASTER_MUTATION,
  COMPLETE_GOOGLE_SIGNUP_CLIENT_MUTATION,
} from '$lib/graphql/mutations/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
  const pendingCookie = cookies.get('pending_signup');

  if (!pendingCookie) {
    throw redirect(302, '/login'); // Session expired or accessed directly
  }

  return {
    pendingData: pendingCookie ? JSON.parse(pendingCookie) : null,
  };
};

export const actions = {
  default: async ({ request, cookies }) => {
    try {
      const formData = await request.formData();
      const pendingData = JSON.parse(cookies.get('pending_signup') || '{}');
      const data = Object.fromEntries(formData.entries());
      data.departmentId = Number(data.departmentId);

      const { accountType, ...input } = { ...pendingData, ...data };

      let mutationString: string;
      let dataKey: string;

      switch (accountType) {
        case 'broadcaster':
          mutationString = COMPLETE_GOOGLE_SIGNUP_BROADCASTER_MUTATION;
          dataKey = 'completeGoogleSignUpBroadcaster';
          break;
        case 'client':
          mutationString = COMPLETE_GOOGLE_SIGNUP_CLIENT_MUTATION;
          dataKey = 'completeGoogleSignUpClient';
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
          messages: result.error.graphQLErrors.map((e) => e.message) || [
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
        cookies.delete('pending_signup', { path: '/' });
      }
    } catch (err) {
      return fail(500, {
        data: null,
        messages: ['An unexpected error occurred'],
      });
    }
    return fail(400, { pendingState: true, messages: null });
  },
};
