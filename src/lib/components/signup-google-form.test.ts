import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignupGoogleForm from './signup-google-form.svelte';

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

describe('SignupGoogleForm (clean version)', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fetchCountriesMock.mockResolvedValue(countriesResult);
    fetchDepartmentsMock.mockResolvedValue(departmentsResult);
  });

  it('renders account chooser', () => {
    render(SignupGoogleForm, {
      form: null,
      data: { pendingData: { firstName: 'Ada', lastName: 'Lovelace' } },
      use: null,
    });

    expect(
      screen.getByText(/tipo de cuenta deseas crear/i),
    ).toBeInTheDocument();
  });

  it('loads countries on mount', async () => {
    render(SignupGoogleForm, {
      form: null,
      data: { pendingData: { firstName: 'Ada', lastName: 'Lovelace' } },
      use: null,
    });

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

  it('prefills google data', async () => {
    render(SignupGoogleForm, {
      form: null,
      data: { pendingData: { firstName: 'Ada', lastName: 'Lovelace' } },
      use: null,
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    expect(screen.getByPlaceholderText('Nombre')).toHaveValue('Ada');
    expect(screen.getByPlaceholderText('Apellido')).toHaveValue('Lovelace');
  });

  it('shows signup form after selecting account type', async () => {
    render(SignupGoogleForm, {
      form: null,
      data: { pendingData: { firstName: 'Ada', lastName: 'Lovelace' } },
      use: null,
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));

    expect(screen.getByText(/registro cliente/i)).toBeInTheDocument();
  });

  it('fetches departments when country is selected', async () => {
    render(SignupGoogleForm, {
      form: null,
      data: { pendingData: { firstName: 'Ada', lastName: 'Lovelace' } },
      use: null,
    });

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

  it('returns to account chooser', async () => {
    render(SignupGoogleForm, {
      form: null,
      data: { pendingData: { firstName: 'Ada', lastName: 'Lovelace' } },
      use: null,
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Agencia' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Volver' }));

    expect(
      screen.getByText(/tipo de cuenta deseas crear/i),
    ).toBeInTheDocument();
  });
});
