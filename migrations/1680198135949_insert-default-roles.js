exports.up = (pgm) => {
  pgm.sql("INSERT INTO roles(id, name, description) VALUES ('p0ZoB1FwH6', 'admin', 'Default role admin')");
  pgm.sql("INSERT INTO roles(id, name, description) VALUES ('mSjGCTfn8w', 'user', 'Default role user')");
};

exports.down = (pgm) => {
  pgm.sql("DELETE FROM roles WHERE id = 'p0ZoB1FwH6'");
  pgm.sql("DELETE FROM roles WHERE id = 'mSjGCTfn8w'");
};
