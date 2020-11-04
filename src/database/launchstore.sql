DROP DATABASE IF EXISTS launchstore;
CREATE DATABASE launchstore;

-- TABLES

CREATE TABLE "address" (
  "cep" text PRIMARY KEY,
  "street" text NOT NULL,
  "complement" text NOT NULL,
  "district" text NOT NULL,
  "state" text NOT NULL,
  "uf" text NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf/cnpj" text UNIQUE NOT NULL,
  "cep" text NOT NULL,
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

ALTER TABLE "users" ADD FOREIGN KEY ("cep") REFERENCES "address" ("cep");

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