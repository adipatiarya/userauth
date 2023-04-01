const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /login', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        email: 'test@gmail.com',
        password: 'secret',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          email: 'test@gmail.com',
          password: 'secret',
          name: 'kirun',
          role: 'user',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/login',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should response 400 if email not found', async () => {
      // Arrange
      const requestPayload = {
        email: 'xxx@gmail.com',
        password: 'secret',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/login',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('email tidak ditemukan');
    });

    it('should response 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        email: 'test@gmail.com',
        password: 'wrong_password',
      };
      const server = await createServer(container);
      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          email: 'test@gmail.com',
          password: 'secret',
          name: 'test',
          role: 'admin',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/login',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        email: 'kirun@gmail.com',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/login',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan email dan password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        email: 123,
        password: 'secret',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/login',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('email dan password harus string');
    });
  });
});
