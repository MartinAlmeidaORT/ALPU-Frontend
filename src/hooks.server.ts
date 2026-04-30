import { redirect, type Handle } from '@sveltejs/kit';
import { createUrqlClient } from '$lib/graphql/client';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session_id');

  const isLoginPage = event.route.id?.includes("login");
  const isProtected = event.route.id?.includes('(protected)');

  if (isProtected && !session) {
    throw redirect(303, '/');
  }

  if (isLoginPage && session) {
    throw redirect(303, '/');
  }

  event.locals.urql = createUrqlClient(session);

  return resolve(event);
};
