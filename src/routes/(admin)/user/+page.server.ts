import { USERS_FILTERED_QUERY, USERS_QUERY} from '$lib/graphql/queries/user';
import { UserState } from '$lib/graphql/schema.js';
import type { TableUser } from './columns.js';

export async function load({ locals, url }: { locals: App.Locals; url: URL }) {
  try {
    const state = url.searchParams.get('state') || undefined;
    const after = url.searchParams.get('after') || null;
    let result;

    if (state && state !== 'ALL') {
      result = await locals.urql
      .query(
        USERS_FILTERED_QUERY,
        { first: 15, after, state},
        { requestPolicy: 'network-only' },
      )
      .toPromise();
    } else {
      result = await locals.urql
        .query(
          USERS_QUERY,
          { first: 15, after },
          { requestPolicy: 'network-only' },
        )
        .toPromise();
    }
      
    if (result.error) {
      return {
        token: locals.token,
        users: [],
        error: `GraphQL Error: ${result.error.message}`,
      };
    }

    if (!result.data) {
      return {
        token: locals.token,
        users: [],
        error: 'No data returned from GraphQL',
      };
    }

    const users = (result.data?.users?.nodes || []) as TableUser[];
    return {
      token: locals.token,
      users,
      pageInfo: result.data?.users?.pageInfo,
      totalCount: result.data?.users?.totalCount || 0,
    };
  } catch (error) {
    return {
      token: locals.token,
      users: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
