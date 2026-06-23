import { GENERATE_CONTRACT_MUTATION } from '$lib/graphql/queries/contracts';
import { UserState } from '$lib/graphql/schema';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ServiceSummary from './service-summary.svelte';

const {
  createUrqlClientMock,
  gotoMock,
  invalidateAllMock,
  mutationMock,
  toPromiseMock,
} = vi.hoisted(() => {
  const toPromiseMock = vi.fn();
  const mutationMock = vi.fn(() => ({ toPromise: toPromiseMock }));
  const createUrqlClientMock = vi.fn(() => ({
    mutation: mutationMock,
  }));
  const gotoMock = vi.fn();
  const invalidateAllMock = vi.fn();

  return {
    createUrqlClientMock,
    gotoMock,
    invalidateAllMock,
    mutationMock,
    toPromiseMock,
  };
});

vi.mock('$lib/graphql/client', () => ({
  createUrqlClient: createUrqlClientMock,
}));

vi.mock('$app/navigation', () => ({
  goto: gotoMock,
  invalidateAll: invalidateAllMock,
}));

const totalContrato = {
  total: 500,
  beforeDiscount: 600,
  adjustments: [
    {
      name: 'Descuento interior',
      key: 'interior',
      type: 'PERCENTAGE' as const,
      amount: 70,
      applyDiscount: -100,
    },
  ],
  services: [
    {
      serviceName: 'RADIO SPOT GENERICO',
      basePrice: 100,
      subsequentPrice: 50,
      subTotal: 500,
      beforeDiscount: 600,
      pieces: [{ name: 'Spot matutino', price: 500 }],
      adjustments: [],
    },
  ],
};

const renderSummary = (
  overrides: {
    totalContrato?: typeof totalContrato | null;
    errorMessages?: string | null;
    userState?: string;
    onRemoveService?: (index: number) => void;
    onRemoveAllServices?: () => void;
  } = {},
) =>
  render(ServiceSummary, {
    props: {
      rol: 'Broadcaster',
      activeUserId: 1,
      totalContrato: overrides.totalContrato ?? null,
      errorMessages: overrides.errorMessages ?? null,
      onRemoveService: overrides.onRemoveService ?? vi.fn(),
      onRemoveAllServices: overrides.onRemoveAllServices ?? vi.fn(),
    },
    context: new Map<string, unknown>([
      ['token', 'session-token'],
      ['userState', overrides.userState ?? UserState.Enabled],
    ]),
  });

describe('ServiceSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('shows an empty state when no services were selected', () => {
    renderSummary();

    expect(
      screen.getByText('No ha seleccionado ningún servicio.'),
    ).toBeInTheDocument();
  });

  it('renders contract totals and service details', () => {
    renderSummary({ totalContrato });

    expect(screen.getByText('Total con descuentos: $500')).toBeInTheDocument();
    expect(
      screen.getByText(/Nombre de pieza: Spot matutino/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Nombre del servicio: RADIO SPOT GENERICO/),
    ).toBeInTheDocument();
  });

  it('shows validation errors passed from the page', () => {
    renderSummary({
      totalContrato,
      errorMessages:
        'Está agregando servicios con duraciones distintas. Esto queda a criterio del usuario y puede afectar el contrato',
    });

    expect(
      screen.getByText(
        'Está agregando servicios con duraciones distintas. Esto queda a criterio del usuario y puede afectar el contrato',
      ),
    ).toBeInTheDocument();
  });

  it('disables contract generation when the user is not enabled', () => {
    renderSummary({
      totalContrato,
      userState: UserState.Pending,
    });

    expect(
      screen.getByRole('button', { name: 'Generar contrato' }),
    ).toBeDisabled();
  });

  it('generates a contract and navigates to the preview page', async () => {
    renderSummary({ totalContrato });
    toPromiseMock.mockResolvedValue({
      data: {
        generateContract: {
          pdfAmazonS3Url: 'https://example.com/contract.pdf',
          contract: {
            contractId: 12,
          },
        },
      },
    });

    await fireEvent.click(
      screen.getByRole('button', { name: 'Generar contrato' }),
    );

    await waitFor(() => {
      expect(mutationMock).toHaveBeenCalledWith(
        GENERATE_CONTRACT_MUTATION,
        expect.objectContaining({
          input: expect.objectContaining({
            broadcasterId: 1,
            campaign: 'Test',
            countryCode: 'UY',
          }),
        }),
      );
      expect(createUrqlClientMock).toHaveBeenCalledWith('session-token');
      expect(invalidateAllMock).toHaveBeenCalledOnce();
      expect(sessionStorage.getItem('contractPreview')).toBe(
        JSON.stringify({ pdfUrl: 'https://example.com/contract.pdf' }),
      );
      expect(sessionStorage.getItem('contractId')).toBe('12');
      expect(gotoMock).toHaveBeenCalledWith('/contract-preview');
    });
  });

  it('shows an error when contract generation fails', async () => {
    renderSummary({ totalContrato });
    toPromiseMock.mockResolvedValue({
      error: {
        message: 'Backend unavailable',
      },
    });

    await fireEvent.click(
      screen.getByRole('button', { name: 'Generar contrato' }),
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error al generar el contrato. Intenta nuevamente.'),
      ).toBeInTheDocument();
    });
    expect(gotoMock).not.toHaveBeenCalled();
  });

  it('calls remove callbacks from the summary actions', async () => {
    const onRemoveService = vi.fn();
    const onRemoveAllServices = vi.fn();
    renderSummary({
      totalContrato,
      onRemoveService,
      onRemoveAllServices,
    });

    await fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar medio' }),
    );
    await fireEvent.click(screen.getByRole('button', { name: 'Borrar todo' }));

    expect(onRemoveService).toHaveBeenCalledWith(0);
    expect(onRemoveAllServices).toHaveBeenCalledOnce();
  });
});
