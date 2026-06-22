import {
  APPROVE_CONTRACT_QUERY,
  CANCEL_CONTRACT_QUERY,
  GET_CONTRACT_URL_QUERY,
} from '$lib/graphql/queries/contracts';
import { ContractState } from '$lib/graphql/schema';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DataTableActions from './data-table-actions.svelte';
import type { TableContract } from './columns';

const {
  createUrqlClientMock,
  invalidateAllMock,
  mutationMock,
  queryMock,
  toPromiseMock,
  toastErrorMock,
} = vi.hoisted(() => {
  const toPromiseMock = vi.fn();
  const mutationMock = vi.fn(() => ({ toPromise: toPromiseMock }));
  const queryMock = vi.fn(() => ({ toPromise: toPromiseMock }));
  const createUrqlClientMock = vi.fn(() => ({
    mutation: mutationMock,
    query: queryMock,
  }));
  const invalidateAllMock = vi.fn();
  const toastErrorMock = vi.fn();

  return {
    createUrqlClientMock,
    invalidateAllMock,
    mutationMock,
    queryMock,
    toPromiseMock,
    toastErrorMock,
  };
});

vi.mock('$lib/graphql/client', () => ({
  createUrqlClient: createUrqlClientMock,
}));

vi.mock('$app/navigation', () => ({
  invalidateAll: invalidateAllMock,
}));

vi.mock('svelte-sonner', () => ({
  toast: {
    error: toastErrorMock,
  },
}));

const contract: TableContract = {
  contractId: 12,
  broadcaster: {
    firstName: 'Ada',
    lastName: 'Radio',
  },
  client: {
    firstName: 'Grace',
    lastName: 'Client',
    agency: null,
  },
  state: 'PENDING',
  date: '2026-06-01T00:00:00.000Z',
  dueDate: '2026-07-01T00:00:00.000Z',
};

const renderActions = (state = 'PENDING') =>
  render(DataTableActions, {
    props: {
      contract: {
        ...contract,
        state,
      },
    },
    context: new Map([['token', 'session-token']]),
  });

const openMenu = async () => {
  await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
};

describe('DataTableActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  it('shows actions for pending contracts', async () => {
    renderActions();
    await openMenu();

    expect(await screen.findByText('Aprobar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Ver')).toBeInTheDocument();
  });

  it('approves a pending contract and invalidates data', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({ data: { approveContract: { state: 'ACTIVE' } } });

    await openMenu();
    await fireEvent.click(await screen.findByText('Aprobar'));

    await waitFor(() => {
      expect(mutationMock).toHaveBeenCalledWith(APPROVE_CONTRACT_QUERY, {
        contractId: 12,
      });
      expect(createUrqlClientMock).toHaveBeenCalledWith('session-token');
      expect(invalidateAllMock).toHaveBeenCalledOnce();
    });
  });

  it('cancels a contract and invalidates data', async () => {
    renderActions('ACTIVE');
    toPromiseMock.mockResolvedValue({
      data: { updateContractState: { state: 'CANCELED' } },
    });

    await openMenu();
    await fireEvent.click(await screen.findByText('Cancelar'));

    await waitFor(() => {
      expect(mutationMock).toHaveBeenCalledWith(CANCEL_CONTRACT_QUERY, {
        input: {
          contractId: 12,
          newState: ContractState.Canceled,
        },
      });
      expect(invalidateAllMock).toHaveBeenCalledOnce();
    });
  });

  it('stores contract preview data and opens the preview page', async () => {
    renderActions('APPROVED');
    toPromiseMock.mockResolvedValue({
      data: {
        contractPdfDownloadUrl: {
          pdfAmazonS3Url: 'https://example.com/contract.pdf',
        },
      },
    });

    await openMenu();
    await fireEvent.click(await screen.findByText('Ver'));

    await waitFor(() => {
      expect(queryMock).toHaveBeenCalledWith(GET_CONTRACT_URL_QUERY, {
        contractId: 12,
      });
      expect(sessionStorage.getItem('contractPreview')).toBe(
        JSON.stringify({ pdfUrl: 'https://example.com/contract.pdf' }),
      );
      expect(sessionStorage.getItem('contractId')).toBe('12');
      expect(window.open).toHaveBeenCalledWith('/contract-preview', '_blank');
    });
  });

  it('shows a toast when approving fails', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({ error: new Error('fail') });

    await openMenu();
    await fireEvent.click(await screen.findByText('Aprobar'));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Error al aprobar el contrato');
      expect(invalidateAllMock).not.toHaveBeenCalled();
    });
  });

  it('shows a toast when viewing the contract fails', async () => {
    renderActions('APPROVED');
    toPromiseMock.mockResolvedValue({ error: new Error('fail') });

    await openMenu();
    await fireEvent.click(await screen.findByText('Ver'));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Error al obtener el contrato');
      expect(window.open).not.toHaveBeenCalled();
    });
  });
});
