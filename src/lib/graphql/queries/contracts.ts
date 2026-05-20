import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { ContractsQuery } from '../types/graphql';

const CONTRACTS_QUERY = graphql(`
  query contracts($first: Int, $after: String) {
    contracts(first: $first, after: $after) {
      nodes {
        contractId
        broadcaster {
          firstName
          lastName
        }
        client {
          firstName
          lastName
          agency {
            name
          }
        }
        state
        date
        dueDate
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`);

export async function fetchContracts(
  first: number = 3,
  after?: string,
): Promise<OperationResult<ContractsQuery>> {
  return await createUrqlClient()
    .query(CONTRACTS_QUERY, { first, after })
    .toPromise();
}
