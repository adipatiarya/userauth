const UserLogin = require('../../Domains/users/entities/UserLogin');
const NewAuthentication = require('../../Domains/authentications/entities/NewAuth');

class AuthUseCase {
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async login(useCasePayload) {
    const { email, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByemail(email);

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const id = await this._userRepository.getIdByemail(email);

    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ email, id });
    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ email, id });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this._authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}

module.exports = AuthUseCase;
