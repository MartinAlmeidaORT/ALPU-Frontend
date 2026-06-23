import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginForm from './login-form.svelte';

const { enhanceMock, redirectToGoogleMock } = vi.hoisted(() => ({
  enhanceMock: vi.fn(() => ({ destroy: vi.fn() })),
  redirectToGoogleMock: vi.fn(),
}));

vi.mock('$app/forms', () => ({
  enhance: enhanceMock,
}));

vi.mock('$lib/auth/google', () => ({
  redirectToGoogle: redirectToGoogleMock,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form fields and actions', () => {
    const { container } = render(LoginForm, { form: null });

    const form = container.querySelector('form');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText(/Contrase/);

    expect(screen.getAllByText(/^Iniciar Sesi/)).toHaveLength(2);
    expect(screen.getByText(/Ingresa tu email y contrase/)).toBeInTheDocument();
    expect(form).toHaveAttribute('method', 'POST');
    expect(form).toHaveAttribute('action', '/auth/login');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toBeRequired();
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toBeRequired();
    expect(
      screen.getByRole('button', { name: /^Iniciar Sesi/ }),
    ).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('button', { name: /Google/ })).toBeInTheDocument();
    expect(enhanceMock).toHaveBeenCalledOnce();
  });

  it('renders server action messages when form has failures', () => {
    render(LoginForm, {
      form: {
        messages: ['Credenciales inválidas', 'Usuario pendiente de aprobación'],
      },
    });

    expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    expect(
      screen.getByText('Usuario pendiente de aprobación'),
    ).toBeInTheDocument();
  });

  it('does not render error messages when form is empty', () => {
    render(LoginForm, { form: null });

    expect(
      screen.queryByText('Credenciales inválidas'),
    ).not.toBeInTheDocument();
  });

  it('starts the Google login flow from the secondary button', async () => {
    render(LoginForm, { form: null });

    await fireEvent.click(screen.getByRole('button', { name: /Google/ }));

    expect(redirectToGoogleMock).toHaveBeenCalledOnce();
  });
});
