import { createUrqlClient } from '$lib/graphql/client';
import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export function createUserSession(cookies: Cookies, token: string): void {
  cookies.set('session_id', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });
}

export function removeUserSession(cookies: Cookies, locals: App.Locals): void {
  cookies.delete('session_id', { path: '/' });
  locals.user = null;
  locals.token = null;
}

export function decodeToken(token: string, locals: App.Locals): void {
  if (token) {
    try {
      const decodedUser = jwt.decode(token);
      locals.user = {
        id: Number(decodedUser.sub),
        email: decodedUser.email,
        firstName: decodedUser.first_name,
        lastName: decodedUser.last_name,
        state: decodedUser.account_state,
        role: decodedUser.account_role,
      };
      locals.token = token;
      locals.urql = createUrqlClient(token);
    } catch (error) {
      clearLocals(locals);
    }
  }
}

export function clearLocals(locals: App.Locals): void {
  locals.user = null;
  locals.token = null;
  locals.urql = createUrqlClient();
}
