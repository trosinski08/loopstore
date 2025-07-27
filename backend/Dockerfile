FROM python:3.12-slim-bookworm@sha256:f0b613bf309c75cf0f1000752bb165400f16c0a9be06d9f330091900a10d090c

# Ustaw katalog roboczy
WORKDIR /app

# Zainstaluj zależności systemowe
RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-openbsd \
    curl \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    procps \
    redis-tools \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Skopiuj plik requirements.txt
COPY requirements.txt /app/
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
COPY entry.sh /usr/local/bin/entry.sh

# Zainstaluj zależności i przygotuj środowisko w jednej warstwie
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt && \
    chmod +x /usr/local/bin/wait-for-it.sh && \
    chmod +x /usr/local/bin/entry.sh && \
    mkdir -p /app/certs

# Skopiuj resztę plików projektu
COPY . /app/

# Utworzenie nieprywilejowanego użytkownika i nadanie odpowiednich uprawnień
RUN useradd -m -s /bin/bash -u 1000 appuser && \
    chown -R appuser:appuser /app && \
    chmod -R 750 /app && \
    # Usunięcie niepotrzebnych plików by zmniejszyć powierzchnię ataku
    find /app -type d -name "__pycache__" -exec rm -rf {} + || true

# Zmienne środowiskowe poprawiające bezpieczeństwo
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on

# Przejście na nieprywilejowanego użytkownika
USER appuser

# Healthcheck został usunięty dla poprawy działania Docker Compose

# Ustaw domyślny punkt wejścia
ENTRYPOINT ["/usr/local/bin/entry.sh"]

# Domyślna komenda (uruchomienie serwera Django)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]