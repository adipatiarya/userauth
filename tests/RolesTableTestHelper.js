/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RolesTableTestHelper = {
  async addUserToRole(roleId, userId) {
    const query = {
      text: 'INSERT INTO user_roles(role_id, user_id) VALUES($1, $2)',
      values: [roleId, userId],
    };

    await pool.query(query);
  },

  async findRolesByUser(userId) {
    const query = {
      text: 'SELECT * FROM user_roles WHERE user_id = $1',
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

};

module.exports = RolesTableTestHelper;
