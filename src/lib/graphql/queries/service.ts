import { createUrqlClient } from "$lib/graphql/client";
import type { OperationResult } from "@urql/core";

export interface Service {
  serviceId: string;
  name: string;
  __typename: string;
}

export interface ServiceDuration extends Service {
  servicePrices: {
    durationId: string;
    price: number;
  }[];
}

export interface ServiceSpecial extends Service {
  price: number;
}

export interface ServiceIVR extends Service {
  initialMessagePrice: number;
}

export interface ServiceNarrative extends Service {
  basePrice: number;
  extraPrice: number;
}

export interface ServiceData {
  services: Service[];
}

export interface ServiceOptions {
  [key: string]: any;
}

export interface CalculateContractInput {
  broadcasterId: number;
  clientId: number;
  services: {
    serviceId: string;
    options: ServiceOptions;
  }[];
}

const SERVICE_QUERY = `
    query services {
        services {
          serviceId,
          name,
          __typename
          ... on ServiceDuration {
            servicePrices {
                durationId
                price
                }
            }
          ... on ServiceSpecial {
                price
            }
          ... on ServiceIVR {
                initialMessagePrice
            }
          ... on ServiceNarrative {
                basePrice
                extraPrice
            }
        }
    }
`;

const CALCULATE_CONTRACT_MUTATION = `
  mutation CalculateContract($input: CalculateContractInput!) {
    calculateContract(input: $input) {
      totalPrice
      servicePrice {
        service {
          name
        }
        price
        totalPriceWithDiscount
      }
    }
  }
`;

export async function fetchServices(): Promise<OperationResult<ServiceData>> {
  return await createUrqlClient().query(SERVICE_QUERY, {}).toPromise();
}

export async function calculateServicePrice(input: CalculateContractInput): Promise<OperationResult<{ totalPrice: number }>> {
  return await createUrqlClient().mutation(CALCULATE_CONTRACT_MUTATION, { input }).toPromise();
}
