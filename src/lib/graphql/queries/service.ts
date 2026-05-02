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

export interface ServiceData {
  services: Service[];
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

export async function fetchServices(): Promise<OperationResult<ServiceData>> {
  return await createUrqlClient().query(SERVICE_QUERY, {}).toPromise();
}
