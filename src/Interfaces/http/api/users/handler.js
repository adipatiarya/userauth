const UserUseCase = require('../../../../Applications/use_case/UserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;
  }

  async postUserHandler(request, h) {
    const userUseCase = this._container.getInstance(UserUseCase.name);
    const addedUser = await userUseCase.addUser(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }

  async getUserHandler(request) {
    const userUseCase = this._container.getInstance(UserUseCase.name);
    const user = await userUseCase.getUserById(request.params.id);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async getUsersHandler() {
    const userUseCase = this._container.getInstance(UserUseCase.name);
    const users = await userUseCase.getAllUser();
    return {
      status: 'success',
      data: {
        users,
      },
    };
  }
}

module.exports = UsersHandler;
