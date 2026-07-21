import { BROADCASTER_QUERY } from "$lib/graphql/queries/user";

export async function load({ locals, url }: { locals: App.Locals; url: URL }) {
  try {
    let result;

    result = await locals.urql
      .query(
        BROADCASTER_QUERY,
        { email: locals.user?.email },
        { requestPolicy: 'network-only' },
      )
      .toPromise();
    if (result.error) {
      return {
        token: locals.token,
        broadcaster: null,
        error: `GraphQL Error: ${result.error.message}`,
      };
    }
    if (!result.data) {
      return {
        token: locals.token,
        broadcaster: null,
        error: 'No se encontró el locutor con el email proporcionado',
      };
    }
    const broadcaster = result.data.broadcasters?.[0] || null;
    return {
      token: locals.token,
      broadcaster: broadcaster
    };
  } catch (error) {
    return {
      token: locals.token,
      broadcaster: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
