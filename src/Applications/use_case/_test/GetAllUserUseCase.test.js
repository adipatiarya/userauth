const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const UserUseCase = require('../UserUseCase');

describe('GetAllUserUseCase', () => {
  it('Should orchestrating user use case with all user', async () => {
    const mockUserRepository = new UserRepository();
    const expectedUsers = [
      new RegisteredUser({
        id: 'user-123',
        name: 'administrator',
        email: 'admin@admin.com',
        role: 'admin',
      }),
      new RegisteredUser({
        id: 'user-345',
        name: 'userstandar',
        email: 'user@user.com',
        role: 'user',
      }),
      new RegisteredUser({
        id: 'user-678',
        name: 'usermultirole',
        email: 'user@user2.com',
        role: 'sales, supervisior',
      }),
    ];

    mockUserRepository.getAllUser = jest.fn(() => Promise.resolve([
      {
        id: 'user-123',
        name: 'administrator',
        email: 'admin@admin.com',
        role: [{ id: '1', name: 'admin' }],
      },
      {
        id: 'user-345',
        name: 'userstandar',
        email: 'user@user.com',
        role: [{ id: '2', name: 'user' }],
      },
      {
        id: 'user-678',
        name: 'usermultirole',
        email: 'user@user2.com',
        role: [{ id: '3', name: 'sales' }, { id: '4', name: 'supervisior' }],
      },
    ]));

    const userUseCase = new UserUseCase({
      userRepository: mockUserRepository,
    });
    const result = await userUseCase.getAllUser();
    expect(result).toStrictEqual(expectedUsers);
    expect(mockUserRepository.getAllUser).toBeCalled();
  });
});
