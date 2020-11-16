DROP DATABASE IF EXISTS launchstore;
CREATE DATABASE launchstore;

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
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
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
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
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

-- FOREIGN KEYs

ALTER TABLE "users" ADD FOREIGN KEY ("address_id") REFERENCES "address" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "files_manager" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "files_manager" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("files_manager_id") REFERENCES "files_manager" ("id");

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

-- CONNECT PG SIMPLE TABLE
  
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

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