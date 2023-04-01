const RolesTableTestHelper = require('../../../../tests/RolesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableEmail function', () => {
    it('should throw InvariantError when email not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ email: 'yes@gmail.com' }); // memasukan user baru dengan email yes@gmail.com
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableemail('yes@gmail.com')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when email available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableemail('yes@gmail.com')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = {
        email: 'yes@gmail.com',
        password: 'secret_password',
        name: 'arya',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = {
        name: 'arya',
        password: 'secret_password',
        email: 'yes@gmail.com',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toEqual({
        id: 'user-123',
        email: 'yes@gmail.com',
        name: 'arya',
      });
    });
  });

  describe('getPasswordByEmail', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByemail('yes@gmail.com'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return email password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        email: 'yes@gmail.com',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByemail('yes@gmail.com');
      expect(password).toBe('secret_password');
    });
  });
  describe('getAllUser function', () => {
    it('should return user array id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', email: 'yes@gmail.com' });
      await UsersTableTestHelper.addUser({ id: 'user-3mks', email: 'yess@gmail.com' });
      await RolesTableTestHelper.addUserToRole('mSjGCTfn8w', 'user-321');
      await RolesTableTestHelper.addUserToRole('mSjGCTfn8w', 'user-3mks');
      await RolesTableTestHelper.addUserToRole('p0ZoB1FwH6', 'user-321');
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Actionmks
      const users = await userRepositoryPostgres.getAllUser();
      expect(users[0].role).toHaveLength(2);
      expect(users[1].role).toHaveLength(1);
    });
  });

  describe('getIdByEmail Function', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByemail('yes@gmail.com'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', email: 'yes@gmail.com' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByemail('yes@gmail.com');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });
  describe('getUserById Function', () => {
    it('should return user object multi role ', async () => {
      await UsersTableTestHelper.addUser({}); // id = 123;
      await RolesTableTestHelper.addUserToRole('p0ZoB1FwH6', '123');
      await RolesTableTestHelper.addUserToRole('mSjGCTfn8w', '123');
      const userRepositoryPostgres = new UserRepositoryPostgres(pool);
      const user = await userRepositoryPostgres.getUserById('123');
      expect(user).toEqual({
        id: '123',
        name: 'suratman',
        email: 'test@gmail.com',
        role: [
          { id: 'p0ZoB1FwH6', name: 'admin' },
          { id: 'mSjGCTfn8w', name: 'user' },
        ],
      });
    });
    it('should return user object single role ', async () => {
      await UsersTableTestHelper.addUser({}); // id = 123;
      await RolesTableTestHelper.addUserToRole('p0ZoB1FwH6', '123');
      const userRepositoryPostgres = new UserRepositoryPostgres(pool);
      const user = await userRepositoryPostgres.getUserById('123');
      expect(user).toEqual({
        id: '123',
        name: 'suratman',
        email: 'test@gmail.com',
        role: [
          { id: 'p0ZoB1FwH6', name: 'admin' },
        ],
      });
    });
    it('should error user not found ', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool);
      await expect(userRepositoryPostgres.getUserById('xxxx')).rejects.toThrowError(NotFoundError);
    });
  });
  describe('deleteUserById Function', () => {
    it('should return user object multi role ', async () => {
      await UsersTableTestHelper.addUser({}); // id = 123;
      const userRepositoryPostgres = new UserRepositoryPostgres(pool);
      await userRepositoryPostgres.deleteUserById('123');
      await expect(userRepositoryPostgres.getUserById('123')).rejects.toThrowError(NotFoundError);
    });
  });
});
