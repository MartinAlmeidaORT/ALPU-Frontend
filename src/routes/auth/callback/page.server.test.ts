import { GOOGLE_AUTH_MUTATION } from '$lib/graphql/mutations/auth';
import { UserState } from '$lib/graphql/schema';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';

const { createUrqlClientMock, mutationMock, toPromiseMock } = vi.hoisted(() => {
  const toPromiseMock = vi.fn();
  const mutationMock = vi.fn(() => ({ toPromise: toPromiseMock }));
  const createUrqlClientMock = vi.fn(() => ({ mutation: mutationMock }));

  return { createUrqlClientMock, mutationMock, toPromiseMock };
});

vi.mock('$lib/graphql/client', () => ({
  createUrqlClient: createUrqlClientMock,
}));

const createCookies = () => ({
  set: vi.fn(),
});

const createCallbackEvent = (
  url = 'http://localhost/auth/callback?code=abc',
) => ({
  cookies: createCookies(),
  url: new URL(url),
});

const createGoogleAuthResult = (overrides = {}) => ({
  data: {
    googleAuth: {
      requiresRegistration: false,
      subject: 'google-subject',
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      user: {
        userState: UserState.Enabled,
      },
      token: 'session-token',
      ...overrides,
    },
  },
});

describe('/auth/callback load', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('stores pending signup data and redirects when Google requires registration', async () => {
    const event = createCallbackEvent();
    toPromiseMock.mockResolvedValue(
      createGoogleAuthResult({ requiresRegistration: true, user: null }),
    );

    await expect(load(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login/signup-google',
    });

    expect(mutationMock).toHaveBeenCalledWith(GOOGLE_AUTH_MUTATION, {
      code: 'abc',
    });
    expect(event.cookies.set).toHaveBeenCalledWith(
      'pending_signup',
      JSON.stringify({
        subject: 'google-subject',
        email: 'ada@example.com',
        firstName: 'Ada',
        lastName: 'Lovelace',
      }),
      { path: '/', httpOnly: true, maxAge: 600, sameSite: 'lax' },
    );
  });

  it('stores the session and redirects enabled users to contracts', async () => {
    const event = createCallbackEvent();
    const result = createGoogleAuthResult();
    toPromiseMock.mockResolvedValue(result);

    await expect(load(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/contracts',
    });

    expect(event.cookies.set).toHaveBeenCalledWith(
      'session_id',
      JSON.stringify(result.data.googleAuth),
      {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      },
    );
  });

  it('redirects non-enabled users to pending login without setting a session', async () => {
    const event = createCallbackEvent();
    toPromiseMock.mockResolvedValue(
      createGoogleAuthResult({
        user: {
          userState: UserState.Pending,
        },
      }),
    );

    await expect(load(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login?pendingState=true',
    });

    expect(event.cookies.set).not.toHaveBeenCalledWith(
      'session_id',
      expect.anything(),
      expect.anything(),
    );
  });

  it('redirects to pending login when the callback has no code', async () => {
    const event = createCallbackEvent('http://localhost/auth/callback');

    await expect(load(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login?pendingState=true',
    });

    expect(createUrqlClientMock).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it('redirects to pending login when Google auth fails', async () => {
    const event = createCallbackEvent();
    toPromiseMock.mockRejectedValue(new Error('network down'));

    await expect(load(event as never)).rejects.toMatchObject({
      status: 303,
      location: '/login?pendingState=true',
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });
});
