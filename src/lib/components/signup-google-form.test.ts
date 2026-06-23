import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignupGoogleForm from './signup-google-form.svelte';

const { enhanceMock, fetchCountriesMock, fetchDepartmentsMock, gotoMock } =
  vi.hoisted(() => ({
    enhanceMock: vi.fn(() => ({ destroy: vi.fn() })),
    fetchCountriesMock: vi.fn(),
    fetchDepartmentsMock: vi.fn(),
    gotoMock: vi.fn(),
  }));

vi.mock('$app/forms', () => ({
  enhance: enhanceMock,
}));

vi.mock('$app/navigation', () => ({
  goto: gotoMock,
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
      { countryCode: 'UY ', name: 'Uruguay' },
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

const renderSignupGoogleForm = () =>
  render(SignupGoogleForm, {
    form: null,
    data: {
      pendingData: {
        firstName: 'Ada',
        lastName: 'Lovelace',
      },
    },
    use: null,
  });

describe('SignupGoogleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCountriesMock.mockResolvedValue(countriesResult);
    fetchDepartmentsMock.mockResolvedValue(departmentsResult);
  });

  it('renders the account type chooser by default', () => {
    renderSignupGoogleForm();

    expect(screen.getByText(/tipo de cuenta deseas crear/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agencia' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Locutor' })).toBeInTheDocument();
  });

  it('renders the client form with Google names prefilled', async () => {
    const { container } = renderSignupGoogleForm();

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    expect(screen.getByText(/Registro cliente/)).toBeInTheDocument();
    expect(container.querySelector('form')).toHaveAttribute('method', 'POST');
    expect(container.querySelector('form')).toHaveAttribute(
      'action',
      '/login/signup-google',
    );
    expect(container.querySelector('input[name="accountType"]')).toHaveValue(
      'client',
    );
    expect(screen.getByPlaceholderText('Nombre')).toHaveValue('Ada');
    expect(screen.getByPlaceholderText('Apellido')).toHaveValue('Lovelace');
    expect(screen.getByPlaceholderText('RUT')).toBeRequired();
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
    expect(enhanceMock).toHaveBeenCalledOnce();
  });

  it('renders the broadcaster form without agency field', async () => {
    const { container } = renderSignupGoogleForm();

    await fireEvent.click(screen.getByRole('button', { name: 'Locutor' }));

    expect(screen.getByText(/Registro locutor/)).toBeInTheDocument();
    expect(container.querySelector('input[name="accountType"]')).toHaveValue(
      'broadcaster',
    );
    expect(screen.queryByPlaceholderText('Agencia')).not.toBeInTheDocument();
  });

  it('loads countries and departments for the selects', async () => {
    renderSignupGoogleForm();

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    await waitFor(() => {
      expect(fetchDepartmentsMock).toHaveBeenCalledWith('UY ');
      expect(fetchCountriesMock).toHaveBeenCalled();
      expect(screen.getByText('Uruguay')).toBeInTheDocument();
    });
    expect(screen.getByText('Selecciona un departamento')).toBeInTheDocument();
  });

  it('returns to the account type chooser from the form', async () => {
    renderSignupGoogleForm();

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
    renderSignupGoogleForm();

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));
    await submitCallbackFactory?.()({
      result: {
        type: 'failure',
        data: { messages: ['Cuenta no válida', 'RUT inválido'] },
      },
      update: vi.fn(),
    });
    await tick();

    expect(screen.getByText('Error en el registro')).toBeInTheDocument();
    expect(screen.getByText('Cuenta no válida')).toBeInTheDocument();
    expect(screen.getByText('RUT inválido')).toBeInTheDocument();
  });

  it('renders a generic message when enhanced failure has no messages', async () => {
    let submitCallbackFactory:
      | (() => (event: unknown) => Promise<void>)
      | undefined;
    enhanceMock.mockImplementation((_form, callbackFactory) => {
      submitCallbackFactory = callbackFactory;
      return { destroy: vi.fn() };
    });
    renderSignupGoogleForm();

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));
    await submitCallbackFactory?.()({
      result: {
        type: 'failure',
        data: {},
      },
      update: vi.fn(),
    });
    await tick();

    expect(
      screen.getByText('Ocurrió un error inesperado. Inténtalo de nuevo.'),
    ).toBeInTheDocument();
  });
});
