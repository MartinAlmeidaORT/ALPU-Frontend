import { fail, redirect } from "@sveltejs/kit";
import { LOGIN_MUTATION } from "$lib/graphql/mutations/auth";
import { createUrqlClient } from "$lib/graphql/client.js";

export const actions = {
  default: async ({ request, cookies, locals }) => {

    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);

      const result = await createUrqlClient().mutation(LOGIN_MUTATION, {
        input: data,
      }).toPromise();

      const resultData = result.data?.login;

      // Handle GraphQL-specific errors
      if (result.error) {
        return fail(400, {
          messages: result.error.graphQLErrors?.map((e) => e.message) || ["Invalid email or password"]
        });
      }

      const token = resultData.token;

      if (!token) {
        return fail(500, { messages: ["No token received"] });
      }

      cookies.set('session_id', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
      });
    }
    catch (err) {
      return fail(500, { messages: ["An unexpected error occurred"] });
    }

    throw redirect(302, '/contracts');
  }
};
