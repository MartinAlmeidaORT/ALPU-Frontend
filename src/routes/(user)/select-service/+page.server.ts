import { CONTRACT_QUERY } from '$lib/graphql/queries/contracts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const contractIdParam = url.searchParams.get('contractId');

  if (!contractIdParam) {
    return {
      token: locals.token,
      user: locals.user,
      existingContract: null,
    };
  }

  const result = await locals.urql
    .query(
      CONTRACT_QUERY,
      { id: Number(contractIdParam) },
      { requestPolicy: 'network-only' },
    )
    .toPromise();

  const existingContract = result.data?.contracts?.nodes?.[0] ?? null;

  return {
    token: locals.token,
    user: locals.user,
    existingContract,
  };
};
