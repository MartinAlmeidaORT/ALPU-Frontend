import { ServiceType, type ServiceIvr } from '$lib/graphql/schema';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Harness from './service-detail-components.test-harness.svelte';

const ivrService: ServiceIvr = {
  __typename: 'ServiceIvr',
  serviceId: 7,
  type: ServiceType.Ivr,
  name: 'IVR',
  basePrice: 250,
  extraPrice: 0,
  firstExtraPrice: 0,
  initialMessagePrice: 250,
  additionalMessagePrice: 40,
  updateMessagePrice: 25,
  rangeIvr: [],
};

const renderIVR = (handleAddPiece = vi.fn()) =>
  render(Harness, {
    props: {
      kind: 'ivr',
      service: ivrService,
      handleAddPiece,
    },
  });

describe('ServiceIVR', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders base price, toggles and message field', () => {
    renderIVR();

    expect(screen.getByText('IVR')).toBeInTheDocument();
    expect(screen.getByText('Precio mensaje inicial $250')).toBeInTheDocument();
    expect(screen.getByLabelText('Sugerir precio')).toBeInTheDocument();
    expect(screen.getByLabelText('Actualizar IVR')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensajes adicionales')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su mensaje')).toBeInTheDocument();
  });

  it('reveals and binds price, update and additional message inputs', async () => {
    renderIVR();

    await fireEvent.click(screen.getByLabelText('Sugerir precio'));
    await fireEvent.input(screen.getByRole('spinbutton'), {
      target: { value: '900' },
    });
    await fireEvent.click(screen.getByLabelText('Actualizar IVR'));
    await fireEvent.input(document.querySelector('#Updates7') as HTMLInputElement, {
      target: { value: '2' },
    });
    await fireEvent.click(screen.getByLabelText('Mensajes adicionales'));
    await fireEvent.input(
      document.querySelector('#additionalIvrMessages7') as HTMLInputElement,
      {
        target: { value: '3' },
      },
    );

    expect(screen.getByLabelText('is-price-suggested')).toHaveTextContent('true');
    expect(screen.getByLabelText('price-suggested')).toHaveTextContent('900');
    expect(screen.getByLabelText('can-ivr-update')).toHaveTextContent('true');
    expect(screen.getByLabelText('ivr-updates')).toHaveTextContent('2');
    expect(screen.getByLabelText('can-ivr-get-more-messages')).toHaveTextContent('true');
    expect(screen.getByLabelText('additional-ivr-message')).toHaveTextContent('3');
  });

  it('binds piece name and message, and calls handleAddPiece', async () => {
    const handleAddPiece = vi.fn();
    renderIVR(handleAddPiece);

    await fireEvent.input(screen.getByPlaceholderText('Nombre de la pieza'), {
      target: { value: 'Mensaje inicial' },
    });
    await fireEvent.input(screen.getByPlaceholderText('Ingrese su mensaje'), {
      target: { value: 'Gracias por llamar' },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(screen.getByLabelText('piece-name')).toHaveTextContent('Mensaje inicial');
    expect(screen.getByLabelText('ivr-message')).toHaveTextContent('Gracias por llamar');
    expect(handleAddPiece).toHaveBeenCalledOnce();
  });
});
