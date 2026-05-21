import { createUrqlClient } from '$lib/graphql/client';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session_id');

  const isLoginPage = event.route.id?.includes('login');
  const isProtected = event.route.id?.includes('(protected)');

  if (isProtected && !session) {
    throw redirect(303, '/');
  }

  if (isLoginPage && session === null) {
    throw redirect(303, '/');
  }

  if (session) {
    try {
      const sessionData = JSON.parse(session);
      event.locals.user = sessionData.user;
      event.locals.urql = createUrqlClient(sessionData.token);
      event.locals.token = sessionData.token;
    } catch (error) {
      console.error('Error parsing session data:', error);
    }
  } else {
    event.locals.user = null;
    event.locals.token = null;
    event.locals.urql = createUrqlClient();
  }

  return await resolve(event);
};
