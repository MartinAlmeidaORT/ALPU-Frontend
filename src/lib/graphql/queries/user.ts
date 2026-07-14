import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import { graphql } from '../types';
import type { BroadcastersQuery, ClientsQuery } from '../types/graphql';

const CLIENT_QUERY = graphql(`
  query clients($email: String!) {
    clients(where: { email: { eq: $email }, userState: { eq: ENABLED } }) {
      userId
      firstName
      lastName
      email
    }
  }
`);

const AGENCY_QUERY = graphql(`
  query agencies($agency: String!) {
    clients(
      where: { agency: { name: { eq: $agency } }, userState: { eq: ENABLED } }
    ) {
      userId
      firstName
      lastName
      email
    }
  }
`);

const BROADCASTER_QUERY = graphql(`
  query broadcasters($email: String!) {
    broadcasters(where: { email: { eq: $email }, userState: { eq: ENABLED } }) {
      userId
      firstName
      lastName
      email
      photo
    }
  }
`);

export const BROADCASTERS_QUERY = graphql(`
  query broadcasters($first: Int, $after: String) {
    broadcasters(first: $first, after: $after, where: { userState: { eq: ENABLED } }) {
      userId
      firstName
      lastName
      email
      photo
      skills {
        skillId
        name
      }
      languages {
        languageId
        name
      }
    }
  }
`);

export const USERS_FILTERED_QUERY = graphql(`
  query usersFiltered($first: Int, $after: String, $state: UserState!) {
    users(
      first: $first
      after: $after
      where: { userState: { eq: $state } }
      order: [{ userId: ASC }]
    ) {
      nodes {
        userId
        firstName
        lastName
        email
        rut
        userState
        __typename
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

export const USERS_QUERY = graphql(`
  query users($first: Int, $after: String) {
    users(first: $first, after: $after, order: [{ userId: ASC }]) {
      nodes {
        userId
        firstName
        lastName
        email
        rut
        userState
        __typename
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

export const APPROVE_USER_MUTATION = graphql(`
  mutation approveUser($input: UpdateUserStateInput!) {
    approveUser(input: $input) {
      userId
      userState
    }
  }
`);

export async function fetchClient(input: {
  email: string;
}): Promise<OperationResult<ClientsQuery>> {
  return await createUrqlClient()
    .query(CLIENT_QUERY, {
      email: input.email,
    })
    .toPromise();
}

export async function fetchBroadcaster(input: {
  email: string;
}): Promise<OperationResult<BroadcastersQuery>> {
  return await createUrqlClient()
    .query(BROADCASTER_QUERY, {
      email: input.email,
    })
    .toPromise();
}

export async function fetchAgency(input: {
  agency: string;
}): Promise<OperationResult<ClientsQuery>> {
  return await createUrqlClient()
    .query(AGENCY_QUERY, {
      agency: input.agency,
    })
    .toPromise();
}
