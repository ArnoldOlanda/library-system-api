#!/bin/sh
set -e

echo "🚀 Starting application..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 2
done
echo "✅ PostgreSQL is ready!"

# Run migrations
echo "🔄 Running database migrations..."
pnpm migration:run || echo "⚠️  Migrations failed or already applied"

# Start the application
echo "🎯 Starting NestJS application..."
exec node dist/main
