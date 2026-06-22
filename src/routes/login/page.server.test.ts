import { describe, expect, it } from 'vitest';
import { load } from './+page.server';

describe('/login load', () => {
  it('returns pendingState true when the query param is true', async () => {
    const result = await load({
      url: new URL('http://localhost/login?pendingState=true'),
    } as never);

    expect(result).toEqual({ pendingState: true });
  });

  it('returns pendingState false when the query param is missing or different', async () => {
    await expect(
      load({ url: new URL('http://localhost/login') } as never),
    ).resolves.toEqual({ pendingState: false });

    await expect(
      load({ url: new URL('http://localhost/login?pendingState=false') } as never),
    ).resolves.toEqual({ pendingState: false });
  });
});
