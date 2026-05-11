import { createUrqlClient } from '$lib/graphql/client';
import type { OperationResult } from '@urql/core';
import type { UserLoginInput } from '../schema';
import { graphql } from '../types';
import type {
  CompleteGoogleSignUpBroadcasterMutation,
  CompleteGoogleSignUpClientMutation,
  GoogleAuthMutation,
  LoginMutation,
} from '../types/graphql';

export const SIGNUP_BROADCASTER_MUTATION = graphql(`
  mutation registerBroadcaster($input: RegisterBroadcasterInput!) {
    registerBroadcaster(input: $input) {
      token
      user {
        email
        firstName
        lastName
        rut
        address {
          country {
            countryCode
            name
          }
          department {
            departmentId
            name
          }
          city
          street
        }
      }
    }
  }
`);

export const SIGNUP_CLIENT_MUTATION = graphql(`
  mutation registerClient($input: RegisterClientInput!) {
    registerClient(input: $input) {
      token
      user {
        email
        firstName
        lastName
        rut
        address {
          country {
            countryCode
            name
          }
          department {
            departmentId
            name
          }
          city
          street
        }
        ... on Client {
          agency {
            name
          }
        }
      }
    }
  }
`);

export const GOOGLE_AUTH_MUTATION = graphql(`
  mutation googleAuth($code: String!) {
    googleAuth(input: { code: $code }) {
      token
      requiresRegistration
      subject
      email
      firstName
      lastName
    }
  }
`);

export async function googleAuth(
  code: string,
): Promise<OperationResult<GoogleAuthMutation>> {
  return createUrqlClient().mutation(GOOGLE_AUTH_MUTATION, { code });
}

export const LOGIN_MUTATION = graphql(`
  mutation login($input: UserLoginInput!) {
    login(input: $input) {
      token
      user {
        userId
        email
        firstName
        lastName
        __typename
      }
    }
  }
`);

export async function login({
  email,
  password,
}: UserLoginInput): Promise<OperationResult<LoginMutation>> {
  return await createUrqlClient()
    .mutation(LOGIN_MUTATION, { input: { email, password } })
    .toPromise();
}

export const COMPLETE_GOOGLE_SIGNUP_BROADCASTER_MUTATION = graphql(`
  mutation completeGoogleSignUpBroadcaster(
    $input: CompleteGoogleSignUpBroadcasterInput!
  ) {
    completeGoogleSignUpBroadcaster(input: $input) {
      token
      user {
        email
        firstName
        lastName
        rut
        address {
          country {
            countryCode
            name
          }
          department {
            departmentId
            name
          }
          street
          city
        }
      }
    }
  }
`);

export async function CompleteGoogleSignUpBroadcaster(): Promise<
  OperationResult<CompleteGoogleSignUpBroadcasterMutation>
> {
  return await createUrqlClient().mutation(
    COMPLETE_GOOGLE_SIGNUP_BROADCASTER_MUTATION,
    {},
  );
}

export const COMPLETE_GOOGLE_SIGNUP_CLIENT_MUTATION = graphql(`
  mutation completeGoogleSignUpClient(
    $input: CompleteGoogleSignUpClientInput!
  ) {
    completeGoogleSignUpClient(input: $input) {
      token
      user {
        email
        firstName
        lastName
        rut
        address {
          country {
            countryCode
            name
          }
          department {
            departmentId
            name
          }
          street
          city
        }
        ... on Client {
          agency {
            name
          }
        }
      }
    }
  }
`);

export async function CompleteGoogleSignUpClient(): Promise<
  OperationResult<CompleteGoogleSignUpClientMutation>
> {
  return await createUrqlClient().mutation(
    COMPLETE_GOOGLE_SIGNUP_CLIENT_MUTATION,
    {},
  );
}
