const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      email: 'abc',
      password: 'abc',
      role: 'admin',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      email: 123,
      name: true,
      password: 'abc',
      role: 'admin',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when email not valid email', () => {
    // Arrange
    const payload = {
      email: 'arya',
      name: 'testuser',
      password: 'abc',
      role: 'admin',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.EMAIL_NOT_VALID_EMAIL');
  });

  it('should create registerUser object correctly', () => {
    // Arrange
    const payload = {
      email: 'test@gmail.com',
      name: 'Indonesia',
      password: 'abc',
      role: 'admin',
    };

    // Action
    const {
      email, name, password, role,
    } = new RegisterUser(payload);

    // Assert
    expect(email).toEqual(payload.email);
    expect(name).toEqual(payload.name);
    expect(password).toEqual(payload.password);
    expect(role).toEqual(payload.role);
  });
});
