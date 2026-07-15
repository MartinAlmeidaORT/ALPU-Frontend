import type { ServicesQuery } from '$lib/graphql/types/graphql';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ServiceItemHarness from './service-item.test-harness.svelte';

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
  serviceId: 1,
  type: 'RADIO_GENERIC',
  name: 'RADIO SPOT GENERICO',
  basePrice: 100,
  extraPrice: 50,
  firstExtraPrice: 75,
  periods: [
    {
      interval: 'ONE_WEEK',
      basePrice: 100,
      extraPrice: 50,
      firstExtraPrice: 75,
    },
    {
      interval: 'ONE_MONTH',
      basePrice: 200,
      extraPrice: 100,
      firstExtraPrice: 150,
    },
  ],
};

const cameraService: Extract<Service, { __typename: 'ServicePeriod' }> = {
  ...periodService,
  serviceId: 2,
  type: 'CAMERA',
  name: 'LOCUCION A CAMARA',
};

const narrativeService: Extract<Service, { __typename: 'ServiceNarrative' }> = {
  __typename: 'ServiceNarrative',
  serviceId: 3,
  type: 'NARRATIVE',
  name: 'NARRACION',
  basePrice: 300,
  extraPrice: 0,
  firstExtraPrice: 0,
  rolePrice: 50,
};

const ivrService: Extract<Service, { __typename: 'ServiceIvr' }> = {
  __typename: 'ServiceIvr',
  serviceId: 4,
  type: 'IVR',
  name: 'IVR',
  basePrice: 250,
  extraPrice: 0,
  firstExtraPrice: 0,
  messagePrice: 40,
  updatePrice: 25,
};

const eventService: Extract<Service, { __typename: 'ServiceDate' }> = {
  __typename: 'ServiceDate',
  serviceId: 5,
  type: 'EVENT',
  name: 'MAESTRO DE CEREMONIAS',
  basePrice: 500,
  extraPrice: 0,
  firstExtraPrice: 0,
};

const renderServiceItem = (service: Service, onAddPiece = vi.fn()) =>
  render(ServiceItemHarness, {
    props: {
      service,
      onAddPiece,
    },
  });

const fillPieceName = async (name: string) => {
  await fireEvent.input(screen.getByPlaceholderText('Nombre de la pieza'), {
    target: { value: name },
  });
};

const ensureContentOpen = async (serviceName: string) => {
  if (screen.queryByRole('button', { name: 'Agregar' })) return;

  await fireEvent.click(
    screen.getByRole('button', {
      name: new RegExp(serviceName, 'i'),
    }),
  );
};

const clickAdd = async () => {
  await fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
};

describe('ServiceItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a period service with prices, subsequent prices and piece name input', () => {
    renderServiceItem(periodService);

    expect(screen.getByText('RADIO SPOT GENERICO')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$100' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$200' })).toBeInTheDocument();
    expect(screen.getByText('Subsiguiente')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getAllByText('$100')).toHaveLength(2);
    expect(
      screen.getByPlaceholderText('Nombre de la pieza'),
    ).toBeInTheDocument();
  });

  it('shows a toast and does not add when the piece has no name', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(periodService, onAddPiece);

    await fireEvent.click(screen.getByRole('button', { name: '$100' }));
    await ensureContentOpen(periodService.name);
    await clickAdd();

    expect(toastErrorMock).toHaveBeenCalledWith('Error al agregar un medio', {
      description: 'La pieza debe tener un nombre',
    });
    expect(onAddPiece).not.toHaveBeenCalled();
  });

  it('adds a period service with selected period and interior discount', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(periodService, onAddPiece);

    await fireEvent.click(screen.getByRole('button', { name: '$100' }));
    await ensureContentOpen(periodService.name);
    await fireEvent.click(screen.getByLabelText('Descuento interior (-70%)'));
    await fillPieceName('Spot matutino');
    await clickAdd();

    expect(onAddPiece).toHaveBeenCalledWith('Spot matutino', periodService, {
      period: 'ONE_WEEK',
      isInterior: true,
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Nombre de la pieza')).toHaveValue('');
    expect(
      screen.getByLabelText('Descuento interior (-70%)'),
    ).not.toBeChecked();
  });

  it('adds a camera service with internal use option', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(cameraService, onAddPiece);

    await fireEvent.click(screen.getByRole('button', { name: '$200' }));
    await ensureContentOpen(cameraService.name);
    await fireEvent.click(screen.getByLabelText('Para uso interno'));
    await fillPieceName('Camara institucional');
    await clickAdd();

    expect(onAddPiece).toHaveBeenCalledWith(
      'Camara institucional',
      cameraService,
      {
        period: 'ONE_MONTH',
        forInternalUse: true,
      },
    );
  });

  it('requires a date for narrative services before adding', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(narrativeService, onAddPiece);

    await fillPieceName('Cuna informativa');
    await fireEvent.input(screen.getByPlaceholderText('Minutos'), {
      target: { value: '5' },
    });
    await clickAdd();

    expect(toastErrorMock).toHaveBeenCalledWith('Error al agregar un medio', {
      description: 'Debe seleccionar una fecha',
    });
    expect(onAddPiece).not.toHaveBeenCalled();
  });

  it('requires a date for IVR services before adding', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(ivrService, onAddPiece);

    await fillPieceName('Mensaje IVR');
    await fireEvent.input(screen.getByPlaceholderText('Ingrese su mensaje'), {
      target: { value: 'Gracias por llamar' },
    });
    await clickAdd();

    expect(toastErrorMock).toHaveBeenCalledWith('Error al agregar un medio', {
      description: 'Debe seleccionar una fecha',
    });
    expect(onAddPiece).not.toHaveBeenCalled();
  });

  it('requires a date for event services before adding', async () => {
    const onAddPiece = vi.fn();
    renderServiceItem(eventService, onAddPiece);

    await fireEvent.click(screen.getByLabelText(/medios masivos/));
    await fillPieceName('Evento lanzamiento');
    await clickAdd();

    expect(toastErrorMock).toHaveBeenCalledWith('Error al agregar un medio', {
      description: 'Debe seleccionar una fecha',
    });
    expect(onAddPiece).not.toHaveBeenCalled();
  });
});
