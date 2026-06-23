import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ServiceItemHarness from './service-item.test-harness.svelte';
import type { ServicesQuery } from '$lib/graphql/types/graphql';

const { toastErrorMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn(),
}));

vi.mock('svelte-sonner', () => ({
  toast: {
    error: toastErrorMock,
  },
}));

type Service = NonNullable<ServicesQuery['services']>[number];

const periodService: Extract<Service, { __typename: 'ServicePeriod' }> = {
  __typename: 'ServicePeriod',
  type: 'RADIO_GENERIC',
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
      interval: 'ONE_WEEK',
    },
    {
      basePrice: 200,
      extraPrice: 100,
      firstExtraPrice: 150,
      interval: 'ONE_MONTH',
    },
  ],
};

const narrativeService: Extract<Service, { __typename: 'ServiceNarrative' }> = {
  __typename: 'ServiceNarrative',
  type: 'NARRATIVE',
  name: 'NARRACION',
  serviceId: 2,
  basePrice: 300,
  extraPrice: 0,
  firstExtraPrice: 0,
  rolePrice: 50,
};

const renderServiceItem = (
  service: Service,
  onAddPiece: (
    pieceName: string,
    svc: Service,
    options: unknown,
  ) => void = vi.fn(),
) =>
  render(ServiceItemHarness, {
    props: {
      service,
      onAddPiece,
    },
  });

const selectPeriod = async (price = '100') => {
  await fireEvent.click(screen.getAllByRole('button', { name: price })[0]);
};

const openAccordion = async (serviceName: string) => {
  const trigger = screen.getByRole('button', { name: new RegExp(serviceName) });
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

describe('ServiceItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a toast when adding a piece without a name', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(periodService, onAddPiece);

    await selectPeriod();
    await openAccordion(periodService.name);
    await clickAddPiece();

    expect(toastErrorMock).toHaveBeenCalledWith('Error al agregar un medio', {
      description: 'La pieza debe tener un nombre',
    });
    expect(onAddPiece).not.toHaveBeenCalled();
  });

  it('calls onAddPiece with an empty period when no duration was selected', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(periodService, onAddPiece);

    await openAccordion(periodService.name);
    await fillPieceName('Spot matutino');
    await clickAddPiece();

    expect(onAddPiece).toHaveBeenCalledWith('Spot matutino', periodService, {
      period: '',
      isInterior: false,
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it('calls onAddPiece with period options for period services', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(periodService, onAddPiece);

    await selectPeriod();
    await openAccordion(periodService.name);
    await fillPieceName('Spot matutino');
    await fireEvent.click(screen.getByLabelText('Descuento interior (-70%)'));
    await clickAddPiece();

    expect(onAddPiece).toHaveBeenCalledWith('Spot matutino', periodService, {
      period: 'ONE_WEEK',
      isInterior: true,
    });
  });

  it('calls onAddPiece with narrative options for narrative services', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(narrativeService, onAddPiece);

    await openAccordion(narrativeService.name);
    await fillPieceName('Cuña informativa');
    await fireEvent.input(screen.getByPlaceholderText('Minutos'), {
      target: { value: '5' },
    });
    await clickAddPiece();

    expect(onAddPiece).toHaveBeenCalledWith(
      'Cuña informativa',
      narrativeService,
      expect.objectContaining({
        minutes: 5,
        extraRoles: 0,
        isNonCommercial: false,
        onInternet: false,
        hasLipSync: false,
        priceOverride: null,
      }),
    );
  });
});
