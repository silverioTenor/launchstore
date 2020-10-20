CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "color" text NOT NULL,
  "brand" text NOT NULL,
  "model" text NOT NULL,
  "condition" text NOT NULL,
  "description" text NOT NULL,
  "price" int NOT NULL,
  "old_price" int,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "path" text NOT NULL,
  "product_id" int UNIQUE,
  "user_id" int UNIQUE
);

ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
