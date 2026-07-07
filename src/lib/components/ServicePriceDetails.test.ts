import { ServiceType } from '$lib/graphql/schema';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ServicePriceDetails from './ServicePriceDetails.svelte';

const baseService = {
  serviceName: 'Radio generico',
  serviceType: ServiceType.RadioGeneric,
  beforeDiscount: 1000,
  subTotal: 850,
  pieces: [
    {
      name: 'Spot manana',
      price: 500,
    },
    {
      name: 'Spot tarde',
      price: 450,
    },
  ],
  adjustments: [
    {
      name: 'Descuento interior',
      applyDiscount: -150,
    },
  ],
};

const renderPriceDetails = (
  service = baseService,
  onRemoveService = vi.fn(),
  onRemovePiece = vi.fn(),
) =>
  render(ServicePriceDetails, {
    props: {
      service,
      onRemoveService,
      onRemovePiece,
    },
  });

describe('ServicePriceDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pieces, service name, adjustments and subtotal', () => {
    renderPriceDetails();

    expect(screen.getByText('Medio')).toBeInTheDocument();
    expect(screen.getByText('Nombre de pieza: Spot manana')).toBeInTheDocument();
    expect(screen.getByText('Precio sin descuento: $500')).toBeInTheDocument();
    expect(screen.getByText('Nombre de pieza: Spot tarde')).toBeInTheDocument();
    expect(screen.getByText('Precio sin descuento: $450')).toBeInTheDocument();
    expect(screen.getByText('Nombre del servicio: Radio generico')).toBeInTheDocument();
    expect(screen.getByText('Descuentos del medio')).toBeInTheDocument();
    expect(screen.getByText('Descuento interior de un total de $ 150')).toBeInTheDocument();
    expect(screen.getByText('Total medio $850')).toBeInTheDocument();
  });

  it('calls onRemovePiece with the clicked piece index when there is more than one piece', async () => {
    const onRemovePiece = vi.fn();
    renderPriceDetails(baseService, vi.fn(), onRemovePiece);

    const [, secondRemovePieceButton] = screen.getAllByRole('button');
    await fireEvent.click(secondRemovePieceButton);

    expect(onRemovePiece).toHaveBeenCalledWith(1);
  });

  it('does not render piece remove buttons when there is only one piece', () => {
    renderPriceDetails({
      ...baseService,
      pieces: [baseService.pieces[0]],
    });

    expect(
      screen.getAllByRole('button'),
    ).toHaveLength(1);
  });

  it('calls onRemoveService from the delete service button', async () => {
    const onRemoveService = vi.fn();
    renderPriceDetails(baseService, onRemoveService);

    await fireEvent.click(screen.getByRole('button', { name: 'Eliminar medio' }));

    expect(onRemoveService).toHaveBeenCalledOnce();
  });

  it('uses beforeDiscount as piece price for IVR services', () => {
    renderPriceDetails({
      ...baseService,
      serviceName: 'IVR',
      serviceType: ServiceType.Ivr,
      beforeDiscount: 1200,
      pieces: [
        {
          name: 'Mensaje inicial',
          price: 300,
        },
      ],
      adjustments: [],
    });

    expect(screen.getByText('Precio sin descuento: $1200')).toBeInTheDocument();
    expect(screen.queryByText('Precio sin descuento: $300')).not.toBeInTheDocument();
    expect(screen.queryByText('Descuentos del medio')).not.toBeInTheDocument();
  });

  it('uses beforeDiscount as piece price for narrative services', () => {
    renderPriceDetails({
      ...baseService,
      serviceName: 'Narracion',
      serviceType: ServiceType.Narrative,
      beforeDiscount: 700,
      pieces: [
        {
          name: 'Narracion institucional',
          price: 100,
        },
      ],
      adjustments: [],
    });

    expect(screen.getByText('Precio sin descuento: $700')).toBeInTheDocument();
    expect(screen.queryByText('Precio sin descuento: $100')).not.toBeInTheDocument();
  });
});
