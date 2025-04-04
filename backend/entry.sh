#!/bin/bash

# Sprawdź, czy plik manage.py istnieje, jeśli nie, zainicjuj projekt Django
if [ ! -f "manage.py" ]; then
    django-admin startproject backend .
fi

# Wykonaj migracje
python manage.py migrate

# Uruchom serwer Django
exec python manage.py runserver 0.0.0.0:8000