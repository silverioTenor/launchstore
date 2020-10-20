CREATE TABLE "product" (
  "id" SERIAL PRIMARY KEY,
  "brand" text NOT NULL,
  "model" text NOT NULL,
  "cor" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "storage" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int UNIQUE,
  "quantity" int DEFAULT 0
);

CREATE TABLE "file" (
  "id" SERIAL PRIMARY KEY,
  "path" text NOT NULL,
  "product_id" int UNIQUE
);

ALTER TABLE "product" ADD FOREIGN KEY ("id") REFERENCES "storage" ("product_id");

ALTER TABLE "product" ADD FOREIGN KEY ("id") REFERENCES "file" ("product_id");
