import {
  CONTRACTS_FILTERED_QUERY,
  CONTRACTS_QUERY,
} from '$lib/graphql/queries/contracts';
import type { PageServerLoad } from './$types.js';
import type { TableContract } from './columns.js';

export async function load({
  locals,
  url,
}: {
  locals: App.Locals;
  url: URL;
}): Promise<PageServerLoad> {
  try {
    const state = url.searchParams.get('state') || undefined;
    const after = url.searchParams.get('after') || null;
    let result;
    if (state) {
      result = await locals.urql
        .query(
          CONTRACTS_FILTERED_QUERY,
          { first: 15, after, state: state },
          { requestPolicy: 'network-only' },
        )
        .toPromise();
    } else {
      result = await locals.urql
        .query(
          CONTRACTS_QUERY,
          { first: 15, after },
          { requestPolicy: 'network-only' },
        )
        .toPromise();
    }

    if (result.error) {
      return {
        token: locals.token,
        contracts: [],
        error: `GraphQL Error: ${result.error.message}`,
      };
    }

    if (!result.data) {
      return {
        token: locals.token,
        contracts: [],
        error: 'No data returned from GraphQL',
      };
    }

    const contracts = (result.data?.contracts?.nodes || []) as TableContract[];

    return {
      token: locals.token,
      contracts,
      pageInfo: result.data?.contracts?.pageInfo,
      totalCount: result.data?.contracts?.totalCount || 0,
    };
  } catch (error) {
    return {
      token: locals.token,
      contracts: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
