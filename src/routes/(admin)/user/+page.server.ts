import { USERS_FILTERED_QUERY } from '$lib/graphql/queries/user';
import type { TableUser } from './columns.js';

export async function load({ locals }: { locals: App.Locals }) {
  try {
    const result = await locals.urql
      .query(
        USERS_FILTERED_QUERY,
        { state: 'PENDING' },
        { requestPolicy: 'network-only' },
      )
      .toPromise();

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

    const users = (result.data?.users || []) as TableUser[];
    return {
      token: locals.token,
      users,
    };
  } catch (error) {
    return {
      token: locals.token,
      users: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
