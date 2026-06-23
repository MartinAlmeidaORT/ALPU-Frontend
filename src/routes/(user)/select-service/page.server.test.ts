import { describe, expect, it } from 'vitest';
import { load } from './+page.server';

describe('/select-service load', () => {
  it('returns session user data from locals', async () => {
    const user = {
      userId: 1,
      firstName: 'Ada',
      lastName: 'Radio',
      __typename: 'Broadcaster',
    };

    await expect(
      load({
        locals: {
          user,
          token: 'session-token',
          rol: 'Broadcaster',
        },
      } as never),
    ).resolves.toEqual({
      user,
      token: 'session-token',
      rol: 'Broadcaster',
    });
  });
});
