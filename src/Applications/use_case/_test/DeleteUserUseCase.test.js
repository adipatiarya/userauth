const UserRepository = require('../../../Domains/users/UserRepository');
const UserUseCase = require('../UserUseCase');

describe('DeleteUserUsecase', () => {
  it('Should orchestrating delete user', async () => {
    const userId = 'user-123';

    const mockUserRepository = new UserRepository();
    mockUserRepository.verifyUserExist = jest.fn();
    mockUserRepository.deleteUserById = jest.fn();
    const userUseCase = new UserUseCase({
      userRepository: mockUserRepository,
    });
    await userUseCase.deleteUserById(userId);
    expect(mockUserRepository.verifyUserExist).toBeCalledWith(userId);
    expect(mockUserRepository.deleteUserById).toBeCalledWith(userId);
  });
});
