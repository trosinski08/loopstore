#!/bin/bash

# Add diagnostic output with timestamp
echo "$(date): Starting entry.sh script..."

# Check the environment variables
echo "$(date): Environment variables:"
echo "DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"
echo "DJANGO_ENV: $DJANGO_ENV"
echo "POSTGRES_HOST: $POSTGRES_HOST"
echo "REDIS_URL: $REDIS_URL"

# Poczekaj na gotowość bazy danych
echo "$(date): Waiting for database to be ready..."
/usr/local/bin/wait-for-it.sh db:5432 --strict
echo "$(date): Database is ready."

# Check if Redis is available but don't wait too long
echo "$(date): Checking Redis availability..."
echo "$(date): Redis URL: $REDIS_URL"
/usr/local/bin/wait-for-it.sh redis:6379 -t 5 || echo "$(date): Redis not available but continuing anyway..."

# Try a direct ping to Redis for debugging
if command -v redis-cli &> /dev/null; then
    echo "$(date): Testing direct Redis connection..."
    redis-cli -h redis -p 6379 ping || echo "$(date): Direct Redis ping failed but continuing anyway..."
else
    echo "$(date): redis-cli not found, skipping direct Redis test"
fi

# Add diagnostic output
echo "$(date): Performing database migrations..."

# Wykonaj migracje with error checking
python manage.py migrate || { echo "$(date): Database migration failed with status $?. Continuing anyway..."; }

# Add diagnostic output
echo "$(date): Collecting static files..."

# Zbierz pliki statyczne with error checking
python manage.py collectstatic --noinput || { echo "$(date): Static file collection failed with status $?. Continuing anyway..."; }

# Check if we can run the server
echo "$(date): Python and Django information:"
python -c "import django; print(f'Django version: {django.__version__}')" || echo "$(date): Failed to get Django version."
python -c "import sys; print(f'Python version: {sys.version}')" || echo "$(date): Failed to get Python version."
python manage.py check || echo "$(date): Django check failed but continuing anyway."

# Ustaw poziom logowania w zależności od środowiska
if [ "$DJANGO_ENV" = "production" ]; then
    # W środowisku produkcyjnym wyłącz szczegółowe logi
    export PYTHONWARNINGS="ignore"
    export DJANGO_LOG_LEVEL="WARNING"
    echo "$(date): Setting production log level - WARNING"
else
    # W środowisku deweloperskim pozostaw standardowy poziom logowania
    export DJANGO_LOG_LEVEL="INFO"
    echo "$(date): Setting development log level - INFO"
fi

# Add diagnostic output
echo "$(date): Starting Django server..."

# More detailed diagnostics
echo "$(date): Server will start with command: $@"
echo "$(date): Current working directory: $(pwd)"
ls -la

# Run the command passed from the Dockerfile CMD
echo "$(date): Running command: $@"
exec "$@"