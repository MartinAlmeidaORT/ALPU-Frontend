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

    expect(screen.getByText('Buscar')).toBeInTheDocument();
  });

  it('renders the broadcaster search form for clients', () => {
    render(SearchClientBroadcaster, {
      props: {
        rol: 'Client',
        valorId: null,
      },
    });

    expect(screen.getByText('Buscar')).toBeInTheDocument();
  });

  it('finds a client and stores the selected user id', async () => {
    fetchClientMock.mockResolvedValue({
      data: {
        clients: [
          {
            userId: 7,
            email: 'grace@test.com',
            firstName: 'Grace',
            lastName: 'Client',
          },
        ],
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
          valorId = value as number;
        },
      },
    });

    const input = screen.getByPlaceholderText(
      'Ingresar email',
    ) as HTMLInputElement;

    await fireEvent.input(input, {
      target: {
        value: 'grace@test.com',
      },
    });

    expect(input.value).toBe('grace@test.com');

    const buscar = screen
      .getAllByRole('button', { name: 'Buscar' })
      .find((button) => button.getAttribute('data-slot') === 'button');

    expect(buscar).toBeDefined();

    await fireEvent.click(buscar!);

    await waitFor(() =>
      expect(fetchClientMock).toHaveBeenCalledWith({
        email: 'grace@test.com',
      }),
    );

    expect(
      await screen.findByText('Cliente encontrado'),
    ).toBeInTheDocument();

    await fireEvent.click(
      await screen.findByRole('button', {
        name: 'Escoger',
      }),
    );

    expect(valorId).toBe(7);

    expect(toastSuccessMock).toHaveBeenCalledWith(
      'Usuario seleccionado: Grace Client',
    );
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
      screen.getByPlaceholderText('Ingresar email'),
      {
        target: {
          value: 'missing@test.com',
        },
      },
    );

    const buscar = screen
      .getAllByRole('button', { name: 'Buscar' })
      .find((button) => button.getAttribute('data-slot') === 'button');

    expect(buscar).toBeDefined();

    await fireEvent.click(buscar!);

    await waitFor(() => {
      expect(fetchClientMock).toHaveBeenCalledWith({
        email: 'missing@test.com',
      });

      expect(toastErrorMock).toHaveBeenCalledWith(
        'No se encontró ningún cliente con ese email',
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
      screen.getByPlaceholderText('Ingresar email'),
      {
        target: {
          value: 'missing@test.com',
        },
      },
    );

    const buscar = screen
      .getAllByRole('button', { name: 'Buscar' })
      .find((button) => button.getAttribute('data-slot') === 'button');

    expect(buscar).toBeDefined();

    await fireEvent.click(buscar!);

    await waitFor(() => {
      expect(fetchBroadcasterMock).toHaveBeenCalledWith({
        email: 'missing@test.com',
      });

      expect(toastErrorMock).toHaveBeenCalledWith(
        'No se encontró ningún broadcaster con ese email',
      );
    });
  });
});