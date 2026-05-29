import { graphql } from '../types';

export const CONTRACTS_QUERY = graphql(`
  query contracts($first: Int, $after: String) {
    contracts(first: $first, after: $after, order: [{ contractId: DESC }]) {
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

export const CONTRACTS_FILTERED_QUERY = graphql(`
  query contractsFiltered($first: Int, $after: String, $state: ContractState!) {
    contracts(
      first: $first
      after: $after
      where: { state: { eq: $state } }
      order: [{ contractId: DESC }]
    ) {
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

export const CANCEL_CONTRACT_QUERY = graphql(`
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

export const APPROVE_CONTRACT_QUERY = graphql(`
  mutation ApproveContract($contractId: Int!) {
    approveContract(contractId: $contractId) {
      clientApproved
      broadcasterApproved
      state
    }
  }
`);

export const GET_CONTRACT_URL_QUERY = graphql(`
  query ContractPdfDownloadUrl($contractId: Int!) {
    contractPdfDownloadUrl(contractId: $contractId) {
      pdfAmazonS3Url
    }
  }
`);

export const GENERATE_CONTRACT_MUTATION = graphql(`
  mutation GenerateContract($input: CampaignInput!) {
    generateContract(input: $input) {
      contract {
        client {
          firstName
          lastName
        }
        contractId
      }
      pdfAmazonS3Url
    }
  }
`);
