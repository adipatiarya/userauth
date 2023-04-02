CREATE TABLE "users" (
  "id" VARCHAR(50) PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(50) UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "created_at" timestamp DEFAULT current_timestamp NOT NULL,
  "updated_at" timestamp
);

CREATE TABLE "authentications" (
  "token" TEXT NOT NULL
);

CREATE TABLE "roles" (
  "id" VARCHAR(50) PRIMARY KEY,
  "name" VARCHAR(50) UNIQUE NOT NULL,
  "description" TEXT,
  "created_at" timestamp DEFAULT current_timestamp NOT NULL,
  "updated_at" timestamp
);

CREATE TABLE "user_roles" (
  "user_id" VARCHAR(50) NOT NULL,
  "role_id" VARCHAR(50) NOT NULL
);
ALTER TABLE "user_roles"
  ADD CONSTRAINT "fk_user_roles.user_id_users.id" FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE "user_roles"
  ADD CONSTRAINT "fk_user_roles.role_id_roles.id" FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE;


INSERT INTO roles(id, name, description) VALUES ('p0ZoB1FwH6', 'admin', 'Default role admin');
INSERT INTO roles(id, name, description) VALUES ('mSjGCTfn8w', 'user', 'Default role user');
