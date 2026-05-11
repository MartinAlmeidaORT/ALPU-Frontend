import { createUrqlClient } from '$lib/graphql/client';
import { GOOGLE_AUTH_MUTATION } from '$lib/graphql/mutations/auth';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }) {
  let requiresRegistration: boolean | null = null;
  try {
    const code = url.searchParams.get('code');

    if (!code) throw new Error('No authorization code found');

    const result = await createUrqlClient()
      .mutation(GOOGLE_AUTH_MUTATION, { code })
      .toPromise();

    const resultData = result.data.googleAuth;

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
        { path: '/', httpOnly: true, maxAge: 600 },
      );
    }

    cookies.set('session_id', resultData.token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });
  } catch (error) {
    console.error('Error procesando Google callback:', error);
  }

  if (requiresRegistration) {
    redirect(303, '/login/signup-google');
  }
  redirect(303, '/contracts');
}
