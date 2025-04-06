FROM python:3.10-slim

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj plik requirements.txt
COPY requirements.txt /app/

# Zainstaluj zależności
RUN pip install --no-cache-dir -r requirements.txt

# Skopiuj pozostałe pliki projektu
COPY . /app

# Inicjalizuj pgit rojekt Django, jeśli nie istnieje
RUN if [ ! -f "manage.py" ]; then python -m django startproject backend_web .; fi

# Uruchom serwer Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]