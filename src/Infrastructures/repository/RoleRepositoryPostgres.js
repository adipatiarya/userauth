const InvariantError = require('../../Commons/exceptions/InvariantError');
const RoleRepository = require('../../Domains/roles/RoleRepository');

class RoleRepositoryPostgres extends RoleRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addUserToRole(roleId, userId) {
    try {
      const query = {
        text: 'INSERT INTO user_roles(role_id, user_id) VALUES ($1, $2)',
        values: [roleId, userId],
      };
      await this._pool.query(query);
    } catch (error) {
      throw new InvariantError('DUPLIKATE_KEY_USER_ROLE');
    }
  }

  async getIdByname(name) {
    const query = {
      text: 'SELECT id FROM roles WHERE name = $1',
      values: [name],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('role tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }
}
module.exports = RoleRepositoryPostgres;
