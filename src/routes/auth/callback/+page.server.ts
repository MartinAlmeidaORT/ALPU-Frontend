import { createUrqlClient } from '$lib/graphql/client';
import { GOOGLE_AUTH_MUTATION } from '$lib/graphql/mutations/auth';
import { UserState } from '$lib/graphql/schema';
import { createUserSession } from '$lib/server/auth/standalone';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }): Promise<void> {
  let requiresRegistration: boolean | null = null;
  let userPending: UserState | null = null;
  let resultData;
  try {
    const code = url.searchParams.get('code');

    if (!code)
      throw new Error('No se encontró codigo de autenticación en la URL');

    const result = await createUrqlClient()
      .mutation(GOOGLE_AUTH_MUTATION, { code })
      .toPromise();

    resultData = result.data.googleAuth;
    requiresRegistration = resultData.requiresRegistration;

    if (requiresRegistration) {
      cookies.set(
        'pending_signup',
        JSON.stringify({
          subject: resultData.subject,
          email: resultData.email,
          firstName: resultData.firstName,
          lastName: resultData.lastName,
        }),
        { path: '/', httpOnly: true, maxAge: 600, sameSite: 'lax' },
      );
    } else {
      userPending = resultData.user.userState;
    }
  } catch (error) {
    console.error('Error procesando Google callback:', error);
  }

  if (requiresRegistration) {
    throw redirect(303, '/login/signup-google');
  }
  if (userPending === UserState.Enabled) {
    createUserSession(cookies, resultData.token);
    throw redirect(303, '/contracts');
  }
  throw redirect(303, '/login?pendingState=true');
}
