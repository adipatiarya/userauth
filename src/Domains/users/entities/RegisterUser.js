class RegisterUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      email, password, name, role,
    } = payload;

    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
  }

  _verifyPayload({
    email, password, name, role,
  }) {
    if (!email || !password || !name || !role) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string' || typeof role !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      throw new Error('REGISTER_USER.EMAIL_NOT_VALID_EMAIL');
    }
  }
}

module.exports = RegisterUser;
