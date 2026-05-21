import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { CampaignInput, Service } from '../schema';
import type { CalculateContractQuery, ServicesQuery } from '../types/graphql';


const SERVICE_QUERY = graphql(`
  query services {
    services {
      type
      name
      serviceId
      basePrice
      extraPrice
      firstExtraPrice
      __typename
      ... on ServiceNarrative {
        rolePrice
      }
      ... on ServiceIvr {
        additionalMessagePrice
      }
      ... on ServicePeriod {
        periods(order: { basePrice: ASC}) 
        {
          basePrice
          extraPrice
          firstExtraPrice
          interval
        }
      }
    }
  }
`);

const CALCULATE_CONTRACT_MUTATION = graphql(`
  query CalculateContract($input: CampaignInput!) {
    calculateContract(input: $input) {
      total
      beforeDiscount
      adjustments {
        name
        key
        type
        amount
        applyDiscount
      }
      services {
        pieces {
          name
          price
        }
        serviceName
        basePrice
        subsequentPrice
        adjustments {
          name
          key
          type
          amount
          applyDiscount
        }
        subTotal
        beforeDiscount
      }
    }
  }
`);

export async function fetchServices(): Promise<OperationResult<ServicesQuery>> {
  return await createUrqlClient().query(SERVICE_QUERY, {}).toPromise();
}

export async function calculateServicePrice(
  input: CampaignInput,
): Promise<OperationResult<CalculateContractQuery>> {
  return await createUrqlClient()
    .query(CALCULATE_CONTRACT_MUTATION, { input })
    .toPromise();
}
