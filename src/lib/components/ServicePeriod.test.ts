import { ServiceType, type ServicePeriod } from '$lib/graphql/schema';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Harness from './service-detail-components.test-harness.svelte';

const radioService: ServicePeriod = {
  __typename: 'ServicePeriod',
  serviceId: 1,
  type: ServiceType.RadioGeneric,
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

const cameraService: ServicePeriod = {
  ...radioService,
  serviceId: 2,
  type: ServiceType.Camera,
  name: 'LOCUCIÃ“N A CÃMARA',
};

const renderPeriod = (service = radioService, handleAddPiece = vi.fn()) =>
  render(Harness, {
    props: {
      kind: 'period',
      service,
      handleAddPiece,
    },
  });

describe('ServicePeriod', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders service prices and subsequent prices', () => {
    renderPeriod();

    expect(screen.getByText('RADIO SPOT GENERICO')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$100' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$200' })).toBeInTheDocument();
    expect(screen.getByText('Subsiguiente')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getAllByText('$100')).toHaveLength(2);
  });

  it('updates selected period, interior discount and piece name', async () => {
    renderPeriod();

    await fireEvent.click(screen.getByRole('button', { name: '$200' }));
    await fireEvent.click(
      screen.getByRole('button', { name: /RADIO SPOT GENERICO/i }),
    );
    await fireEvent.click(screen.getByLabelText('Descuento interior (-70%)'));
    await fireEvent.input(screen.getByPlaceholderText('Nombre de la pieza'), {
      target: { value: 'Spot tarde' },
    });

    expect(screen.getByLabelText('selected-period')).toHaveTextContent(
      'ONE_MONTH',
    );
    expect(screen.getByLabelText('is-interior')).toHaveTextContent('true');
    expect(screen.getByLabelText('piece-name')).toHaveTextContent('Spot tarde');
  });

  it('calls handleAddPiece from the add button', async () => {
    const handleAddPiece = vi.fn();
    renderPeriod(radioService, handleAddPiece);

    await fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(handleAddPiece).toHaveBeenCalledOnce();
  });

  it('renders internal-use option for camera services', async () => {
    renderPeriod(cameraService);

    expect(screen.getByLabelText('Para uso interno')).toBeInTheDocument();

    await fireEvent.click(screen.getByLabelText('Para uso interno'));

    expect(screen.getByLabelText('internal-use')).toHaveTextContent('true');
  });
});
