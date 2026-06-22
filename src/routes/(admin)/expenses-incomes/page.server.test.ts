import { createUrqlClient } from '$lib/graphql/client';
import {
  BILLS_QUERY,
  GENERATE_BILL_MUTATION,
} from '$lib/graphql/queries/bills.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { actions, load } from './+page.server';

vi.mock('$lib/graphql/client', () => ({
  createUrqlClient: vi.fn(),
}));

const bills = [
  {
    billId: 7,
    title: 'Comprobante',
    description: 'Pago mensual',
    state: 'INCOME',
    amount: 1200,
    date: '2026-06-01',
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
  };
};

const createActionEvent = (
  overrides: Record<string, string | Blob> = {},
  token = 'session-token',
) => {
  const formData = new FormData();
  const fields: Record<string, string | Blob> = {
    name: 'Comprobante',
    description: 'Pago mensual',
    amount: '1200.50',
    type: 'income',
    contractId: '42',
    ...overrides,
  };

  for (const [key, value] of Object.entries(fields)) {
    if (value instanceof File) {
      formData.set(key, value, value.name);
    } else {
      formData.set(key, value);
    }
  }

  return {
    request: new Request('http://localhost/expenses-incomes', {
      method: 'POST',
      body: formData,
    }),
    cookies: {
      set: vi.fn(),
    },
    locals: {
      token,
    },
  };
};

const mockCreateUrqlMutation = (result: unknown) => {
  const toPromise = vi.fn().mockResolvedValue(result);
  const mutation = vi.fn(() => ({ toPromise }));
  vi.mocked(createUrqlClient).mockReturnValue({ mutation } as never);

  return { mutation };
};

describe('/expenses-incomes load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads bills with pagination', async () => {
    const { locals, query } = createLocals({
      data: {
        bills: {
          nodes: bills,
          pageInfo,
          totalCount: 1,
        },
      },
    });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/expenses-incomes?after=abc'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      bills,
      pageInfo,
      totalCount: 1,
    });
    expect(query).toHaveBeenCalledWith(
      BILLS_QUERY,
      { first: 15, after: 'abc' },
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
        url: new URL('http://localhost/expenses-incomes'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      bills: [],
      error: 'GraphQL Error: Backend unavailable',
    });
  });

  it('returns an empty list and error when GraphQL returns no data', async () => {
    const { locals } = createLocals({ data: null });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/expenses-incomes'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      bills: [],
      error: 'No data returned from GraphQL',
    });
  });

  it('uses empty defaults when the bills connection is missing fields', async () => {
    const { locals } = createLocals({
      data: {
        bills: {
          nodes: null,
          pageInfo: undefined,
          totalCount: null,
        },
      },
    });

    await expect(
      load({
        locals,
        url: new URL('http://localhost/expenses-incomes'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      bills: [],
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
        url: new URL('http://localhost/expenses-incomes'),
      } as never),
    ).resolves.toEqual({
      token: 'session-token',
      bills: [],
      error: 'Network down',
    });
  });
});

describe('/expenses-incomes action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('registers a bill without uploading when there is no file upload url', async () => {
    const { mutation } = mockCreateUrqlMutation({
      data: {
        registerBill: {
          amazonS3Url: null,
        },
      },
    });

    await expect(actions.default(createActionEvent() as never)).resolves.toEqual({
      success: true,
    });
    expect(createUrqlClient).toHaveBeenCalledWith('session-token');
    expect(mutation).toHaveBeenCalledWith(GENERATE_BILL_MUTATION, {
      input: expect.objectContaining({
        title: 'Comprobante',
        description: 'Pago mensual',
        amount: 1200.5,
        type: 'INCOME',
        fileName: '',
        contractId: 42,
      }),
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('uploads the receipt file to S3 when the mutation returns an upload url', async () => {
    const file = new File(['receipt'], 'receipt.png', { type: 'image/png' });
    mockCreateUrqlMutation({
      data: {
        registerBill: {
          amazonS3Url: 'https://s3.example.com/upload',
        },
      },
    });
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    await expect(
      actions.default(
        createActionEvent({
          receiptImage: file,
          type: 'expense',
          contractId: '',
        }) as never,
      ),
    ).resolves.toEqual({ success: true });

    expect(fetch).toHaveBeenCalledWith('https://s3.example.com/upload', {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="receipt.png"',
      },
    });
  });

  it('returns an error when bill registration fails', async () => {
    mockCreateUrqlMutation({
      error: {
        message: 'Invalid bill',
      },
    });

    await expect(actions.default(createActionEvent() as never)).resolves.toEqual({
      error: 'Invalid bill',
    });
  });

  it('returns an error when S3 upload fails', async () => {
    const file = new File(['receipt'], 'receipt.png', { type: 'image/png' });
    mockCreateUrqlMutation({
      data: {
        registerBill: {
          amazonS3Url: 'https://s3.example.com/upload',
        },
      },
    });
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    await expect(
      actions.default(createActionEvent({ receiptImage: file }) as never),
    ).resolves.toEqual({
      error: 'Failed to upload file to S3.',
    });
  });

  it('returns a caught error message when the mutation throws', async () => {
    const mutation = vi.fn(() => ({
      toPromise: vi.fn().mockRejectedValue(new Error('Network down')),
    }));
    vi.mocked(createUrqlClient).mockReturnValue({ mutation } as never);

    await expect(actions.default(createActionEvent() as never)).resolves.toEqual({
      error: 'Network down',
    });
  });
});
