import { fetchContracts } from '$lib/graphql/queries/contracts';
import type { TableContract } from './columns';

export async function load() {
  try {
    const result = await fetchContracts(10);
    
    
    if (result.error) {
      return {
        contracts: [],
        error: `GraphQL Error: ${result.error.message}`
      };
    }
    
    if (!result.data) {
      return {
        contracts: [],
        error: 'No data returned from GraphQL'
      };
    }
    
    const contracts = (result.data?.contracts?.nodes || []) as TableContract[];
    
    return {
      contracts,
      totalCount: result.data?.contracts?.totalCount || 0
    };
  } catch (error) {
    return {
      contracts: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}