const InvariantError = require('../../Commons/exceptions/InvariantError');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableemail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('email tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { email, password, name } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4) RETURNING id, name, email',
      values: [id, name, email, password],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getPasswordByemail(email) {
    const query = {
      text: 'SELECT password FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('email tidak ditemukan');
    }

    return result.rows[0].password;
  }

  async getIdByemail(email) {
    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }
}

module.exports = UserRepositoryPostgres;
