import { ServiceType, type ServiceNarrative } from '$lib/graphql/schema';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Harness from './service-detail-components.test-harness.svelte';

const narrativeService: ServiceNarrative = {
  __typename: 'ServiceNarrative',
  serviceId: 8,
  type: ServiceType.Narrative,
  name: 'NARRACION',
  basePrice: 300,
  extraPrice: 0,
  firstExtraPrice: 0,
  rolePrice: 50,
};

const renderNarrative = (handleAddPiece = vi.fn()) =>
  render(Harness, {
    props: {
      kind: 'narrative',
      service: narrativeService,
      handleAddPiece,
    },
  });

describe('ServiceNarrative', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders base price, core options and add button', () => {
    renderNarrative();

    expect(screen.getByText('NARRACION')).toBeInTheDocument();
    expect(screen.getByText('Hasta 3 minutos $300')).toBeInTheDocument();
    expect(screen.getByLabelText('Contenido no comercial (-20%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Sincro labial (+20%)')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /internet/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('binds booleans, minutes and piece name', async () => {
    renderNarrative();

    await fireEvent.click(screen.getByLabelText('Contenido no comercial (-20%)'));
    await fireEvent.click(screen.getByLabelText('Sincro labial (+20%)'));
    await fireEvent.click(screen.getByRole('checkbox', { name: /internet/i }));
    await fireEvent.input(screen.getByPlaceholderText('Nombre de la pieza'), {
      target: { value: 'Narracion institucional' },
    });
    await fireEvent.input(screen.getByPlaceholderText('Minutos'), {
      target: { value: '5' },
    });

    expect(screen.getByLabelText('non-commercial-content')).toHaveTextContent('true');
    expect(screen.getByLabelText('lip-sync')).toHaveTextContent('true');
    expect(screen.getByLabelText('internet-broadcast')).toHaveTextContent('true');
    expect(screen.getByLabelText('piece-name')).toHaveTextContent(
      'Narracion institucional',
    );
    expect(screen.getByLabelText('narrative-minutes')).toHaveTextContent('5');
  });

  it('reveals and binds suggested price and extra roles', async () => {
    renderNarrative();

    await fireEvent.click(screen.getByLabelText('Sugerir precio'));
    await fireEvent.input(screen.getByPlaceholderText('Precio sugerido'), {
      target: { value: '750' },
    });
    await fireEvent.click(screen.getByLabelText('Roles extra'));
    await fireEvent.input(screen.getByPlaceholderText('Roles extra'), {
      target: { value: '2' },
    });

    expect(screen.getByLabelText('is-price-suggested')).toHaveTextContent('true');
    expect(screen.getByLabelText('price-suggested')).toHaveTextContent('750');
    expect(screen.getByLabelText('is-extra-roles')).toHaveTextContent('true');
    expect(screen.getByLabelText('extra-roles')).toHaveTextContent('2');
  });

  it('calls handleAddPiece from the add button', async () => {
    const handleAddPiece = vi.fn();
    renderNarrative(handleAddPiece);

    await fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(handleAddPiece).toHaveBeenCalledOnce();
  });
});
