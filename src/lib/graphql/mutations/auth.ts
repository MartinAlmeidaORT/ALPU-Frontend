import { createUrqlClient } from "$lib/graphql/client";

export const REGISTER_BROADCASTER_MUTATION = `
    mutation registerBroadcaster($input: RegisterBroadcasterInput!) {
        registerBroadcaster(input: $input) {
          token,
          user {
            email,
            firstName,
            lastName,
            rut,
            address {
              country {
                countryCode,
                name
              },
              state,
              city,
              street
            }
          }
        }
    }
`;

export async function RegisterBroadcaster() {
  const { data } = await createUrqlClient().mutation(REGISTER_BROADCASTER_MUTATION, {});
  return data.completeGoogleBroadcasterRegistration;
}

export const REGISTER_CLIENT_MUTATION = `
    mutation REGISTER_CLIENT_MUTATION($input: RegisterClientInput!) {
        registerClient(input: $input) {
          token,
          user {
            email,
            firstName,
            lastName,
            rut,
            address {
              country {
                countryCode,
                name
              },
              state,
              city,
              street,
            },
            ... on Client {
              agency {
                name
              }
            }
          }
        }
    }
`;

export async function RegisterClient() {
  const { data } = await createUrqlClient().mutation(REGISTER_CLIENT_MUTATION, {});
  return data.completeGoogleBroadcasterRegistration;
}

interface GoogleAuthInput {
  code: string;
}

interface GoogleAuthResponse {
  token: string;
  requiresRegistration: boolean;
  email: string;
  firstName: string;
  lastName: string;
}

export const GOOGLE_AUTH_MUTATION = `
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
`;

export async function googleAuth(code: string) {
  const { data } = await createUrqlClient().mutation(GOOGLE_AUTH_MUTATION, { code });
  return data;
}

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
  };
}

export const LOGIN_MUTATION = `
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
`;

export async function login({ email, password }: LoginInput): Promise<LoginResponse> {
  const { data } = await createUrqlClient().mutation(LOGIN_MUTATION, { input: { email, password } }).toPromise();
  return data;
}

export const COMPLETE_GOOGLE_SIGNUP_BROADCASTER_MUTATION = `
    mutation completeGoogleSignUpBroadcaster($input: CompleteGoogleSignUpBroadcasterInput!) {
        completeGoogleSignUpBroadcaster(input: $input) {
          token,
          user {
            email,
            firstName,
            lastName,
            rut,
            address {
              country {
                countryCode,
                name
              }
              street,
              city,
              state,
            }
          }
        }
    }
`;

export async function CompleteGoogleSignUpBroadcaster() {
  const { data } = await createUrqlClient().mutation(
    COMPLETE_GOOGLE_SIGNUP_BROADCASTER_MUTATION,
    {},
  );
  return data.completeGoogleBroadcasterRegistration;
}

export const COMPLETE_GOOGLE_SIGNUP_CLIENT_MUTATION = `
    mutation completeGoogleSignUpClient($input: CompleteGoogleSignUpClientInput!) {
        completeGoogleSignUpClient(input: $input) {
          token,
          user {
            email,
            firstName,
            lastName,
            rut,
            address {
              country {
                countryCode,
                name
              },
              street,
              city,
              state,
            },
            ... on Client {
              agency {
                name
              }
            }
          }
        }
    }
`;

export async function CompleteGoogleSignUpClient() {
  const { data } = await createUrqlClient().mutation(
    COMPLETE_GOOGLE_SIGNUP_CLIENT_MUTATION,
    {},
  );
  return data.completeGoogleSignUpClient;
}
