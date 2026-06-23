import { UserState } from '$lib/graphql/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

const createLoginEvent = () => {
  const formData = new FormData();
  formData.set('email', 'user@example.com');
  formData.set('password', 'secret');

  return {
    request: new Request('http://localhost/auth/login', {
      method: 'POST',
      body: formData,
    }),
    cookies: {
      set: vi.fn(),
    },
    locals: {},
  };
};

const createLoginResult = (userState: UserState, token = 'session-token') => ({
  data: {
    login: {
      token,
      user: {
        userState,
        userId: 'user-1',
        email: 'user@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
        __typename: 'Client',
      },
    },
  },
});

describe('/auth/login action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores the session and redirects enabled users to contracts', async () => {
    const event = createLoginEvent();
    toPromiseMock.mockResolvedValue(createLoginResult(UserState.Enabled));

    await expect(actions.default(event as never)).rejects.toMatchObject({
      status: 302,
      location: '/contracts',
    });

    expect(createUrqlClientMock).toHaveBeenCalledOnce();
    expect(mutationMock).toHaveBeenCalledWith(expect.anything(), {
      input: {
        email: 'user@example.com',
        password: 'secret',
      },
    });
    expect(event.cookies.set).toHaveBeenCalledWith(
      'session_id',
      JSON.stringify(createLoginResult(UserState.Enabled).data.login),
      {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
      },
    );
  });

  it('redirects pending users back to login with pendingState', async () => {
    const event = createLoginEvent();
    toPromiseMock.mockResolvedValue(createLoginResult(UserState.Pending));

    await expect(actions.default(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login?pendingState=true',
    });

    expect(event.cookies.set).not.toHaveBeenCalled();
  });

  it('returns graphQL error messages as a 400 failure', async () => {
    const event = createLoginEvent();
    toPromiseMock.mockResolvedValue({
      data: null,
      error: {
        graphQLErrors: [{ message: 'Credenciales inválidas' }],
      },
    });

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 400,
      data: { messages: ['Credenciales inválidas'] },
    });
    expect(event.cookies.set).not.toHaveBeenCalled();
  });

  it('returns a generic 400 failure for non-graphQL urql errors', async () => {
    const event = createLoginEvent();
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
    const event = createLoginEvent();
    toPromiseMock.mockResolvedValue(createLoginResult(UserState.Enabled, ''));

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 500,
      data: { messages: ['Token no recibido'] },
    });
    expect(event.cookies.set).not.toHaveBeenCalled();
  });

  it('returns a 500 failure when the request cannot be completed', async () => {
    const event = createLoginEvent();
    toPromiseMock.mockRejectedValue(new Error('network down'));

    await expect(actions.default(event as never)).resolves.toMatchObject({
      status: 500,
      data: { messages: ['Ocurrió un error inesperado. Inténtalo de nuevo.'] },
    });
    expect(event.cookies.set).not.toHaveBeenCalled();
  });
});
