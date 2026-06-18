import { createUrqlClient } from '$lib/graphql/client';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session_id');

  const isLoginPage = event.route.id?.includes('login');
  const isProtected = event.route.id?.includes('(protected)');
  const isAdminProtected = event.route.id?.includes('(admin)');
  const isUserProtected = event.route.id?.includes('(user)');
  const isHome = event.route.id === null || event.route.id === '/';
  if (isHome) {
    if (session) {
      throw redirect(303, '/contracts');
    } else {
      throw redirect(303, '/login');
    }
  }

  if ((isProtected || isAdminProtected || isUserProtected) && !session) {
    throw redirect(303, '/login');
  }

  if (isLoginPage && session === null) {
    throw redirect(303, '/logout');
  }

  if (session) {
    try {
      const sessionData = JSON.parse(session);
      event.locals.user = sessionData.user;
      event.locals.urql = createUrqlClient(sessionData.token);
      event.locals.token = sessionData.token;
      event.locals.rol = sessionData.user.__typename;
      event.locals.userState = sessionData.user.userState;
    } catch (error) {
      console.error('Error parsing session data:', error);
    }
  } else {
    event.locals.user = null;
    event.locals.userState = null;
    event.locals.rol = null;
    event.locals.token = null;
    event.locals.urql = createUrqlClient();
  }

  if (
    isAdminProtected &&
    event.locals.rol !== 'Administrator' &&
    event.locals.rol !== 'Supervisor' &&
    event.locals.rol !== 'Accountant'
  ) {
    throw redirect(303, '/contracts');
  }

  if (
    isUserProtected &&
    event.locals.rol !== 'Client' &&
    event.locals.rol !== 'Broadcaster'
  ) {
    throw redirect(303, '/contracts');
  }

  return await resolve(event);
};
