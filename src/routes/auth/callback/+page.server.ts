import { createUrqlClient } from '$lib/graphql/client';
import { GOOGLE_AUTH_MUTATION } from '$lib/graphql/mutations/auth';
import { UserState } from '$lib/graphql/schema';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }) {
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
    cookies.set('session_id', JSON.stringify(resultData), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });
    throw redirect(303, '/contracts');
  }
  throw redirect(303, '/login?pendingState=true');
}
