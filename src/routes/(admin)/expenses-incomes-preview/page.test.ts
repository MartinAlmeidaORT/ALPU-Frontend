import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

const { gotoMock } = vi.hoisted(() => ({
  gotoMock: vi.fn(),
}));

vi.mock('$app/navigation', () => ({
  goto: gotoMock,
}));

describe('/expenses-incomes-preview page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('redirects back to expenses and incomes when there is no preview data', async () => {
    render(Page);

    await waitFor(() => {
      expect(gotoMock).toHaveBeenCalledWith('/expenses-incomes');
    });
  });

  it('renders an image preview and clears the stored preview data', async () => {
    sessionStorage.setItem(
      'billPreview',
      JSON.stringify({ proofFileUrl: 'https://example.com/receipt.png' }),
    );

    render(Page);

    const image = await screen.findByRole('img', { name: 'Comprobante' });
    expect(image).toHaveAttribute('src', 'https://example.com/receipt.png');
    expect(sessionStorage.getItem('billPreview')).toBeNull();
    expect(gotoMock).not.toHaveBeenCalled();
  });

  it('renders a document preview when the stored url is not an image', async () => {
    sessionStorage.setItem(
      'billPreview',
      JSON.stringify({ proofFileUrl: 'https://example.com/receipt.pdf' }),
    );

    render(Page);

    const frame = await screen.findByTitle('Visor de Comprobante');
    expect(frame).toHaveAttribute('src', 'https://example.com/receipt.pdf');
  });

  it('navigates back to expenses and incomes from the preview', async () => {
    sessionStorage.setItem(
      'billPreview',
      JSON.stringify({ proofFileUrl: 'https://example.com/receipt.png' }),
    );

    render(Page);

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Volver' }),
    );

    expect(gotoMock).toHaveBeenCalledWith('/expenses-incomes');
  });
});
