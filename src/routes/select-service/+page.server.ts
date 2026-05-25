import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    user: locals.user,
    token: locals.token,
    rol: locals.rol,
  };
};
