#!/bin/sh
until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  echo "Waiting for Postgres..."
  sleep 2
done
exec "$@"
