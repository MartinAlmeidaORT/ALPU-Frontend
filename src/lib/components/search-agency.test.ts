import { fetchAgency } from '$lib/graphql/queries/user';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchAgencyHarness from './search-agency.test-harness.svelte';

const { toastErrorMock, toastSuccessMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock('$lib/graphql/queries/user', () => ({
  fetchAgency: vi.fn(),
  fetchBroadcaster: vi.fn(),
  fetchClient: vi.fn(),
}));

vi.mock('svelte-sonner', () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

const clients = [
  {
    userId: 12,
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
  },
  {
    userId: 21,
    firstName: 'Grace',
    lastName: 'Hopper',
    email: 'grace@example.com',
  },
];

const searchAgency = async (agencyName: string) => {
  await fireEvent.input(screen.getByPlaceholderText('Ingresar agencia'), {
    target: { value: agencyName },
  });
  await fireEvent.click(
    screen.getAllByRole('button', { name: 'Buscar' }).at(-1)!,
  );
};

describe('SearchAgency', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the agency search input and button', () => {
    render(SearchAgencyHarness);

    expect(screen.getByText('Buscar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresar agencia')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Buscar' }).length,
    ).toBeGreaterThan(0);
  });

  it('searches an agency and shows the returned clients', async () => {
    vi.mocked(fetchAgency).mockResolvedValue({
      data: {
        clients,
      },
    } as never);
    render(SearchAgencyHarness);

    await searchAgency('Analytical Engines');

    await waitFor(() => {
      expect(fetchAgency).toHaveBeenCalledWith({
        agency: 'Analytical Engines',
      });
    });
    expect(await screen.findByText('Agencia encontrada')).toBeInTheDocument();
    expect(screen.getByText(/Ada/)).toBeInTheDocument();
    expect(screen.getByText(/Lovelace/)).toBeInTheDocument();
    expect(screen.getByText(/Grace/)).toBeInTheDocument();
    expect(screen.getByText(/Hopper/)).toBeInTheDocument();
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it('selects a client, updates valorId and clears the input', async () => {
    vi.mocked(fetchAgency).mockResolvedValue({
      data: {
        clients,
      },
    } as never);
    render(SearchAgencyHarness);

    await searchAgency('Analytical Engines');
    const chooseButtons = await screen.findAllByRole('button', {
      name: 'Escoger',
    });
    await fireEvent.click(chooseButtons[0]);

    expect(screen.getByLabelText('selected-agency-id')).toHaveTextContent('12');
    expect(toastSuccessMock).toHaveBeenCalledWith(
      'Usuario seleccionado: Ada Lovelace',
    );
    expect(screen.getByPlaceholderText('Ingresar agencia')).toHaveValue('');
  });

  it('shows an error toast when no agency is found', async () => {
    vi.mocked(fetchAgency).mockResolvedValue({
      data: {
        clients: [],
      },
    } as never);
    render(SearchAgencyHarness);

    await searchAgency('Missing Agency');

    await waitFor(() => {
      expect(fetchAgency).toHaveBeenCalledWith({ agency: 'Missing Agency' });
      expect(toastErrorMock).toHaveBeenCalledWith(
        'No se encontró ninguna agencia con ese nombre',
      );
    });
    expect(screen.queryByText('Agencia encontrada')).not.toBeInTheDocument();
  });
});
