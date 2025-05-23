# LoopStore - Troubleshooting Guide

Ten dokument zawiera rozwiązania najczęstszych problemów napotkanych podczas konfiguracji i rozwijania projektu LoopStore.

## Spis treści

1. [Problemy z Docker](#problemy-z-docker)
    - [Problemy z budowaniem obrazów Docker](#problemy-z-budowaniem-obrazów-docker)
    - [Problemy z komunikacją między kontenerami](#problemy-z-komunikacją-między-kontenerami)
    - [Problemy z wolumenami](#problemy-z-wolumenami)
2. [Problemy z backendem](#problemy-z-backendem)
    - [Problem z entry.sh](#problem-z-entrysh)
    - [Problem z połączeniem do Redis](#problem-z-połączeniem-do-redis)
    - [Problem z instalacją Django](#problem-z-instalacją-django)
3. [Problemy z frontendem](#problemy-z-frontendem)
    - [Problemy z "top-level await"](#problemy-z-top-level-await)
    - [Problemy z "Failed to fetch"](#problemy-z-failed-to-fetch)
    - [Problemy z brakującymi komponentami](#problemy-z-brakującymi-komponentami)
4. [Problemy z Nginx](#problemy-z-nginx)
    - [Problemy z konfiguracją proxy](#problemy-z-konfiguracją-proxy)
    - [Problemy z CORS](#problemy-z-cors)

## Problemy z Docker

### Problemy z budowaniem obrazów Docker

#### Problem: Błędy podczas budowania obrazu frontendu

**Objawy:**
- Błędy podczas wykonywania `npm ci` w kontenerze
- Problemy z dostępem do `package-lock.json`

**Rozwiązanie:**
1. Zmiana w `frontend/Dockerfile` - `COPY package*.json ./` na `COPY package.json ./`
2. Zmiana `RUN npm ci` na `RUN npm install`
3. Dodanie `RUN npm run build` i `ENTRYPOINT ["npm", "start"]`

```dockerfile
# Skopiuj pliki package.json
COPY package.json ./

# Zainstaluj zależności
RUN npm install
# RUN npm ci

# Skopiuj resztę plików
COPY . .

# Zbuduj aplikację
RUN npm run build

# Ustaw domyślny punkt wejścia
ENTRYPOINT ["npm", "start"]
```

#### Problem: Ostrzeżenia dotyczące niestandardowych tagów obrazów Docker

**Objawy:**
- Ostrzeżenia `not_pinned_digest` i `recommended_tag`

**Rozwiązanie:**
1. Używanie konkretnych wersji obrazów bazowych z digestami
2. Przykład:
```dockerfile
FROM node:20-slim@sha256:cb4abfbba7dfaa78e21ddf2a72a592e5f9ed36ccf98bdc8ad3ff945673d288c2
```

### Problemy z komunikacją między kontenerami

#### Problem: "ERR_TOO_MANY_REDIRECTS" podczas komunikacji frontend-backend

**Objawy:**
- Ciągłe przekierowania podczas próby dostępu do API z frontendu

**Rozwiązanie:**
1. Aktualizacja `next.config.js` aby poprawnie przekierowywać żądania API:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://backend:8000/api/:path*'
    }
  ]
}
```

2. Aktualizacja zmiennych środowiskowych w `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost/api
NEXT_PUBLIC_MEDIA_URL=http://localhost
```

3. Konfiguracja CORS w Django (`backend/backend_web/settings/development.py`):
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://frontend:3000",
    "http://localhost"
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://frontend:3000",
    "http://localhost"
]
```

### Problemy z wolumenami

#### Problem: Nadpisywanie zainstalowanych pakietów Python w kontenerze deweloperskim

**Objawy:**
- `ModuleNotFoundError: No module named 'django'` po montowaniu wolumenu

**Rozwiązanie:**
1. Usunięcie `/app` z listy wolumenów w `Dockerfile.dev`:
```dockerfile
# Konfiguracja wolumenów dla środowiska deweloperskiego
VOLUME ["/app/media", "/app/static"]
```

2. Zmiana montowania wolumenów w `docker-compose.dev.yml`:
```yaml
volumes:
  - ./backend:/app
  - /app/site-packages # Zachowaj zainstalowane pakiety
```

## Problemy z backendem

### Problem z entry.sh

#### Problem: "exec /usr/local/bin/entry.sh: no such file or directory"

**Objawy:**
- Kontener backendu nie uruchamia się w trybie deweloperskim

**Rozwiązanie:**
1. Upewnienie się, że `entry.sh` ma uprawnienia do wykonywania:
```dockerfile
RUN chmod +x /usr/local/bin/entry.sh
```

2. Naprawa końców linii w skrypcie:
```dockerfile
RUN sed -i 's/\r$//' /usr/local/bin/entry.sh
```

3. Utworzenie specjalnego skryptu `dev-entrypoint.sh`:
```bash
#!/bin/bash
# Upewnij się, że Django jest zainstalowane w trybie deweloperskim
if ! python -c "import django" &> /dev/null; then
    echo "$(date): Django not found, installing requirements..."
    pip install -r requirements.txt
else
    echo "$(date): Django is already installed"
fi
# Wykonaj standardowy skrypt entry.sh
exec /usr/local/bin/entry.sh "$@"
```

### Problem z połączeniem do Redis

#### Problem: Backend nie może połączyć się z Redis

**Objawy:**
- Brak połączenia z Redis w trybie produkcyjnym

**Rozwiązanie:**
1. Dodanie pakietu `redis-tools` do kontenerów:
```dockerfile
RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-openbsd \
    curl \
    build-essential \
    libpq-dev \
    redis-tools \
    --no-install-recommends
```

2. Dodanie diagnostyki połączenia w `entry.sh`:
```bash
echo "$(date): Redis URL: $REDIS_URL"
/usr/local/bin/wait-for-it.sh redis:6379 -t 5 || echo "$(date): Redis not available but continuing anyway..."
# Try a direct ping to Redis for debugging
if command -v redis-cli &> /dev/null; then
    echo "$(date): Testing direct Redis connection..."
    redis-cli -h redis -p 6379 ping || echo "$(date): Direct Redis ping failed but continuing anyway..."
else
    echo "$(date): redis-cli not found, skipping direct Redis test"
fi
```

3. Dodanie opcji `restart: unless-stopped` do usługi Redis:
```yaml
redis:
  image: redis:7
  # ...
  restart: unless-stopped
```

### Problem z instalacją Django

#### Problem: "ModuleNotFoundError: No module named 'django'"

**Objawy:**
- Django nie jest zainstalowane, mimo że jest w `requirements.txt`

**Rozwiązanie:**
1. Zmiana obrazu bazowego z `alpine` na `slim-bookworm`:
```dockerfile
FROM python:3.11-slim-bookworm
```

2. Utworzenie skryptu `dev-entrypoint.sh`:
```bash
#!/bin/bash
# Upewnij się, że Django jest zainstalowane
if ! python -c "import django" &> /dev/null; then
    pip install -r requirements.txt
fi
```

## Problemy z frontendem

### Problemy z "top-level await"

#### Problem: Błędy "top-level await" podczas kompilacji

**Objawy:**
- Błędy kompilacji dotyczące await poza async function

**Rozwiązanie:**
1. Dodanie dyrektywy `'use client'` na początku plików
2. Przeniesienie funkcji pobierających dane do hooków `useEffect`

```tsx
"use client";

import { useEffect, useState } from 'react';

export default function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/data');
      const data = await res.json();
      setData(data);
    };
    
    fetchData();
  }, []);
  
  // ...
}
```

### Problemy z "Failed to fetch"

#### Problem: Błędy "Failed to fetch" podczas komunikacji z API

**Objawy:**
- Komunikaty "Failed to fetch" w konsoli przeglądarki
- Kod błędu 404 dla zapytań API

**Rozwiązanie:**
1. Konfiguracja zmiennych środowiskowych dla adresu API:
```javascript
const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
const res = await fetch(`${baseApiUrl}/products/`);
```

2. Aktualizacja `next.config.js` z rewrite dla API:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://backend:8000/api/:path*'
    }
  ]
}
```

### Problemy z brakującymi komponentami

#### Problem: Brakujący komponent AccountLayout

**Objawy:**
- Błąd "Cannot find module '@/components/account/AccountLayout'"

**Rozwiązanie:**
1. Utworzenie brakującego komponentu:
```tsx
import { ReactNode } from 'react';

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          {/* Sidebar navigation */}
        </aside>
        <main className="w-full md:w-3/4">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Problemy z Nginx

### Problemy z konfiguracją proxy

#### Problem: Niepoprawne przekierowywanie plików statycznych i mediów

**Objawy:**
- 404 dla plików statycznych i mediów

**Rozwiązanie:**
1. Aktualizacja konfiguracji Nginx dla lokalizacji `/media/` i `/static/`:
```nginx
# Media files
location /media/ {
    proxy_pass http://backend/media/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Static files
location /static/ {
    proxy_pass http://backend/static/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Problemy z CORS

#### Problem: Błędy CORS podczas żądań do API

**Objawy:**
- Błędy "Access-Control-Allow-Origin" w konsoli przeglądarki

**Rozwiązanie:**
1. Konfiguracja CORS w Django:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://frontend:3000",
    "http://localhost"
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://frontend:3000",
    "http://localhost"
]
```

2. Dodanie nagłówków CORS w konfiguracji Nginx:
```nginx
location /api/ {
    proxy_pass http://backend/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Origin $http_origin;
}
```
