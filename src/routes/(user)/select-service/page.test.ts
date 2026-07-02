import { UserState } from '$lib/graphql/schema';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

const {
  calculateServicePriceMock,
  fetchClientMock,
  fetchBroadcasterMock,
  fetchServicesMock,
  toastErrorMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  fetchServicesMock: vi.fn(),
  calculateServicePriceMock: vi.fn(),
  fetchClientMock: vi.fn(),
  fetchBroadcasterMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock('$lib/graphql/queries/service', () => ({
  fetchServices: fetchServicesMock,
  calculateServicePrice: calculateServicePriceMock,
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

const periodService = {
  __typename: 'ServicePeriod' as const,
  type: 'RADIO_GENERIC' as const,
  name: 'RADIO SPOT GENERICO',
  serviceId: 1,
  basePrice: 100,
  extraPrice: 50,
  firstExtraPrice: 75,
  periods: [
    {
      basePrice: 100,
      extraPrice: 50,
      firstExtraPrice: 75,
      interval: 'ONE_WEEK' as const,
    },
  ],
};

const broadcasterData = {
  token: 'session-token',
  rol: 'Broadcaster',
  userState: UserState.Enabled,
  user: {
    userId: 1,
    firstName: 'Ada',
    lastName: 'Radio',
  },
};

const contractTotal = {
  total: 500,
  beforeDiscount: 500,
};

const selectPeriod = async (price = 100) => {
  const btn = screen.getByRole('button', {
    name: (name) => name.trim() === `$${price}`,
  });

  await fireEvent.click(btn);
};

const openServiceForm = async () => {
  const trigger = await screen.findByRole('button', {
    name: /RADIO SPOT GENERICO/i,
  });

  if (trigger.getAttribute('aria-expanded') !== 'true') {
    await fireEvent.click(trigger);
  }

  await screen.findByRole('button', { name: /Agregar/i });
};

const fillPieceName = async (name: string) => {
  await fireEvent.input(
    screen.getByPlaceholderText('Nombre de la pieza'),
    {
      target: { value: name },
    },
  );
};

const clickAddPiece = async () => {
  await fireEvent.click(screen.getByRole('button', { name: /Agregar/i }));
};

describe('/select-service page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fetchServicesMock.mockResolvedValue({
      data: { services: [periodService] },
    });

    fetchClientMock.mockResolvedValue({
      data: {
        clients: [{ userId: 7, firstName: 'Grace', lastName: 'Client' }],
      },
    });
  });

  it('loads services and renders layout', async () => {
    render(Page, { props: { data: broadcasterData } });

    expect(await screen.findByText('RADIO SPOT GENERICO')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar')).toBeInTheDocument();
    expect(fetchServicesMock).toHaveBeenCalledOnce();
  });

  it('requires a client before adding service', async () => {
    render(Page, { props: { data: broadcasterData } });

    await screen.findByText('RADIO SPOT GENERICO');

    await selectPeriod();
    await openServiceForm();
    await fillPieceName('Spot matutino');
    await clickAddPiece();

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Selecciona un cliente',
        {
          description: 'Debes seleccionar un cliente para continuar',
        },
      );
    });

    expect(calculateServicePriceMock).not.toHaveBeenCalled();
  });

  it('shows toast when adding without duration', async () => {
    render(Page, { props: { data: broadcasterData } });

    await openServiceForm();
    await fillPieceName('Spot matutino');
    await clickAddPiece();

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Selecciona una duración para el servicio',
        {
          description: 'Debes seleccionar una duración para continuar',
        },
      );
    });

    expect(calculateServicePriceMock).not.toHaveBeenCalled();
  });

  it('calculates contract after valid add', async () => {
    calculateServicePriceMock.mockResolvedValue({
      data: { calculateContract: contractTotal },
    });

    render(Page, { props: { data: broadcasterData } });

    await screen.findByText('RADIO SPOT GENERICO');

    await selectPeriod();
    await openServiceForm();
    await fillPieceName('Spot matutino');

    await fireEvent.input(
      screen.getByPlaceholderText('Ingresa el email'),
      { target: { value: 'grace@example.com' } },
    );
    
    const buttons = screen.getAllByRole('button', { name: /buscar/i });

    const buscar = buttons.find(
      (b) => b.getAttribute('data-slot') === 'button'
    );

    expect(buscar).toBeDefined();
    await fireEvent.click(buscar!);
    await fireEvent.click(screen.getByRole('button', { name: /Escoger/i }));

    await openServiceForm();
    await clickAddPiece();

    await waitFor(() => {
      expect(calculateServicePriceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          broadcasterId: 1,
          clientId: 7,
          campaign: 'Test',
          countryCode: 'UY',
          services: expect.arrayContaining([
            expect.objectContaining({
              serviceId: 1,
              pieces: [{ name: 'Spot matutino' }],
              options: expect.objectContaining({
                period: 'ONE_WEEK',
              }),
            }),
          ]),
        }),
      );

      expect(
        screen.getByText('Total con descuentos: $500'),
      ).toBeInTheDocument();
    });
  });
});