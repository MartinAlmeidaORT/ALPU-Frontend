import { client } from "$lib/graphql/client";

const COUNTRY_QUERY = `
    query countries {
        countries {
          code,
          name
        }
    }
`;

export async function fetchCountries() {
  const { data } = await client.query(COUNTRY_QUERY, {});
  return data.countries;
}
