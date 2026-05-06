import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sessionId = cookies.get('session_id');
  return {
    session: sessionId
  };
};
