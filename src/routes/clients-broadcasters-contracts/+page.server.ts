    import { createUrqlClient } from '$lib/graphql/client';
import { CONTRACTS_QUERY, UPDATE_CONTRACT_QUERY } from '$lib/graphql/queries/contracts';
    import type { TableContract } from '../clients-broadcasters-contracts/columns';


export async function load({ locals } : { locals: App.Locals }) {
  try {

    const result = await locals.urql.query(CONTRACTS_QUERY, { first: 10 }).toPromise();
    
    if (result.error) {
      return {
        token: locals.token,
        contracts: [],
        error: `GraphQL Error: ${result.error.message}`
      };
    }
    
    if (!result.data) {
      return {
        token: locals.token,
        contracts: [],
        error: 'No data returned from GraphQL'
      };
    }
    
    const contracts = (result.data?.contracts?.nodes || []) as TableContract[];
    
    return {
      token: locals.token,
      contracts,
      totalCount: result.data?.contracts?.totalCount || 0
    };
  } catch (error) {
    return {
      token: locals.token,
      contracts: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}