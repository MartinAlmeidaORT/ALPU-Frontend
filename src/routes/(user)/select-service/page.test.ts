import { UserState } from '$lib/graphql/schema';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

const {
  calculateServicePriceMock,
  fetchBroadcasterMock,
  fetchClientMock,
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
  adjustments: [],
  services: [
    {
      serviceName: 'RADIO SPOT GENERICO',
      basePrice: 100,
      subsequentPrice: 50,
      subTotal: 500,
      beforeDiscount: 500,
      pieces: [{ name: 'Spot matutino', price: 500 }],
      adjustments: [],
    },
  ],
};

const selectPeriod = async (price = '100') => {
  await fireEvent.click(screen.getAllByRole('button', { name: price })[0]);
};

const openServiceForm = async () => {
  await screen.findByText('RADIO SPOT GENERICO');
  const trigger = screen.getByRole('button', { name: /RADIO SPOT GENERICO/ });
  if (trigger.getAttribute('aria-expanded') !== 'true') {
    await fireEvent.click(trigger);
  }
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeVisible();
  });
  await tick();
};

const fillPieceName = async (name: string) => {
  await fireEvent.input(screen.getByPlaceholderText('Nombre de la pieza'), {
    target: { value: name },
  });
};

const clickAddPiece = async () => {
  await fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
};

describe('/select-service page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchServicesMock.mockResolvedValue({
      data: {
        services: [periodService],
      },
    });
    fetchClientMock.mockResolvedValue({
      data: {
        clients: [{ userId: 7, firstName: 'Grace', lastName: 'Client' }],
      },
    });
  });

  it('loads services and renders the service selection layout', async () => {
    render(Page, { props: { data: broadcasterData } });

    expect(await screen.findByText('RADIO SPOT GENERICO')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar')).toBeInTheDocument();
    expect(screen.getByText('Buscar cliente')).toBeInTheDocument();
    expect(fetchServicesMock).toHaveBeenCalledOnce();
  });

  it('requires a client before adding a service for broadcasters', async () => {
    render(Page, { props: { data: broadcasterData } });

    await screen.findByText('RADIO SPOT GENERICO');
    await selectPeriod();
    await openServiceForm();
    await fillPieceName('Spot matutino');
    await clickAddPiece();

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Selecciona un cliente', {
        description: 'Debes seleccionar un cliente para continuar',
      });
    });
    expect(calculateServicePriceMock).not.toHaveBeenCalled();
  });

  it('shows a toast when adding a period service without a duration', async () => {
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

  it('calculates the contract total after adding a service with a selected client', async () => {
    calculateServicePriceMock.mockResolvedValue({
      data: {
        calculateContract: contractTotal,
      },
    });

    render(Page, { props: { data: broadcasterData } });

    await screen.findByText('RADIO SPOT GENERICO');
    await selectPeriod();
    await openServiceForm();
    await fillPieceName('Spot matutino');

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
    await fireEvent.click(
      await screen.findByRole('button', { name: 'Escoger' }),
    );
    await openServiceForm();
    await clickAddPiece();

    await waitFor(() => {
      expect(calculateServicePriceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          broadcasterId: 1,
          clientId: 7,
          campaign: 'Test',
          countryCode: 'UY',
          services: [
            expect.objectContaining({
              serviceId: 1,
              pieces: [{ name: 'Spot matutino' }],
              options: expect.objectContaining({
                period: 'ONE_WEEK',
              }),
            }),
          ],
        }),
      );
      expect(
        screen.getByText('Total con descuentos: $500'),
      ).toBeInTheDocument();
    });
  });
});
