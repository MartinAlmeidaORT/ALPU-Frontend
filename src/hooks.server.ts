import { clearLocals, decodeToken } from '$lib/server/auth/standalone';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session_id');
  const isLoginPage = event.route.id?.includes('login');
  const isProtected = event.route.id?.includes('(protected)');
  const isAdminProtected = event.route.id?.includes('(admin)');
  const isUserProtected = event.route.id?.includes('(user)');
  const isHome = event.route.id === null || event.route.id === '/';
  if (isHome) {
    if (token) {
      throw redirect(303, '/contracts');
    } else {
      throw redirect(303, '/login');
    }
  }

  if ((isProtected || isAdminProtected || isUserProtected) && !token) {
    throw redirect(303, '/login');
  }
  if (isLoginPage && token !== undefined) {
    throw redirect(303, '/logout');
  }

  if (token) {
    decodeToken(token, event.locals);
  } else {
    clearLocals(event.locals);
  }

  if (
    isAdminProtected &&
    event.locals.user?.role !== 'Administrator' &&
    event.locals.user?.role !== 'Supervisor' &&
    event.locals.user?.role !== 'Accountant'
  ) {
    throw redirect(303, '/contracts');
  }

  if (
    isUserProtected &&
    event.locals.user?.role !== 'Client' &&
    event.locals.user?.role !== 'Broadcaster'
  ) {
    throw redirect(303, '/contracts');
  }

  return await resolve(event);
};
