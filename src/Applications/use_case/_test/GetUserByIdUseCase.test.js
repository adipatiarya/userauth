const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const UserUseCase = require('../UserUseCase');

describe('GetUserByIdUseCase', () => {
  it('Should orchestrating detail user use case with multiple role', async () => {
    const mockUserRepository = new UserRepository();
    mockUserRepository.verifyUserExist = jest.fn();
    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({
      id: 'user-id',
      name: 'user-name',
      email: 'user-email',
      role: [{ id: '1', name: 'admin' }, { id: '2', name: 'user' }],
    }));
    const userUseCase = new UserUseCase({
      userRepository: mockUserRepository,
    });
    const result = await userUseCase.getUserById('user-id');
    expect(result).toStrictEqual(new RegisteredUser({
      id: 'user-id',
      name: 'user-name',
      email: 'user-email',
      role: 'admin, user',
    }));
    expect(mockUserRepository.verifyUserExist).toBeCalledWith('user-id');
    expect(mockUserRepository.getUserById).toBeCalledWith('user-id');
  });
  it('Should orchestrating detail user use case with single role', async () => {
    const mockUserRepository = new UserRepository();
    mockUserRepository.verifyUserExist = jest.fn();
    mockUserRepository.getUserById = jest.fn(() => Promise.resolve({
      id: 'user-id',
      name: 'user-name',
      email: 'user-email',
      role: [{ id: '1', name: 'admin' }],
    }));
    const userUseCase = new UserUseCase({
      userRepository: mockUserRepository,
    });
    const result = await userUseCase.getUserById('user-id');
    expect(result).toStrictEqual(new RegisteredUser({
      id: 'user-id',
      name: 'user-name',
      email: 'user-email',
      role: 'admin',
    }));
    expect(mockUserRepository.verifyUserExist).toBeCalledWith('user-id');
    expect(mockUserRepository.getUserById).toBeCalledWith('user-id');
  });
});
