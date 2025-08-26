const request = require('supertest');
const app = require('../src/server');

describe('Server', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /api', () => {
    it('should return API documentation', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Nexa AI Business Hub API');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('auth');
      expect(response.body.endpoints).toHaveProperty('documents');
      expect(response.body.endpoints).toHaveProperty('support');
      expect(response.body.endpoints).toHaveProperty('sales');
      expect(response.body.endpoints).toHaveProperty('billing');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not found');
      expect(response.body.message).toContain('Route GET /unknown-route not found');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});

describe('Authentication Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should require email, password, and name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should require email and password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});

describe('Protected Routes', () => {
  describe('GET /api/documents', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/documents')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('GET /api/support/faqs', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/support/faqs')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('GET /api/sales/templates', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/sales/templates')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('GET /api/billing/info', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/billing/info')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });
});