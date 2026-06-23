import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchClientBroadcaster from './search-client-broadcaster.svelte';

const {
  fetchBroadcasterMock,
  fetchClientMock,
  toastErrorMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  fetchClientMock: vi.fn(),
  fetchBroadcasterMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock('$lib/graphql/queries/user', () => ({
  fetchClient: fetchClientMock,
  fetchBroadcaster: fetchBroadcasterMock,
}));

vi.mock('svelte-sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

describe('SearchClientBroadcaster', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the client search form for broadcasters', () => {
    render(SearchClientBroadcaster, {
      props: {
        rol: 'Broadcaster',
        valorId: null,
      },
    });

    expect(screen.getByText('Buscar cliente')).toBeInTheDocument();
  });

  it('renders the broadcaster search form for clients', () => {
    render(SearchClientBroadcaster, {
      props: {
        rol: 'Client',
        valorId: null,
      },
    });

    expect(screen.getByText('Buscar broadcaster')).toBeInTheDocument();
  });

  it('finds a client and stores the selected user id', async () => {
    fetchClientMock.mockResolvedValue({
      data: {
        clients: [{ userId: 7, firstName: 'Grace', lastName: 'Client' }],
      },
    });

    let valorId: number | null = null;
    render(SearchClientBroadcaster, {
      props: {
        rol: 'Broadcaster',
        get valorId() {
          return valorId;
        },
        set valorId(value) {
          valorId = value as number | null;
        },
      },
    });

    await fireEvent.input(
      screen.getByPlaceholderText('Ingresa el nombre del cliente'),
      {
        target: { value: 'Grace' },
      },
    );
    await fireEvent.input(
      screen.getByPlaceholderText('Ingresa el apellido del cliente'),
      {
        target: { value: 'Client' },
      },
    );
    await fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => {
      expect(fetchClientMock).toHaveBeenCalledWith({
        firstName: 'Grace',
        lastName: 'Client',
      });
      expect(screen.getByText(/Cliente encontrado:/)).toBeInTheDocument();
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Escoger' }));

    expect(valorId).toBe(7);
    expect(toastSuccessMock).toHaveBeenCalledWith('Escogido: Grace Client');
  });

  it('shows a toast when no client matches the search', async () => {
    fetchClientMock.mockResolvedValue({
      data: {
        clients: [],
      },
    });

    render(SearchClientBroadcaster, {
      props: {
        rol: 'Broadcaster',
        valorId: null,
      },
    });

    await fireEvent.input(
      screen.getByPlaceholderText('Ingresa el nombre del cliente'),
      {
        target: { value: 'Missing' },
      },
    );
    await fireEvent.input(
      screen.getByPlaceholderText('Ingresa el apellido del cliente'),
      {
        target: { value: 'User' },
      },
    );
    await fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'No se encontró ningún cliente con ese nombre y apellido',
      );
    });
  });

  it('shows a toast when no broadcaster matches the search', async () => {
    fetchBroadcasterMock.mockResolvedValue({
      data: {
        broadcasters: [],
      },
    });

    render(SearchClientBroadcaster, {
      props: {
        rol: 'Client',
        valorId: null,
      },
    });

    await fireEvent.input(
      screen.getByPlaceholderText('Ingresa el nombre del cliente'),
      {
        target: { value: 'Missing' },
      },
    );
    await fireEvent.input(
      screen.getByPlaceholderText('Ingresa el apellido del cliente'),
      {
        target: { value: 'User' },
      },
    );
    await fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => {
      expect(fetchBroadcasterMock).toHaveBeenCalledWith({
        firstName: 'Missing',
        lastName: 'User',
      });
      expect(toastErrorMock).toHaveBeenCalledWith(
        'No se encontró ningún broadcaster con ese nombre y apellido',
      );
    });
  });
});
