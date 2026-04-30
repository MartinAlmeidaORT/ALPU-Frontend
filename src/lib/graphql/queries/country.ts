import { createUrqlClient } from "$lib/graphql/client";
import type { OperationResult } from "@urql/core";

export interface Country {
  countryCode: string;
  name: string;
}

export interface CountryData {
  countries: Country[];
}

const COUNTRY_QUERY = `
    query countries {
        countries {
          countryCode,
          name
        }
    }
`;

export async function fetchCountries(): Promise<OperationResult<CountryData>> {
  return await createUrqlClient().query(COUNTRY_QUERY, {}).toPromise();
}
