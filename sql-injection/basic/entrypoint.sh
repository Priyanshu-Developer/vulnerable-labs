#!/bin/sh
set -e

# Wait for Postgres
echo "Waiting for Postgres at $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Postgres is not ready yet. Sleeping 2s..."
  sleep 2
done
echo "Postgres is up!"

# Initialize DB (run once)
echo "Initializing database..."
node ./initdb.js

# Start Next.js (this keeps container alive)
echo "Starting web app..."
exec pnpm start
