-- DROP DATABASE IF EXISTS launchstore;
-- CREATE DATABASE launchstore;

-- TABLES

CREATE TABLE "address" (
  "id" SERIAL PRIMARY KEY,
  "cep" text NOT NULL,
  "street" text NOT NULL,
  "complement" text,
  "district" text NOT NULL,
  "state" text NOT NULL,
  "uf" text NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "address_id" int,
  "reset_token" text,
  "reset_token_expires" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "color" text NOT NULL,
  "brand" text NOT NULL,
  "model" text NOT NULL,
  "condition" text NOT NULL,
  "description" text NOT NULL,
  "price" int NOT NULL,
  "old_price" int,
  "storage" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "files_manager" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "product_id" int
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "path" text[] NOT NULL,
  "files_manager_id" int UNIQUE
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "seller_id" int NOT NULL,
  "buyer_id" int NOT NULL,
  "product_id" int NOT NULL,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "total" int NOT NULL,
  "status" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- CONNECT PG SIMPLE TABLE
  
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- FOREIGN KEYs

ALTER TABLE "users" ADD FOREIGN KEY ("address_id") REFERENCES "address" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "files_manager" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "files_manager" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("files_manager_id") REFERENCES "files_manager" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("seller_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("buyer_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

-- PROCEDURE

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER

-- USERS
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- PRODUCTS
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- ORDERS
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- CASCADE EFFECT ON DELETE

ALTER TABLE "users"
DROP CONSTRAINT users_address_id_fkey,
ADD CONSTRAINT users_address_id_fkey
FOREIGN KEY ("address_id")
REFERENCES "address" ("id")
ON DELETE CASCADE;

ALTER TABLE "products"
DROP CONSTRAINT products_user_id_fkey,
ADD CONSTRAINT products_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "files_manager"
DROP CONSTRAINT files_manager_user_id_fkey,
ADD CONSTRAINT files_manager_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "files_manager"
DROP CONSTRAINT files_manager_product_id_fkey,
ADD CONSTRAINT files_manager_product_id_fkey
FOREIGN KEY ("product_id")
REFERENCES "products" ("id")
ON DELETE CASCADE;

ALTER TABLE "files"
DROP CONSTRAINT files_files_manager_id_fkey,
ADD CONSTRAINT files_files_manager_id_fkey
FOREIGN KEY ("files_manager_id")
REFERENCES "files_manager" ("id")
ON DELETE CASCADE;

-- RESTART SEQUENCE IDs

-- ALTER SEQUENCE users RESTART WITH 1;
-- UPDATE users SET idcolumn=nextval('seq');

-- RULE FOR PRODUCT DELETED

CREATE OR REPLACE RULE deleted_product AS
ON DELETE TO products DO INSTEAD
UPDATE products
SET deleted_at = now()
WHERE products.id = old.id;

-- CREATE VIEW FOR PRODUCTS DELETED

CREATE VIEW products_without_deleted AS
SELECT * FROM products WHERE deleted_at IS NULL;

-- RENAME OUR VIEW AND TABLE
ALTER TABLE products RENAME TO products_with_deleted;
ALTER VIEW products_without_deleted RENAME TO products;