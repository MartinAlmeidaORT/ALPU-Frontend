import {
  COMPLETE_GOOGLE_SIGNUP_BROADCASTER_MUTATION,
  COMPLETE_GOOGLE_SIGNUP_CLIENT_MUTATION,
} from '$lib/graphql/mutations/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { actions, load } from './+page.server';

const { createUrqlClientMock, mutationMock, toPromiseMock } = vi.hoisted(() => {
  const toPromiseMock = vi.fn();
  const mutationMock = vi.fn(() => ({ toPromise: toPromiseMock }));
  const createUrqlClientMock = vi.fn(() => ({ mutation: mutationMock }));

  return { createUrqlClientMock, mutationMock, toPromiseMock };
});

vi.mock('$lib/graphql/client', () => ({
  createUrqlClient: createUrqlClientMock,
}));

const pendingSignup = {
  subject: 'google-subject',
  email: 'ada@example.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
};

const createCookies = (
  pendingValue: string | null = JSON.stringify(pendingSignup),
) => ({
  get: vi.fn((name: string) =>
    name === 'pending_signup' ? (pendingValue ?? undefined) : undefined,
  ),
  delete: vi.fn(),
});

const createSignupGoogleEvent = (overrides: Record<string, string> = {}) => {
  const formData = new FormData();
  const fields = {
    accountType: 'client',
    firstName: 'Ada',
    lastName: 'Lovelace',
    rut: '123456789012',
    agencyName: 'Analytical Engines',
    city: 'Montevideo',
    departmentId: '1',
    street: 'Main Street',
    countryCode: 'UY',
    ...overrides,
  };

  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }

  return {
    request: new Request('http://localhost/login/signup-google', {
      method: 'POST',
      body: formData,
    }),
    cookies: createCookies(),
  };
};

const createGoogleSignupResult = (
  dataKey: 'completeGoogleSignUpClient' | 'completeGoogleSignUpBroadcaster',
  token = 'token',
) => ({
  data: {
    [dataKey]: {
      token,
      user: {
        email: 'ada@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
      },
    },
  },
});

describe('/login/signup-google load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login when pending signup cookie is missing', async () => {
    await expect(
      load({ cookies: createCookies(null) } as never),
    ).rejects.toMatchObject({
      status: 302,
      location: '/login',
    });
  });

  it('returns pending signup data from the cookie', async () => {
    await expect(load({ cookies: createCookies() } as never)).resolves.toEqual({
      pendingData: pendingSignup,
    });
  });
});

describe('/login/signup-google action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes a Google client signup and clears pending signup', async () => {
    const event = createSignupGoogleEvent();
    toPromiseMock.mockResolvedValue(
      createGoogleSignupResult('completeGoogleSignUpClient'),
    );

    await expect(actions.default(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login?pendingState=true',
    });

    expect(mutationMock).toHaveBeenCalledWith(
      COMPLETE_GOOGLE_SIGNUP_CLIENT_MUTATION,
      {
        input: {
          subject: 'google-subject',
          email: 'ada@example.com',
          firstName: 'Ada',
          lastName: 'Lovelace',
          rut: '123456789012',
          agencyName: 'Analytical Engines',
          city: 'Montevideo',
          departmentId: 1,
          street: 'Main Street',
          countryCode: 'UY',
        },
      },
    );
    expect(event.cookies.delete).toHaveBeenCalledWith('pending_signup', {
      path: '/',
    });
  });

  it('completes a Google broadcaster signup', async () => {
    const event = createSignupGoogleEvent({
      accountType: 'broadcaster',
      agencyName: '',
    });
    toPromiseMock.mockResolvedValue(
      createGoogleSignupResult('completeGoogleSignUpBroadcaster'),
    );

    await expect(actions.default(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login?pendingState=true',
    });

    expect(mutationMock).toHaveBeenCalledWith(
      COMPLETE_GOOGLE_SIGNUP_BROADCASTER_MUTATION,
      {
        input: expect.objectContaining({
          subject: 'google-subject',
          email: 'ada@example.com',
          departmentId: 1,
        }),
      },
    );
  });

  it('returns a 400 failure when the account type is invalid', async () => {
    const event = createSignupGoogleEvent({ accountType: 'unknown' });

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 400,
      data: {
        data: null,
        messages: ['Cuenta no válida'],
      },
    });
    expect(createUrqlClientMock).not.toHaveBeenCalled();
  });

  it('returns graphQL error messages as a 400 failure', async () => {
    const event = createSignupGoogleEvent();
    toPromiseMock.mockResolvedValue({
      data: null,
      error: {
        graphQLErrors: [{ message: 'RUT inválido' }],
      },
    });

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 400,
      data: {
        data: null,
        messages: ['RUT inválido'],
      },
    });
  });

  it('returns a 500 failure when the API does not send a token', async () => {
    const event = createSignupGoogleEvent();
    toPromiseMock.mockResolvedValue(
      createGoogleSignupResult('completeGoogleSignUpClient', ''),
    );

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 500,
      data: {
        data: null,
        messages: ['Token no recibido'],
      },
    });
    expect(event.cookies.delete).not.toHaveBeenCalled();
  });

  it('returns a 500 failure when the request cannot be completed', async () => {
    const event = createSignupGoogleEvent();
    toPromiseMock.mockRejectedValue(new Error('network down'));

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 500,
      data: {
        data: null,
        messages: ['Ocurrió un error inesperado. Inténtalo de nuevo.'],
      },
    });
  });
});
