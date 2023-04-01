/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = '123', name = 'suratman', email = 'test@gmail.com', password = 'secret',
  }) {
    const query = {
      text: 'INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4)',
      values: [id, name, email, password],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
