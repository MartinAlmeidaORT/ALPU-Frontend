import { BROADCASTERS_PAGED_QUERY } from '$lib/graphql/queries/user';

export async function load({ locals, url }: { locals: App.Locals; url: URL }) {
  try {
    const after = url.searchParams.get('after') || null;
    let result;

    result = await locals.urql
      .query(
        BROADCASTERS_PAGED_QUERY,
        { first: 15, after },
        { requestPolicy: 'network-only' },
      )
      .toPromise();
    if (result.error) {
      return {
        token: locals.token,
        broadcasters: [],
        error: `GraphQL Error: ${result.error.message}`,
      };
    }
    if (!result.data) {
      return {
        token: locals.token,
        broadcasters: [],
        error: 'No se recibieron datos de locutores',
      };
    }

    const broadcasters = result.data?.broadcastersPaged?.nodes || [];
    return {
      token: locals.token,
      broadcasters: broadcasters,
      pageInfo: result.data?.broadcastersPaged?.pageInfo,
      totalCount: result.data?.broadcastersPaged?.totalCount || 0,
    };
  } catch (error) {
    return {
      token: locals.token,
      users: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
