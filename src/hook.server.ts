import { createUrqlClient } from '$lib/graphql/client';

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session_id');

  event.locals.urql = createUrqlClient(token);

  return resolve(event);
};
