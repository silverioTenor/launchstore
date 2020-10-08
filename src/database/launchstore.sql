CREATE TABLE "address" (
  "id" SERIAL PRIMARY KEY,
  "cep" text NOT NULL,
  "street" text NOT NULL,
  "district" text NOT NULL,
  "city" text NOT NULL,
  "uf" text NOT NULL
);

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "rg" int NOT NULL,
  "cpf" int NOT NULL,
  "birth" timestamp NOT NULL,
  "gender" text NOT NULL,
  "address_id" int UNIQUE
);

CREATE TABLE "categorie" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "product" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int UNIQUE,
  "user_id" int UNIQUE,
  "name" text NOT NULL,
  "brand" text NOT NULL,
  "model" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "storage" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int UNIQUE,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1
);

CREATE TABLE "file" (
  "id" SERIAL PRIMARY KEY,
  "path" text NOT NULL,
  "product_id" int UNIQUE,
  "user_id" int UNIQUE
);

ALTER TABLE "product" ADD FOREIGN KEY ("category_id") REFERENCES "categorie" ("id");

ALTER TABLE "product" ADD FOREIGN KEY ("id") REFERENCES "storage" ("product_id");

ALTER TABLE "file" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");

ALTER TABLE "user" ADD FOREIGN KEY ("id") REFERENCES "file" ("user_id");

ALTER TABLE "address" ADD FOREIGN KEY ("id") REFERENCES "user" ("address_id");
