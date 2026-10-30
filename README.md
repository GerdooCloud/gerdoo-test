# Gerdoo Test App

A tiny notes app: Node.js (Express) backend, plain HTML UI, PostgreSQL database.

## Run locally

```sh
docker compose up --build
```

Open http://localhost:3000

## Deploy on Gerdoo Cloud

1. Create a PostgreSQL database.
2. Deploy this folder with the `Dockerfile`.
3. Set environment variables:
   - `DATABASE_URL` — e.g. `postgres://user:pass@host:5432/dbname`
   - `PORT` — optional, defaults to `3000`

The `notes` table is created automatically on startup.

## Endpoints

- `GET /health` — app + database check
- `GET /api/notes` — list notes
- `POST /api/notes` — `{ "text": "..." }`
- `DELETE /api/notes/:id`
