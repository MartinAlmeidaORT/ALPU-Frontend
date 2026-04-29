import { fail, redirect } from "@sveltejs/kit";
import { LOGIN_MUTATION } from "$lib/graphql/mutations/auth";

export const actions = {
  default: async ({ request, cookies, locals }) => {

    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);

      const result = await locals.urql.mutation(LOGIN_MUTATION, {
        input: data,
      }).toPromise();

      // Handle GraphQL-specific errors
      if (result.error) {
        return fail(400, {
          message: result.error?.message || "Invalid email or password"
        });
      }

      const token = result.data?.token;

      if (!token) {
        return fail(500, { message: "No token received" });
      }

      cookies.set('session_id', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
      });
    }
    catch (err) {
      return fail(500, { message: "An unexpected error occurred" });
    }

    throw redirect(302, '/contracts');
  }
};
