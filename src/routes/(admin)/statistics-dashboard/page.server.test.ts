import { describe, expect, it } from 'vitest';
import { load } from './+page.server';

describe('+page.server load', () => {
  it('devuelve el token presente en locals', async () => {
    const result = await load({ locals: { token: 'abc123' } } as any);
    expect(result).toEqual({ token: 'abc123' });
  });

  it('devuelve undefined como token si locals no lo tiene', async () => {
    const result = await load({ locals: {} } as any);
    expect(result).toEqual({ token: undefined });
  });
});
