import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { BroadcastersQuery, ClientsQuery } from '../types/graphql';

const CLIENT_QUERY = graphql(`
  query clients($firstName: String!, $lastName: String!) {
    clients(
      where: { firstName: { eq: $firstName }, lastName: { eq: $lastName } }
    ) {
      userId
      firstName
      lastName
    }
  }
`);

const BROADCASTER_QUERY = graphql(`
  query broadcasters($firstName: String!, $lastName: String!) {
    broadcasters(
      where: { firstName: { eq: $firstName }, lastName: { eq: $lastName } }
    ) {
      userId
      firstName
      lastName
    }
  }
`);

export async function fetchClient(input: {
  firstName: string;
  lastName: string;
}): Promise<OperationResult<ClientsQuery>> {
  return await createUrqlClient()
    .query(CLIENT_QUERY, {
      firstName: input.firstName,
      lastName: input.lastName,
    })
    .toPromise();
}

export async function fetchBroadcaster(input: {
  firstName: string;
  lastName: string;
}): Promise<OperationResult<BroadcastersQuery>> {
  return await createUrqlClient()
    .query(BROADCASTER_QUERY, {
      firstName: input.firstName,
      lastName: input.lastName,
    })
    .toPromise();
}
