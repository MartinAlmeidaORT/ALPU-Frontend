import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  const sessionId = cookies.get('session_id');
  return {
    session: sessionId,
    token: locals.token,
    user: locals.user,
  };
};
