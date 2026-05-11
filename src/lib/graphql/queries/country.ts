import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { CountriesQuery } from '../types/graphql';

const COUNTRY_QUERY = graphql(`
  query countries {
    countries {
      countryCode
      name
    }
  }
`);

export async function fetchCountries(): Promise<
  OperationResult<CountriesQuery>
> {
  return await createUrqlClient().query(COUNTRY_QUERY, {}).toPromise();
}
