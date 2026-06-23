import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

const { gotoMock } = vi.hoisted(() => ({
  gotoMock: vi.fn(),
}));

vi.mock('$app/navigation', () => ({
  goto: gotoMock,
}));

const data = {
  token: 'session-token',
};

describe('/contract-preview page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('redirects home when there is no preview data', async () => {
    render(Page, { props: { data } });

    await waitFor(() => {
      expect(gotoMock).toHaveBeenCalledWith('/');
    });
  });

  it('renders a pdf preview and clears the stored preview data', async () => {
    sessionStorage.setItem(
      'contractPreview',
      JSON.stringify({ pdfUrl: 'https://example.com/contract.pdf' }),
    );
    sessionStorage.setItem('contractId', '12');

    render(Page, { props: { data } });

    const frame = await screen.findByTitle('Visor de PDF');
    expect(frame).toHaveAttribute('src', 'https://example.com/contract.pdf');
    expect(sessionStorage.getItem('contractPreview')).toBeNull();
    expect(gotoMock).not.toHaveBeenCalled();
  });

  it('navigates back to select service from the preview', async () => {
    sessionStorage.setItem(
      'contractPreview',
      JSON.stringify({ pdfUrl: 'https://example.com/contract.pdf' }),
    );
    sessionStorage.setItem('contractId', '12');

    render(Page, { props: { data } });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Volver' }),
    );

    expect(gotoMock).toHaveBeenCalledWith('/select-service');
  });
});
