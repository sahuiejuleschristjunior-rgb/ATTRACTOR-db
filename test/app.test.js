const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test-db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const app = require('../src/app');
const { signToken } = require('../src/utils/jwt');

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


test('GET /health allows requests from configured client origin', async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const response = await fetch(`${baseUrl}/health`, {
      headers: {
        origin: process.env.CLIENT_ORIGIN
      }
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), process.env.CLIENT_ORIGIN);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /health rejects requests from unknown origins', async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const response = await fetch(`${baseUrl}/health`, {
      headers: {
        origin: 'https://evil.example.com'
      }
    });

    const payload = await response.json();

    assert.equal(response.status, 403);
    assert.equal(payload.success, false);
    assert.equal(payload.message, 'Origin not allowed by CORS policy');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/clients rejects unauthenticated requests', async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/clients`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    });

    const payload = await response.json();

    assert.equal(response.status, 401);
    assert.equal(payload.success, false);
    assert.equal(payload.message, 'Unauthorized');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/clients validates payload for authenticated requests', async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/clients`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${signToken({ sub: 'test-user-id', role: 'admin', companyId: 'company-a' })}`
      },
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


test('POST /api/leads rejects unauthenticated requests', async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    });

    const payload = await response.json();

    assert.equal(response.status, 401);
    assert.equal(payload.success, false);
    assert.equal(payload.message, 'Unauthorized');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('request logs include method, URL, status and response time without request body', async () => {
  const { server, baseUrl } = await createTestServer();
  const originalInfo = console.info;
  const infoMessages = [];
  console.info = (...args) => {
    infoMessages.push(args.join(' '));
  };

  try {
    const response = await fetch(`${baseUrl}/api/clients`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        password: 'super-secret-password'
      })
    });

    assert.equal(response.status, 401);
    assert.ok(infoMessages.length > 0);

    const requestLog = infoMessages.find((message) =>
      message.includes('POST /api/clients 401')
    );

    assert.ok(requestLog, 'Expected a request log for POST /api/clients');
    assert.match(requestLog, /POST \/api\/clients 401 [0-9.]+ ms/);
    assert.equal(requestLog.includes('super-secret-password'), false);
    assert.equal(requestLog.includes('password'), false);
  } finally {
    console.info = originalInfo;
    await new Promise((resolve) => server.close(resolve));
  }
});
