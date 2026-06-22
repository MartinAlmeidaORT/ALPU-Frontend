import { describe, expect, it, vi } from 'vitest';
import { actions } from './+page.server';

describe('/auth/logout action', () => {
  it('deletes the session cookie and redirects to login', async () => {
    const cookies = {
      delete: vi.fn(),
    };

    await expect(
      actions.default({ cookies } as never),
    ).rejects.toMatchObject({
      status: 303,
      location: '/login',
    });

    expect(cookies.delete).toHaveBeenCalledWith('session_id', { path: '/' });
  });
});
