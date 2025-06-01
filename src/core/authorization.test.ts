import { describe, it, expect } from 'vitest';
import { Authorization } from '@sentinel/core';

type TestPayload = {
  sub: string;
  role: string;
};

const config = {
  jwtSecret: 'test-secret',
  jwtExpiration: 1,
};

describe('Authorization', () => {
  const auth = new Authorization<TestPayload>(config);
    it('should generate a valid token', () => {
    const token = auth.generateToken({ sub: '123', role: 'admin' });
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it('should verify a valid token', () => {
    const payload = { sub: '123', role: 'admin' };
    const token = auth.generateToken(payload);
    const verified = auth.verifyToken(token);
    expect(verified).toMatchObject(payload);
  });

  it('should throw an error for an invalid token', () => {
    expect(() => auth.verifyToken('invalid.token.string')).toThrow('Invalid token');
  });


  it('should throw an error for an expired token', async () => {
    const shortLivedAuth = new Authorization<TestPayload>({
      jwtSecret: 'test-secret',
      jwtExpiration: 1/60, // token expires in 1 second
    });

    const payload = { sub: '123', role: 'admin' };
    const token = shortLivedAuth.generateToken(payload);

    // Wait 1.5 seconds to ensure token has expired
    await new Promise(res => setTimeout(res, 1500));

    expect(() => shortLivedAuth.verifyToken(token)).toThrow('Invalid token');
  });
});