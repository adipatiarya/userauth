const RolesTableTestHelper = require('../../../../tests/RolesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const RoleRepositoryPostgres = require('../RoleRepositoryPostgres');

describe('RoleRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addUserToRoleFunction', () => {
    it('add user with valid role', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', email: 'yes@gmail.com' });

      // Action
      const roleRepositoryPostgres = new RoleRepositoryPostgres(pool);
      const roleId = await roleRepositoryPostgres.getIdByname('admin');
      await roleRepositoryPostgres.addUserToRole(roleId, 'user-321');

      const userRoles = await RolesTableTestHelper.findRolesByUser('user-321');
      await expect(userRoles).toHaveLength(1);
    });
  });
  it('get role with not valid role', async () => {
    const roleRepositoryPostgres = new RoleRepositoryPostgres(pool);
    await expect(roleRepositoryPostgres.getIdByname('xxxx')).rejects.toThrowError(InvariantError);
  });
  it('get role with valid role', async () => {
    const roleRepositoryPostgres = new RoleRepositoryPostgres(pool);
    const roleId = await roleRepositoryPostgres.getIdByname('admin');
    expect(roleId).toEqual('p0ZoB1FwH6');// default id admin role
  });
});
