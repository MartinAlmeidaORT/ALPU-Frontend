import {
  USERS_FILTERED_QUERY,
  USERS_QUERY,
} from '$lib/graphql/queries/user';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';

const users = [
  {
    userId: 3,
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    rut: '123456789012',
    userState: 'PENDING',
    __typename: 'Administrator',
  },
];

const pageInfo = {
  hasNextPage: true,
  hasPreviousPage: false,
  startCursor: 'start-cursor',
  endCursor: 'end-cursor',
};

const createLocals = (result: unknown, rol = 'Administrator') => {
  const toPromise = vi.fn().mockResolvedValue(result);
  const query = vi.fn(() => ({ toPromise }));

  return {
    locals: {
      token: 'session-token',
      rol,
      urql: {
        query,
      },
    },
    query,
  };
};

describe('/user load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects accountants to expenses and incomes', async () => {
    const { locals } = createLocals({}, 'Accountant');

    await expect(
      load({
        locals,
        url: new URL('http://localhost/user'),
      } as never),
    ).rejects.toMatchObject({
      status: 303,
      location: '/expenses-incomes',
    });
  });

  it('loads users without state filter', async () => {
    const { locals, query } = createLocals({
      data: {
        users: {
          nodes: users,
          pageInfo,
          totalCount: 1,
        },
      },
    });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/user'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      users,
      pageInfo,
      totalCount: 1,
    });
    expect(query).toHaveBeenCalledWith(
      USERS_QUERY,
      { first: 15, after: null },
      { requestPolicy: 'network-only' },
    );
  });

  it('loads users with state and pagination filters', async () => {
    const { locals, query } = createLocals({
      data: {
        users: {
          nodes: users,
          pageInfo,
          totalCount: 1,
        },
      },
    });

    await load({
      locals,
      url: new URL('http://localhost/user?state=PENDING&after=abc'),
    } as never);

    expect(query).toHaveBeenCalledWith(
      USERS_FILTERED_QUERY,
      { first: 15, after: 'abc', state: 'PENDING' },
      { requestPolicy: 'network-only' },
    );
  });

  it('uses the unfiltered query when state is ALL', async () => {
    const { locals, query } = createLocals({
      data: {
        users: {
          nodes: users,
          pageInfo,
          totalCount: 1,
        },
      },
    });

    await load({
      locals,
      url: new URL('http://localhost/user?state=ALL'),
    } as never);

    expect(query).toHaveBeenCalledWith(
      USERS_QUERY,
      { first: 15, after: null },
      { requestPolicy: 'network-only' },
    );
  });

  it('returns an empty list and error when GraphQL returns an error', async () => {
    const { locals } = createLocals({
      error: {
        message: 'Backend unavailable',
      },
    });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/user'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      users: [],
      error: 'GraphQL Error: Backend unavailable',
    });
  });

  it('returns an empty list and error when GraphQL returns no data', async () => {
    const { locals } = createLocals({ data: null });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/user'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      users: [],
      error: 'No se recibieron datos de usuarios',
    });
  });

  it('uses empty defaults when the users connection is missing fields', async () => {
    const { locals } = createLocals({
      data: {
        users: {
          nodes: null,
          pageInfo: undefined,
          totalCount: null,
        },
      },
    });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/user'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      users: [],
      pageInfo: undefined,
      totalCount: 0,
    });
  });

  it('returns an empty list and caught error message when the query throws', async () => {
    const query = vi.fn(() => ({
      toPromise: vi.fn().mockRejectedValue(new Error('Network down')),
    }));
    const locals = {
      token: 'session-token',
      rol: 'Administrator',
      urql: {
        query,
      },
    };

    await expect(
      load({
        locals,
        url: new URL('http://localhost/user'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      users: [],
      error: 'Network down',
    });
  });
});
