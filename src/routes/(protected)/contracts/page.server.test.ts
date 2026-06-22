import {
  CONTRACTS_FILTERED_QUERY,
  CONTRACTS_QUERY,
} from '$lib/graphql/queries/contracts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';

const contracts = [
  {
    contractId: 12,
    broadcaster: {
      firstName: 'Ada',
      lastName: 'Radio',
    },
    client: {
      firstName: 'Grace',
      lastName: 'Client',
      agency: {
        name: 'Agency One',
      },
    },
    state: 'PENDING',
    date: '2026-06-01T00:00:00.000Z',
    dueDate: '2026-07-01T00:00:00.000Z',
  },
];

const pageInfo = {
  hasNextPage: true,
  hasPreviousPage: false,
  startCursor: 'start-cursor',
  endCursor: 'end-cursor',
};

const createLocals = (result: unknown) => {
  const toPromise = vi.fn().mockResolvedValue(result);
  const query = vi.fn(() => ({ toPromise }));

  return {
    locals: {
      token: 'session-token',
      urql: {
        query,
      },
    },
    query,
    toPromise,
  };
};

describe('/contracts load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads contracts without state filter', async () => {
    const { locals, query } = createLocals({
      data: {
        contracts: {
          nodes: contracts,
          pageInfo,
          totalCount: 1,
        },
      },
    });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/contracts'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      contracts,
      pageInfo,
      totalCount: 1,
    });
    expect(query).toHaveBeenCalledWith(
      CONTRACTS_QUERY,
      { first: 15, after: null },
      { requestPolicy: 'network-only' },
    );
  });

  it('loads contracts with state and pagination filters', async () => {
    const { locals, query } = createLocals({
      data: {
        contracts: {
          nodes: contracts,
          pageInfo,
          totalCount: 1,
        },
      },
    });

    await load({
      locals,
      url: new URL('http://localhost/contracts?state=ACTIVE&after=abc'),
    } as never);

    expect(query).toHaveBeenCalledWith(
      CONTRACTS_FILTERED_QUERY,
      { first: 15, after: 'abc', state: 'ACTIVE' },
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
        url: new URL('http://localhost/contracts'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      contracts: [],
      error: 'GraphQL Error: Backend unavailable',
    });
  });

  it('returns an empty list and error when GraphQL returns no data', async () => {
    const { locals } = createLocals({
      data: null,
    });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/contracts'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      contracts: [],
      error: 'No data returned from GraphQL',
    });
  });

  it('uses empty defaults when the contracts connection is missing fields', async () => {
    const { locals } = createLocals({
      data: {
        contracts: {
          nodes: null,
          pageInfo: undefined,
          totalCount: null,
        },
      },
    });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/contracts'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      contracts: [],
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
      urql: {
        query,
      },
    };

    await expect(
      load({
        locals,
        url: new URL('http://localhost/contracts'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      contracts: [],
      error: 'Network down',
    });
  });
});
