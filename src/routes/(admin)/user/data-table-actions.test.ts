import { APPROVE_USER_MUTATION } from '$lib/graphql/queries/user';
import { UserState } from '$lib/graphql/schema';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DataTableActions from './data-table-actions.svelte';
import type { TableUser } from './columns';

const {
  createUrqlClientMock,
  invalidateAllMock,
  mutationMock,
  toPromiseMock,
  toastErrorMock,
  toastSuccessMock,
} = vi.hoisted(() => {
  const toPromiseMock = vi.fn();
  const mutationMock = vi.fn(() => ({ toPromise: toPromiseMock }));
  const createUrqlClientMock = vi.fn(() => ({
    mutation: mutationMock,
  }));
  const invalidateAllMock = vi.fn();
  const toastErrorMock = vi.fn();
  const toastSuccessMock = vi.fn();

  return {
    createUrqlClientMock,
    invalidateAllMock,
    mutationMock,
    toPromiseMock,
    toastErrorMock,
    toastSuccessMock,
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
    success: toastSuccessMock,
  },
}));

const user: TableUser = {
  userId: 3,
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  rut: '123456789012',
  userState: 'PENDING',
  __typename: 'Administrator',
};

const renderActions = (userState = 'PENDING') =>
  render(DataTableActions, {
    props: {
      user: {
        ...user,
        userState,
      },
    },
    context: new Map([['token', 'session-token']]),
  });

const openMenu = async () => {
  await fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
};

describe('user DataTableActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows approve action for pending users', async () => {
    renderActions();
    await openMenu();

    expect(await screen.findByText('Aprobar')).toBeInTheDocument();
  });

  it('does not show actions for non-pending users', () => {
    renderActions('ENABLED');

    expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument();
  });

  it('approves a pending user and invalidates data', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({
      data: {
        approveUser: {
          userId: 3,
          userState: 'ENABLED',
        },
      },
    });

    await openMenu();
    await fireEvent.click(await screen.findByText('Aprobar'));

    await waitFor(() => {
      expect(mutationMock).toHaveBeenCalledWith(APPROVE_USER_MUTATION, {
        input: {
          userId: 3,
          newState: UserState.Enabled,
        },
      });
      expect(createUrqlClientMock).toHaveBeenCalledWith('session-token');
      expect(invalidateAllMock).toHaveBeenCalledOnce();
      expect(toastSuccessMock).toHaveBeenCalledWith('Usuario aprobado exitosamente');
    });
  });

  it('shows a toast when approving fails', async () => {
    renderActions();
    toPromiseMock.mockResolvedValue({
      error: {
        message: 'Invalid user',
      },
    });

    await openMenu();
    await fireEvent.click(await screen.findByText('Aprobar'));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error al aprobar usuario: Invalid user',
      );
      expect(invalidateAllMock).not.toHaveBeenCalled();
    });
  });
});
