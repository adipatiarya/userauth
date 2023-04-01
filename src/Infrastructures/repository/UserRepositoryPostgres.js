const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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

  async getUserById(userId) {
    const query = {
      text: `SELECT users.id, users.name , users.email, roles.id as roleid ,roles.name as role
             FROM users
             JOIN user_roles
             ON users.id = user_roles.user_id
             JOIN roles 
             ON roles.id = user_roles.role_id
             WHERE users.id = $1`,
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('user tidak ditemukan');
    }
    const { id, name, email } = result.rows[0];
    const role = result.rows.map((r) => ({ id: r.roleid, name: r.role }));
    return {
      id, name, email, role,
    };
  }

  async getAllUser() {
    const result = await this._pool.query({
      text: 'SELECT * FROM users',
    });
    const userIds = result.rows.map((u) => u.id);
    const roles = await this.getUserRoles(userIds);
    return result.rows.map((r) => {
      const role = roles.filter((x) => x.userid === r.id).map(({ id, name }) => ({ id, name }));
      return { ...r, role };
    });
  }

  async getUserRoles([...userIds]) {
    const query = {
      text: `SELECT users.id as userid, roles.id, roles.name
             FROM user_roles
             JOIN users
             ON users.id = user_roles.user_id
             JOIN roles 
             ON roles.id = user_roles.role_id
             WHERE users.id = ANY($1::text[])`,
      values: [userIds],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteUserById(userId) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1',
      values: [userId],
    };
    await this._pool.query(query);
  }
}

module.exports = UserRepositoryPostgres;
