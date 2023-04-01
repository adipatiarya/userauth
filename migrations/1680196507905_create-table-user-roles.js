exports.up = (pgm) => {
  pgm.createTable('user_roles', {
    user_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,

    },
    role_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
  });
  pgm.addConstraint('user_roles', 'fk_user_roles.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('user_roles', 'fk_user_roles.role_id_roles.id', 'FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_roles', 'fk_user_roles.user_id_users.id');
  pgm.dropConstraint('user_roles', 'fk_user_roles.role_id_roles.id');
  pgm.dropTable('user_roles');
};
