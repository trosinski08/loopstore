# LoopStore Backend

## Wymagania

- Python 3.10+
- Docker i Docker Compose
- PostgreSQL 14+
- Redis 7+

## Konfiguracja środowiska

1. Sklonuj repozytorium:

```bash
git clone https://github.com/your-username/loopstore.git
cd loopstore/backend
```

### 2. Utwórz plik .env na podstawie .env.example

```bash
cp .env.example .env
```

### 3. Wygeneruj certyfikaty SSL dla środowiska deweloperskiego

```bash
mkdir -p certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/localhost.key -out certs/localhost.crt -subj "/CN=localhost"
```

### 4. Zbuduj i uruchom kontenery

```bash
# Dla środowiska deweloperskiego
docker-compose -f docker-compose.dev.yml up --build

# Dla środowiska produkcyjnego
docker-compose up --build
```

## Struktura projektu

'''
backend/
├── backend_web/          # Główny katalog projektu Django
│   ├── settings/         # Ustawienia projektu
│   │   ├── base.py      # Podstawowe ustawienia
│   │   ├── development.py # Ustawienia deweloperskie
│   │   └── production.py # Ustawienia produkcyjne
│   ├── templates/        # Szablony HTML
│   └── urls.py          # Konfiguracja URL
├── shop/                # Aplikacja sklepu
├── certs/              # Certyfikaty SSL
├── media/              # Pliki multimedialne
├── static/             # Pliki statyczne
├── Dockerfile          # Konfiguracja Docker dla produkcji
├── Dockerfile.dev      # Konfiguracja Docker dla rozwoju
├── docker-compose.yml  # Konfiguracja Docker Compose dla produkcji
└── docker-compose.dev.yml # Konfiguracja Docker Compose dla rozwoju

'''

## Bezpieczeństwo

Projekt zawiera następujące mechanizmy bezpieczeństwa:

- SSL/TLS dla wszystkich połączeń
- Uwierzytelnianie dwuskładnikowe (2FA)
- Ochrona przed atakami brute force
- Ochrona przed atakami XSS i CSRF
- Ochrona przed atakami SQL Injection
- Ochrona przed atakami Clickjacking
- Ochrona przed atakami Honeypot
- Ochrona przed atakami Defender
- Ochrona przed atakami Axes

## API Endpoints

- `/api/products/` - Lista produktów
- `/api/categories/` - Lista kategorii
- `/api/sizes/` - Lista rozmiarów
- `/api/orders/` - Lista zamówień

## Uwierzytelnianie

- `/accounts/login/` - Logowanie
- `/accounts/logout/` - Wylogowanie
- `/accounts/password_change/` - Zmiana hasła
- `/accounts/password_reset/` - Reset hasła
- `/accounts/two_factor/` - Uwierzytelnianie dwuskładnikowe

## Monitoring

- `/defender/` - Monitorowanie prób logowania
- `/axes/` - Monitorowanie blokad kont

## Licencja

MIT
