-- Run this after creating and connecting to the database, e.g.:
--   createdb contact_db
--   psql -d contact_db -f schema.sql

CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20) NOT NULL
);
