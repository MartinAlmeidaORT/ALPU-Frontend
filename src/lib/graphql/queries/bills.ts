import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { BillsQuery } from '../types/graphql';

export const BILLS_QUERY = graphql(`
  query bills ($first: Int, $after: String) {
    bills(first: $first, after: $after) {
      nodes {
        billId
        title
        date
        amount
        description
        contract {
          contractId
        }          
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

export const GENERATE_BILL_MUTATION = graphql(`
  mutation registerBill($input: BillInput!) {
    registerBill(input: $input) {
      amazonS3Url
    }
  }
`);

export const DELETE_BILL_MUTATION = graphql(`
  mutation deleteBill($billId: Int!) {
    deleteBill(billId: $billId) {
      title
    }
  }
`);

export const GET_BILL_URL_QUERY = graphql(`
  query BillProofDownloadUrl($billId: Int!) {
    billProofDownloadUrl(billId: $billId) {
      amazonS3Url
    }
  }
`);

export async function fetchBills(): Promise<OperationResult<BillsQuery>> {
  return await createUrqlClient().query(BILLS_QUERY, {}).toPromise();
}
