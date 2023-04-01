class RegisteredUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, email, name, role,
    } = payload;

    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
  }

  _verifyPayload({
    id, email, name, role,
  }) {
    if (!id || !email || !name || !role) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof email !== 'string' || typeof name !== 'string' || typeof role !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredUser;
