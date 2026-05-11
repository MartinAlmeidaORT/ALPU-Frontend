import type { OperationResult } from "@urql/core";
import type { CountriesQuery } from "../types/graphql";
import { graphql } from "../types";
import { createUrqlClient } from "$lib/graphql/client";

const COUNTRY_QUERY = graphql(`
    query countries {
        countries {
          countryCode
          name
        }
    }
`);

export async function fetchCountries(): Promise<OperationResult<CountriesQuery>> {
  return await createUrqlClient().query(COUNTRY_QUERY, {}).toPromise();
}
