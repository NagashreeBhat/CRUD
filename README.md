# Contact Management (CRUD)

A simple contact management application with Create/Read/Update/Delete
operations for contacts (name, address, phone).

- **Frontend:** React (Vite)
- **Backend:** Java (Spring Boot, REST API)
- **Database:** PostgreSQL

## Project structure

```
CRUD/
├── backend/    Spring Boot REST API
├── frontend/   React (Vite) UI
└── database/   schema.sql
```

## Prerequisites

- Java 21+ and Maven
- Node.js 18+ and npm
- PostgreSQL 14+ running locally (or reachable)

## 1. Database setup

Create the database, then load the schema (Hibernate will also
auto-create the table on startup, but you can run this manually if
you prefer):

```bash
createdb contact_db
psql -d contact_db -f database/schema.sql
```

This creates a `contacts` table (`id`, `name`, `address`, `phone`)
inside `contact_db`.

Optionally, create a dedicated app user instead of using the default
`postgres` user:

```sql
CREATE USER contact_app WITH PASSWORD 'choose_a_password';
GRANT ALL PRIVILEGES ON DATABASE contact_db TO contact_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO contact_app;
```

## 2. Backend setup

The backend reads DB connection details from environment variables
(with sensible local defaults):

| Variable        | Default        |
|------------------|----------------|
| `DB_HOST`        | `localhost`    |
| `DB_PORT`        | `5432`         |
| `DB_NAME`        | `contact_db`   |
| `DB_USERNAME`    | `postgres`     |
| `DB_PASSWORD`    | *(empty)*      |
| `SERVER_PORT`    | `8080`         |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` |

Run it:

```bash
cd backend
DB_USERNAME=postgres DB_PASSWORD=yourpassword mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api/contacts`.

### API endpoints

| Method | Path                  | Description         |
|--------|-----------------------|----------------------|
| GET    | `/api/contacts`       | List all contacts    |
| GET    | `/api/contacts/{id}`  | Get one contact      |
| POST   | `/api/contacts`       | Create a contact     |
| PUT    | `/api/contacts/{id}`  | Update a contact     |
| DELETE | `/api/contacts/{id}`  | Delete a contact     |

Request/response body:

```json
{
  "name": "Jane Doe",
  "address": "123 Main St, Springfield",
  "phone": "+1 555-123-4567"
}
```

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # adjust VITE_API_BASE_URL if backend runs elsewhere
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Building for production

```bash
# Backend
cd backend && mvn -DskipTests package
java -jar target/contact-management.jar

# Frontend
cd frontend && npm run build
```

## Deploying to Render

The repo includes a `render.yaml` Blueprint that provisions three
things in one shot:

- **`contact-db`** — a managed Postgres database
- **`contact-backend`** — the Spring Boot API, built from `backend/Dockerfile`
- **`contact-frontend`** — the React app, built and served as a static site

### Steps

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. In the Render dashboard: **New > Blueprint**, connect this repo,
   and Render will read `render.yaml` and propose all three
   resources. Click **Apply**.
3. Render provisions the database first, then builds and deploys the
   backend and frontend. This can take a few minutes on the first
   deploy (Docker build + npm install).

### Important: service name collisions

`render.yaml` hardcodes each service's URL into the other (the
backend's `CORS_ALLOWED_ORIGINS` points at
`https://contact-frontend.onrender.com`, and the frontend's
`VITE_API_BASE_URL` points at `https://contact-backend.onrender.com`).
Render service names are global, so if `contact-backend` or
`contact-frontend` is already taken, Render will suffix your service
with a random string (e.g. `contact-backend-ab12`) instead — in that
case:

1. After the first deploy, open each service in the Render dashboard
   and note its actual `.onrender.com` URL.
2. Update the `contact-backend` service's `CORS_ALLOWED_ORIGINS` env
   var to the frontend's real URL.
3. Update the `contact-frontend` service's `VITE_API_BASE_URL` env
   var to `https://<backend-url>/api/contacts`, then trigger a
   manual redeploy of the frontend (env var changes require a
   rebuild for a Vite static site, since `VITE_*` vars are baked in
   at build time, not read at runtime).

### Notes

- The free Render Postgres plan expires after 30 days unless
  upgraded — fine for testing, not for anything long-lived.
- The free web service plan spins down when idle, so the first
  request after inactivity will be slow (cold start).
