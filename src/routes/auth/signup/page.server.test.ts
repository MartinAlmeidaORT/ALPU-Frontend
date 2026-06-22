import {
  SIGNUP_BROADCASTER_MUTATION,
  SIGNUP_CLIENT_MUTATION,
} from '$lib/graphql/mutations/auth';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { actions } from './+page.server';

const { createUrqlClientMock, mutationMock, toPromiseMock } = vi.hoisted(() => {
  const toPromiseMock = vi.fn();
  const mutationMock = vi.fn(() => ({ toPromise: toPromiseMock }));
  const createUrqlClientMock = vi.fn(() => ({ mutation: mutationMock }));

  return { createUrqlClientMock, mutationMock, toPromiseMock };
});

vi.mock('$lib/graphql/client.js', () => ({
  createUrqlClient: createUrqlClientMock,
}));

const createSignupEvent = (overrides: Record<string, string> = {}) => {
  const formData = new FormData();
  const fields = {
    accountType: 'client',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    password: 'super-secret',
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
    request: new Request('http://localhost/auth/signup', {
      method: 'POST',
      body: formData,
    }),
    cookies: {
      set: vi.fn(),
    },
  };
};

const createSignupResult = (dataKey: 'registerClient' | 'registerBroadcaster', token = 'token') => ({
  data: {
    [dataKey]: {
      token,
      user: {
        userId: 'user-1',
        email: 'ada@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
      },
    },
  },
});

describe('/auth/signup action', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('registers a client and redirects to pending login', async () => {
    const event = createSignupEvent();
    toPromiseMock.mockResolvedValue(createSignupResult('registerClient'));

    await expect(actions.default(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login?pendingState=true',
    });

    expect(createUrqlClientMock).toHaveBeenCalledOnce();
    expect(mutationMock).toHaveBeenCalledWith(SIGNUP_CLIENT_MUTATION, {
      input: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'super-secret',
        rut: '123456789012',
        agencyName: 'Analytical Engines',
        city: 'Montevideo',
        departmentId: 1,
        street: 'Main Street',
        countryCode: 'UY',
      },
    });
  });

  it('registers a broadcaster and redirects to pending login', async () => {
    const event = createSignupEvent({
      accountType: 'broadcaster',
      agencyName: '',
    });
    toPromiseMock.mockResolvedValue(createSignupResult('registerBroadcaster'));

    await expect(actions.default(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login?pendingState=true',
    });

    expect(mutationMock).toHaveBeenCalledWith(SIGNUP_BROADCASTER_MUTATION, {
      input: expect.objectContaining({
        firstName: 'Ada',
        departmentId: 1,
      }),
    });
  });

  it('returns a 400 failure when the account type is invalid', async () => {
    const event = createSignupEvent({ accountType: 'unknown' });

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
    const event = createSignupEvent();
    toPromiseMock.mockResolvedValue({
      data: null,
      error: {
        graphQLErrors: [{ message: 'Email ya registrado' }],
      },
    });

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 400,
      data: { messages: ['Email ya registrado'] },
    });
  });

  it('returns a generic 400 failure for non-graphQL urql errors', async () => {
    const event = createSignupEvent();
    toPromiseMock.mockResolvedValue({
      data: null,
      error: {
        graphQLErrors: [],
      },
    });

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 400,
      data: { messages: ['Ocurrió un error inesperado. Inténtalo de nuevo.'] },
    });
  });

  it('returns a 500 failure when the API does not send a token', async () => {
    const event = createSignupEvent();
    toPromiseMock.mockResolvedValue(createSignupResult('registerClient', ''));

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 500,
      data: {
        data: null,
        messages: ['Token no recibido'],
      },
    });
  });

  it('returns a 500 failure when the request cannot be completed', async () => {
    const event = createSignupEvent();
    toPromiseMock.mockRejectedValue(new Error('network down'));

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 500,
      data: {
        data: null,
        messages: ['Ocurrió un error inesperado. Inténtalo de nuevo.'],
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });
});
