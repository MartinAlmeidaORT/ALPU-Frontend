import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignupForm from './signup-form.svelte';

const {
  enhanceMock,
  fetchCountriesMock,
  fetchDepartmentsMock,
  gotoMock,
  invalidateAllMock,
} = vi.hoisted(() => ({
  enhanceMock: vi.fn(() => ({ destroy: vi.fn() })),
  fetchCountriesMock: vi.fn(),
  fetchDepartmentsMock: vi.fn(),
  gotoMock: vi.fn(),
  invalidateAllMock: vi.fn(),
}));

vi.mock('$app/forms', () => ({
  enhance: enhanceMock,
}));

vi.mock('$app/navigation', () => ({
  goto: gotoMock,
  invalidateAll: invalidateAllMock,
}));

vi.mock('$lib/graphql/queries/country', () => ({
  fetchCountries: fetchCountriesMock,
}));

vi.mock('$lib/graphql/queries/department', () => ({
  fetchDepartments: fetchDepartmentsMock,
}));

const countriesResult = {
  data: {
    countries: [
      { countryCode: 'UY', name: 'Uruguay' },
      { countryCode: 'AR', name: 'Argentina' },
    ],
  },
};

const departmentsResult = {
  data: {
    departments: [
      { departmentId: 1, name: 'Montevideo' },
      { departmentId: 2, name: 'Canelones' },
    ],
  },
};

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCountriesMock.mockResolvedValue(countriesResult);
    fetchDepartmentsMock.mockResolvedValue(departmentsResult);
  });

  it('renders the account type chooser by default', () => {
    render(SignupForm, { form: null });

    expect(screen.getByText(/tipo de cuenta deseas crear/)).toBeInTheDocument();
    expect(screen.getByText(/Selecciona una opci/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agencia' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Locutor' })).toBeInTheDocument();
  });

  it('renders the client signup form after choosing Agencia', async () => {
    const { container } = render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    expect(screen.getByText(/Registro cliente/)).toBeInTheDocument();
    expect(screen.getByText(/Ingresa tu informaci/)).toBeInTheDocument();
    expect(container.querySelector('form')).toHaveAttribute('method', 'POST');
    expect(container.querySelector('form')).toHaveAttribute(
      'action',
      '/auth/signup',
    );
    expect(container.querySelector('input[name="accountType"]')).toHaveValue(
      'client',
    );
    expect(screen.getByPlaceholderText('Nombre')).toBeRequired();
    expect(screen.getByPlaceholderText('Apellido')).toBeRequired();
    expect(screen.getByPlaceholderText('email@example.com')).toHaveAttribute(
      'type',
      'email',
    );
    expect(screen.getByPlaceholderText('Contraseña')).toHaveAttribute(
      'minlength',
      '10',
    );
    expect(screen.getByPlaceholderText('RUT')).toHaveAttribute(
      'maxlength',
      '12',
    );
    expect(screen.getByPlaceholderText('Agencia')).toBeRequired();
    expect(screen.getByPlaceholderText('Ciudad')).toHaveAttribute(
      'pattern',
      '[A-Za-z]+',
    );
    expect(screen.getByPlaceholderText('Calle')).toBeRequired();
    expect(screen.getByRole('button', { name: 'Crear' })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(screen.getByRole('button', { name: 'Volver' })).toHaveAttribute(
      'type',
      'button',
    );
    expect(enhanceMock).toHaveBeenCalledOnce();
  });

  it('renders the broadcaster signup form without the agency field', async () => {
    const { container } = render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Locutor' }));

    expect(screen.getByText(/Registro locutor/)).toBeInTheDocument();
    expect(container.querySelector('input[name="accountType"]')).toHaveValue(
      'broadcaster',
    );
    expect(screen.queryByPlaceholderText('Agencia')).not.toBeInTheDocument();
  });

  it('loads countries and departments for the selects', async () => {
    render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    await waitFor(() => {
      expect(fetchDepartmentsMock).toHaveBeenCalledWith('UY');
      expect(fetchCountriesMock).toHaveBeenCalled();
      expect(screen.getByText('Uruguay')).toBeInTheDocument();
    });
    expect(screen.getByText('Selecciona departamento')).toBeInTheDocument();
  });

  it('returns to the account type chooser from the form', async () => {
    render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Volver' }));

    expect(screen.getByText(/tipo de cuenta deseas crear/)).toBeInTheDocument();
    expect(screen.queryByText(/Registro cliente/)).not.toBeInTheDocument();
  });

  it('renders action failure messages returned by enhance', async () => {
    let submitCallbackFactory:
      | (() => (event: unknown) => Promise<void>)
      | undefined;
    enhanceMock.mockImplementation((_form, callbackFactory) => {
      submitCallbackFactory = callbackFactory;
      return { destroy: vi.fn() };
    });
    render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));
    await submitCallbackFactory?.()({
      result: {
        type: 'failure',
        data: { messages: ['Cuenta no válida', 'Email ya registrado'] },
      },
      update: vi.fn(),
    });
    await tick();

    expect(screen.getByText('Error en el registro')).toBeInTheDocument();
    expect(
      screen.getByText('Por favor verifique los siguientes datos.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Cuenta no válida')).toBeInTheDocument();
    expect(screen.getByText('Email ya registrado')).toBeInTheDocument();
    expect(invalidateAllMock).not.toHaveBeenCalled();
  });

  it('clears the selected account type after a successful enhanced submit', async () => {
    let submitCallbackFactory:
      | (() => (event: unknown) => Promise<void>)
      | undefined;
    enhanceMock.mockImplementation((_form, callbackFactory) => {
      submitCallbackFactory = callbackFactory;
      return { destroy: vi.fn() };
    });
    render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));
    await submitCallbackFactory?.()({
      result: { type: 'success' },
      update: vi.fn(),
    });
    await tick();

    expect(invalidateAllMock).toHaveBeenCalledOnce();
    expect(screen.getByText(/tipo de cuenta deseas crear/)).toBeInTheDocument();
  });
});
