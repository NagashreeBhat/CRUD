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
