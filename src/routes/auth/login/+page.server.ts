import { createUrqlClient } from '$lib/graphql/client.js';
import { LOGIN_MUTATION } from '$lib/graphql/mutations/auth';
import { UserState } from '$lib/graphql/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, cookies, locals }) => {
    let userPending: UserState | null = null;
    let resultData;
    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);

      const result = await createUrqlClient()
        .mutation(LOGIN_MUTATION, {
          input: data,
        })
        .toPromise();

      resultData = result.data?.login;

      userPending = resultData?.user.userState;

      // Handle GraphQL-specific errors
      if (result.error) {
        return fail(400, {
          messages: result.error.graphQLErrors?.map((e) => e.message) || [
            'Invalid email or password',
          ],
        });
      }

      if (!resultData.token) {
        return fail(500, { messages: ['No token received'] });
      }
    } catch (err) {
      return fail(500, { messages: ['An unexpected error occurred'] });
    }

    if (userPending == UserState.Enabled) {
      cookies.set('session_id', JSON.stringify(resultData), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
      });
      throw redirect(302, '/contracts');
    }
    return fail(400, { pendingState: true, messages: null });
  },
};
