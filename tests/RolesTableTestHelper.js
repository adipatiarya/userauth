/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RolesTableTestHelper = {
  async addToRole(roleId, userId) {
    const query = {
      text: 'INSERT INTO user_roles(role_id, user_id) VALUES($1, $2)',
      values: [roleId, userId],
    };

    await pool.query(query);
  },

};

module.exports = RolesTableTestHelper;
