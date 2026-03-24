const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test-db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const app = require('../src/app');

const createTestServer = () => {
  const server = http.createServer(app);

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`
      });
    });
  });
};

test('GET /health returns service status', async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const response = await fetch(`${baseUrl}/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.match(payload.message, /healthy/i);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/clients validates payload', async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/clients`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: '',
        phone: '123',
        email: 'invalid-email',
        company: '',
        status: 'unknown'
      })
    });

    const payload = await response.json();

    assert.equal(response.status, 400);
    assert.equal(payload.success, false);
    assert.equal(payload.message, 'Validation failed');
    assert.ok(Array.isArray(payload.details));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
