import {
  DELETE_BILL_MUTATION,
  GET_BILL_URL_QUERY,
} from '$lib/graphql/queries/bills';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TableBill } from './columns';
import DataTableActions from './data-table-actions.svelte';

const {
  createUrqlClientMock,
  invalidateAllMock,
  mutationMock,
  queryMock,
  toPromiseMock,
  toastErrorMock,
  toastSuccessMock,
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
  const toastSuccessMock = vi.fn();

  return {
    createUrqlClientMock,
    invalidateAllMock,
    mutationMock,
    queryMock,
    toPromiseMock,
    toastErrorMock,
    toastSuccessMock,
  };
});

vi.mock('$lib/graphql/client', () => ({
  createUrqlClient: createUrqlClientMock,
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidateAll: invalidateAllMock,
}));

vi.mock('svelte-sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

const bill: TableBill = {
  billId: 7,
  title: 'Comprobante',
  description: 'Pago mensual',
  state: 'INCOME',
  amount: 1200,
  date: '2026-06-01',
};

const renderActions = () =>
  render(DataTableActions, {
    props: {
      bill,
    },
    context: new Map([['token', 'session-token']]),
  });

const openMenu = async () => {
  await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
};

describe('expenses-incomes DataTableActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  it('shows bill actions', async () => {
    renderActions();
    await openMenu();

    expect(await screen.findByText('Ver comprobante')).toBeInTheDocument();
    expect(screen.getByText('Borrar comprobante')).toBeInTheDocument();
  });

  it('stores bill preview data and opens the preview page', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({
      data: {
        billProofDownloadUrl: {
          amazonS3Url: 'https://example.com/proof.png',
        },
      },
    });

    await openMenu();
    await fireEvent.click(await screen.findByText('Ver comprobante'));

    await waitFor(() => {
      expect(queryMock).toHaveBeenCalledWith(GET_BILL_URL_QUERY, {
        billId: 7,
      });
      expect(createUrqlClientMock).toHaveBeenCalledWith('session-token');
      expect(sessionStorage.getItem('billPreview')).toBe(
        JSON.stringify({ proofFileUrl: 'https://example.com/proof.png' }),
      );
      expect(window.open).toHaveBeenCalledWith(
        '/expenses-incomes-preview',
        '_blank',
      );
    });
  });

  it('deletes a bill and invalidates data', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({
      data: {
        deleteBill: {
          title: 'Comprobante',
        },
      },
    });

    await openMenu();
    await fireEvent.click(await screen.findByText('Borrar comprobante'));

    await waitFor(() => {
      expect(mutationMock).toHaveBeenCalledWith(DELETE_BILL_MUTATION, {
        billId: 7,
      });
      expect(invalidateAllMock).toHaveBeenCalledOnce();
      expect(toastSuccessMock).toHaveBeenCalledWith(
        'Comprobante eliminado exitosamente.',
      );
    });
  });

  it('shows a toast when viewing the bill fails', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({ error: new Error('fail') });

    await openMenu();
    await fireEvent.click(await screen.findByText('Ver comprobante'));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Hubo un error al obtener el comprobante.',
      );
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  it('shows a toast when the bill proof url is missing', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({
      data: {
        billProofDownloadUrl: {
          amazonS3Url: null,
        },
      },
    });

    await openMenu();
    await fireEvent.click(await screen.findByText('Ver comprobante'));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Hubo un error al obtener el comprobante.',
      );
      expect(sessionStorage.getItem('billPreview')).toBeNull();
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  it('shows a toast when the bill proof payload is missing', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({ data: {} });

    await openMenu();
    await fireEvent.click(await screen.findByText('Ver comprobante'));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Hubo un error al obtener el comprobante.',
      );
      expect(sessionStorage.getItem('billPreview')).toBeNull();
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  it('shows a toast when deleting the bill fails', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({ error: new Error('fail') });

    await openMenu();
    await fireEvent.click(await screen.findByText('Borrar comprobante'));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Hubo un error al eliminar el comprobante.',
      );
      expect(invalidateAllMock).not.toHaveBeenCalled();
    });
  });
});
