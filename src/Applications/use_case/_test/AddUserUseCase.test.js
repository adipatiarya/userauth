const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const RoleRepository = require('../../../Domains/roles/RoleRepository');

const UserUseCase = require('../UserUseCase');

describe('AddUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      email: 'test@gmail.com',
      password: 'secret',
      name: 'kirun',
      role: 'user',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      email: useCasePayload.email,
      name: useCasePayload.name,
      role: useCasePayload.role,
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockRoleRepository = new RoleRepository();

    /** mocking needed function */
    mockUserRepository.verifyAvailableemail = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));
    mockRoleRepository.getIdByname = jest.fn(() => Promise.resolve('role-id'));
    mockRoleRepository.addUserToRole = jest.fn();
    /** creating use case instance */
    const userUseCase = new UserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      roleRepository: mockRoleRepository,
    });

    // Action
    const registeredUser = await userUseCase.addUser(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      email: useCasePayload.email,
      name: useCasePayload.name,
      role: useCasePayload.role,
    }));
    expect(mockRoleRepository.getIdByname).toBeCalledWith(useCasePayload.role);
    expect(mockRoleRepository.addUserToRole).toBeCalledWith('role-id', registeredUser.id);
    expect(mockUserRepository.verifyAvailableemail).toBeCalledWith(useCasePayload.email);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      email: useCasePayload.email,
      password: 'encrypted_password',
      name: useCasePayload.name,
      role: useCasePayload.role,
    }));
  });
});
