const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class UserUseCase {
  constructor({ userRepository, passwordHash, roleRepository }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._roleRepository = roleRepository;
  }

  async getAllUser() {
    const users = await this._userRepository.getAllUser();

    return users.map((user) => {
      const role = user.role.map((r) => r.name).join(', ');
      return new RegisteredUser({
        ...user, role,
      });
    });
  }

  async addUser(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableemail(registerUser.email);
    registerUser.password = await this._passwordHash.hash(registerUser.password);

    const user = await this._userRepository.addUser(registerUser);
    const roleId = await this._roleRepository.getIdByname(useCasePayload.role);
    await this._roleRepository.addUserToRole(roleId, user.id);
    return new RegisteredUser(user);
  }

  async getUserById(userId) {
    await this._userRepository.verifyUserExist(userId);
    const result = await this._userRepository.getUserById(userId);
    const role = result.role.map((r) => r.name).join(', ');
    return new RegisteredUser({ ...result, role });
  }
}

module.exports = UserUseCase;
