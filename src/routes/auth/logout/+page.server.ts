import { removeUserSession } from '$lib/server/auth/standalone.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ cookies, locals }): Promise<void> => {
    removeUserSession(cookies, locals);
    throw redirect(303, '/login');
  },
};
