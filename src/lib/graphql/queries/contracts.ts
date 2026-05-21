import { graphql } from '../types';

export const CONTRACTS_QUERY = graphql(`
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

export const UPDATE_CONTRACT_QUERY = graphql(`
  mutation UpdateContractState($input: UpdateContractStateInput!) {
    updateContractState(input: $input) {
      contractId
      state
      broadcaster {
        firstName
        lastName
      }
      client {
        firstName
        lastName
      }
    }
  }
`);
