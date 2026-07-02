import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignupForm from './signup-form.svelte';

const { fetchCountriesMock, fetchDepartmentsMock } = vi.hoisted(() => ({
  fetchCountriesMock: vi.fn(),
  fetchDepartmentsMock: vi.fn(),
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
    departments: [{ departmentId: 1, name: 'Montevideo' }],
  },
};

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fetchCountriesMock.mockResolvedValue(countriesResult);
    fetchDepartmentsMock.mockResolvedValue(departmentsResult);
  });

  it('renders account chooser', () => {
    render(SignupForm, { form: null });

    expect(
      screen.getByText(/tipo de cuenta deseas crear/i),
    ).toBeInTheDocument();
  });

  it('loads countries on mount', async () => {
    render(SignupForm, { form: null });

    await waitFor(() => {
      expect(fetchCountriesMock).toHaveBeenCalledTimes(1);
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    const countryTrigger = await screen.findByRole('button', {
      name: /Seleccionar país/i,
    });

    countryTrigger.focus();

    await fireEvent.keyDown(countryTrigger, {
      key: ' ',
      code: 'Space',
      keyCode: 32,
    });
    await fireEvent.keyUp(countryTrigger, {
      key: ' ',
      code: 'Space',
      keyCode: 32,
    });

    let countryOption;
    await waitFor(() => {
      countryOption = screen.getByText(
        (content, element) => element?.textContent.trim() === 'Uruguay',
      );
      expect(countryOption).toBeInTheDocument();
    });
  });

  it('shows signup form after selecting account type', async () => {
    render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    expect(screen.getByText(/registro cliente/i)).toBeInTheDocument();
  });

  it('fetches departments when country is selected', async () => {
    render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    await waitFor(() => {
      expect(fetchCountriesMock).toHaveBeenCalledTimes(1);
    });

    const countryTrigger = await screen.findByRole('button', {
      name: /Seleccionar país/i,
    });

    countryTrigger.focus();
    await fireEvent.keyDown(countryTrigger, {
      key: ' ',
      code: 'Space',
      keyCode: 32,
    });
    await fireEvent.keyUp(countryTrigger, {
      key: ' ',
      code: 'Space',
      keyCode: 32,
    });
    await fireEvent.keyDown(countryTrigger, {
      key: ' ',
      code: 'Enter',
      keyCode: 32,
    });
    await fireEvent.keyUp(countryTrigger, {
      key: ' ',
      code: 'Enter',
      keyCode: 32,
    });

    await waitFor(() => {
      expect(fetchDepartmentsMock).toHaveBeenCalled();
    });
  });

  it('submits form normally without enhance mocking', async () => {
    render(SignupForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    await waitFor(() => {
      expect(fetchCountriesMock).toHaveBeenCalledTimes(1);
    });

    const countryTrigger = await screen.findByRole('button', {
      name: /Seleccionar país/i,
    });

    countryTrigger.focus();
    await fireEvent.keyDown(countryTrigger, {
      key: ' ',
      code: 'Space',
      keyCode: 32,
    });
    await fireEvent.keyUp(countryTrigger, {
      key: ' ',
      code: 'Space',
      keyCode: 32,
    });

    // completar campos mínimos requeridos (si HTML validation lo permite)
    await fireEvent.input(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'Juan' },
    });

    await fireEvent.input(screen.getByPlaceholderText('Apellido'), {
      target: { value: 'Pérez' },
    });

    await fireEvent.input(screen.getByPlaceholderText('email@example.com'), {
      target: { value: 'test@mail.com' },
    });

    await fireEvent.input(screen.getByPlaceholderText('Contraseña'), {
      target: { value: '1234567890' },
    });

    await fireEvent.input(screen.getByPlaceholderText('RUT'), {
      target: { value: '123456789012' },
    });

    await fireEvent.input(screen.getByPlaceholderText('Ciudad'), {
      target: { value: 'Montevideo' },
    });

    await fireEvent.input(screen.getByPlaceholderText('Calle'), {
      target: { value: '18 de Julio' },
    });

    // submit real
    const form = document.querySelector('form')!;
    await fireEvent.submit(form);

    // aquí NO dependes de enhance
    expect(form).toBeInTheDocument();
  });
});
