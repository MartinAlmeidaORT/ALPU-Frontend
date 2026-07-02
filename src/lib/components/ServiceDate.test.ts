import { ServiceType, type ServiceDate } from '$lib/graphql/schema';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Harness from './service-detail-components.test-harness.svelte';

const eventService: ServiceDate = {
  __typename: 'ServiceDate',
  serviceId: 5,
  type: ServiceType.Event,
  name: 'MAESTRO DE CEREMONIAS',
  basePrice: 500,
  extraPrice: 0,
  firstExtraPrice: 0,
};

const otherDateService: ServiceDate = {
  ...eventService,
  serviceId: 6,
  name: 'EVENTO SIMPLE',
};

const renderDate = (service = eventService, handleAddPiece = vi.fn()) =>
  render(Harness, {
    props: {
      kind: 'date',
      service,
      handleAddPiece,
    },
  });

describe('ServiceDate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders base price, date picker, piece name and add button', () => {
    renderDate();

    expect(screen.getByText('MAESTRO DE CEREMONIAS')).toBeInTheDocument();
    expect(screen.getByText('Precio base $500')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre de la pieza')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('shows and binds mass media option only for maestro de ceremonias', async () => {
    renderDate();

    await fireEvent.click(screen.getByLabelText(/medios masivos/));

    expect(screen.getByLabelText('broadcast-in-mass-media')).toHaveTextContent('true');
  });

  it('does not show mass media option for other date services', () => {
    renderDate(otherDateService);

    expect(screen.queryByLabelText(/medios masivos/)).not.toBeInTheDocument();
  });

  it('updates piece name and calls handleAddPiece', async () => {
    const handleAddPiece = vi.fn();
    renderDate(eventService, handleAddPiece);

    await fireEvent.input(screen.getByPlaceholderText('Nombre de la pieza'), {
      target: { value: 'Evento lanzamiento' },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(screen.getByLabelText('piece-name')).toHaveTextContent('Evento lanzamiento');
    expect(handleAddPiece).toHaveBeenCalledOnce();
  });
});
