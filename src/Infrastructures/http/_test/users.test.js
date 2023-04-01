const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        email: 'yes@gmail.com',
        password: 'secret',
        name: 'kirun',
        role: 'admin',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        name: 'jawir',
        password: 'secret',
        role: 'admin',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        name: 'arya',
        email: 'secret',
        password: ['hgh'],
        role: 'admin',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when email not valid', async () => {
      // Arrange
      const requestPayload = {
        email: 'emailss',
        password: 'secret',
        name: 'kaka',
        role: 'admin',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena format email tidak valid');
    });

    it('should response 400 when email unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ email: 'yes@gmal.com' });
      const requestPayload = {
        email: 'yes@gmal.com',
        name: 'kirun',
        password: 'super_secret',
        role: 'user',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('email tidak tersedia');
    });
  });
  describe('when GET /users/id', () => {
    it('should response 200 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        email: 'yes@gmail.com',
        password: 'secret',
        name: 'kirun',
        role: 'admin',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const { data } = JSON.parse(response.payload);

      // Action
      const usersResponse = await server.inject({
        method: 'GET',
        url: `/users/${data.addedUser.id}`,
      });
      const r = JSON.parse(usersResponse.payload);
      expect(r.data.user).toBeDefined();
    });
  });
  describe('when GET /users', () => {
    it('should response 200 and persisted users', async () => {
      // Arrange
      const requestPayload = {
        email: 'yes@gmail.com',
        password: 'secret',
        name: 'kirun',
        role: 'admin',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { ...requestPayload, email: 'budi@budi.com' },
      });

      // Action
      const usersResponse = await server.inject({
        method: 'GET',
        url: '/users',
      });
      const { data } = JSON.parse(usersResponse.payload);
      expect(data.users).toBeDefined();
      expect(data.users).toHaveLength(2);
    });
  });
});
