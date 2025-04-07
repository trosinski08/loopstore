#!/usr/bin/env bash

# Czekaj na dostępność bazy danych
/usr/local/bin/wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Baza danych jest dostępna!"

# Sprawdź, czy plik manage.py istnieje
if [ ! -f "manage.py" ]; then
    echo "Plik manage.py nie istnieje. Inicjalizuję projekt Django..."
    django-admin startproject backend_web .
fi

# Wykonaj domyślną komendę
exec "$@"