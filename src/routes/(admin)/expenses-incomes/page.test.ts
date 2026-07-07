import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { readable } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

const { enhanceMock, invalidateAllMock, toastErrorMock, toastSuccessMock } =
  vi.hoisted(() => ({
    enhanceMock: vi.fn(() => ({ destroy: vi.fn() })),
    invalidateAllMock: vi.fn(),
    toastErrorMock: vi.fn(),
    toastSuccessMock: vi.fn(),
  }));

vi.mock('$app/forms', () => ({
  enhance: enhanceMock,
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidateAll: invalidateAllMock,
}));

vi.mock('$app/stores', () => ({
  page: readable({
    data: {
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    },
    url: new URL('http://localhost/expenses-incomes'),
  }),
}));

vi.mock('svelte-sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

const data = {
  token: 'session-token',
  bills: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

const renderPage = () => render(Page, { props: { data } });

const openDialog = async () => {
  await fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
};

describe('/expenses-incomes page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens the add bill dialog', async () => {
    renderPage();

    await openDialog();

    expect(
      screen.getByRole('heading', { name: 'Agregar' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Imagen del comprobante')).toBeInTheDocument();
  });

  it('enables the contract id field only when the contract checkbox is checked', async () => {
    renderPage();

    await openDialog();

    const contractId = screen.getByLabelText('ID del Contrato');
    expect(contractId).toBeDisabled();

    await fireEvent.click(screen.getByLabelText('Pertenece a contrato'));

    expect(contractId).not.toBeDisabled();
  });

  it('invalidates data, closes the dialog, and shows a success toast after submit succeeds', async () => {
    let submitCallbackFactory:
      | (() => (event: {
          result: { type: string };
          update: ReturnType<typeof vi.fn>;
        }) => Promise<void>)
      | undefined;
    enhanceMock.mockImplementation((_form, callbackFactory) => {
      submitCallbackFactory = callbackFactory;
      return { destroy: vi.fn() };
    });
    renderPage();
    await openDialog();

    await submitCallbackFactory?.()({
      result: { type: 'success' },
      update: vi.fn(),
    });
    await tick();

    expect(invalidateAllMock).toHaveBeenCalledOnce();
    expect(toastSuccessMock).toHaveBeenCalledWith(
      'Comprobante agregado exitosamente.',
    );
    expect(
      screen.queryByRole('heading', { name: 'Agregar' }),
    ).not.toBeInTheDocument();
  });

  it('keeps the dialog open and shows an error toast after submit fails', async () => {
    let submitCallbackFactory:
      | (() => (event: {
          result: { type: string };
          update: ReturnType<typeof vi.fn>;
        }) => Promise<void>)
      | undefined;
    enhanceMock.mockImplementation((_form, callbackFactory) => {
      submitCallbackFactory = callbackFactory;
      return { destroy: vi.fn() };
    });
    const update = vi.fn();
    renderPage();
    await openDialog();

    await submitCallbackFactory?.()({
      result: { type: 'failure' },
      update,
    });
    await tick();

    expect(toastErrorMock).toHaveBeenCalledWith(
      expect.any(String),
    );
    expect(update).toHaveBeenCalledWith({ reset: false });
    expect(invalidateAllMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: 'Agregar' }),
    ).toBeInTheDocument();
  });
});
