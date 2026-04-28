import { fail, redirect } from "@sveltejs/kit";
import { client } from "$lib/graphql/client";
import { LOGIN_MUTATION } from "$lib/graphql/mutations/auth";

export const actions = {
  default: async ({ request, cookies }) => {

    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);

      const result = await client.mutation(LOGIN_MUTATION, {
        input: data,
      }).toPromise();

      // Handle GraphQL-specific errors
      if (result.error) {
        return fail(400, {
          message: result.error?.message || "Invalid email or password"
        });
      }

      cookies.set('session_id', result.data?.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
      });

      throw redirect(302, '/contracts');
    }
    catch (err) {
      // if (err.status === 302) throw err; // Allow redirects to work
      return fail(500, { message: "An unexpected error occurred" });
    }

  }
};
