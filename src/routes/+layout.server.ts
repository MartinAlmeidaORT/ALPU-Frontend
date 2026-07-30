import { USER_QUERY } from '$lib/graphql/queries/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals, depends }) => {
  depends('app:me');
  const sessionId = cookies.get('session_id');
  let user = null;
  if (locals.token) {
    const result = await locals.urql
      .query(
        USER_QUERY,
        { userId: locals.user?.id },
        { requestPolicy: 'network-only' },
      )
      .toPromise();
    if (result.data?.users) {
      user = result.data.users.nodes[0];
      user.role = user.__typename;
    }
  }
  return {
    session: sessionId,
    token: locals.token,
    user: user,
    expiresAt: locals.expiresAt,
  };
};
