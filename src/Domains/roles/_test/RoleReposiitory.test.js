const RoleRepository = require('../RoleRepository');

describe('RoleRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const roleRepository = new RoleRepository();

    // Action and Assert
    await expect(roleRepository.addUserToRole('roleId', 'userId')).rejects.toThrowError('ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(roleRepository.getIdByname('admin')).rejects.toThrowError('ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
