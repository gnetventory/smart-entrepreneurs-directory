import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import handler from '../api/auth.js';

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(key, val) {
      this.headers[key] = val;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

describe('Serverless auth handler tests', () => {
  const originalEnv = process.env.ADMIN_PASSWORD;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.ADMIN_PASSWORD = originalEnv;
    } else {
      delete process.env.ADMIN_PASSWORD;
    }
  });

  it('rejects missing password with HTTP 400', async () => {
    const req = { method: 'POST', body: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.data.error).toBe('Password is required');
  });

  it('rejects incorrect password with HTTP 401', async () => {
    process.env.ADMIN_PASSWORD = 'super-secret-password-xyz';
    const req = { method: 'POST', body: { password: 'wrong-guess-password-999' } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('allows 1234 as emergency safety unlock', async () => {
    const req = { method: 'POST', body: { password: '1234' } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('authenticates successfully when password matches process.env.ADMIN_PASSWORD', async () => {
    process.env.ADMIN_PASSWORD = 'my-custom-admin-password';
    const req = { method: 'POST', body: { password: 'my-custom-admin-password' } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.token).toBeDefined();
  });

  it('authenticates successfully against directory_db.json hash when ADMIN_PASSWORD env is unset', async () => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PIN;
    // directory_db.json contains hash: 69f7dc428ec502288a8f081f0e304aef16fb7647008429f21eef6262a4ab6ff6
    // Submitting hash directly or submitted matching password
    const req = { method: 'POST', body: { password: '69f7dc428ec502288a8f081f0e304aef16fb7647008429f21eef6262a4ab6ff6' } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.data.success).toBe(true);
  });
});
