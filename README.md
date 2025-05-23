# LoopStore

Nowoczesna platforma e-commerce zbudowana przy użyciu Next.js i Django.

## Wymagania

- Node.js 18+
- Python 3.10+
- Docker i Docker Compose
- PostgreSQL 14+
- Redis 7+

## Struktura projektu

'''
loopstore/
├── frontend/           # Aplikacja Next.js
│   ├── app/           # Komponenty i strony
│   ├── components/    # Komponenty wielokrotnego użytku
│   ├── lib/          # Biblioteki i narzędzia
│   ├── public/       # Pliki statyczne
│   └── styles/       # Style CSS
└── backend/          # Aplikacja Django
    ├── backend_web/  # Główny katalog projektu
    ├── shop/        # Aplikacja sklepu
    ├── certs/       # Certyfikaty SSL
    ├── media/       # Pliki multimedialne
    └── static/      # Pliki statyczne
'''

## Konfiguracja środowiska

1. Sklonuj repozytorium:

```bash
git clone https://github.com/your-username/loopstore.git
cd loopstore
```

### 2. Skonfiguruj backend

```bash
cd backend
cp .env.example .env
mkdir -p certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/localhost.key -out certs/localhost.crt -subj "/CN=localhost"
```

### 3. Skonfiguruj frontend

```bash
cd ../frontend
cp .env.example .env
```

### 4. Zbuduj i uruchom kontenery

```bash
# Dla środowiska deweloperskiego
docker-compose -f docker-compose.dev.yml up --build

# Dla środowiska produkcyjnego
docker-compose up --build
```

## Funkcje

- Responsywny interfejs użytkownika
- Obsługa wielu języków
- Obsługa wielu walut
- System płatności
- System dostawy
- System rabatów
- System opinii
- System rekomendacji
- Panel administracyjny
- API REST
- Uwierzytelnianie dwuskładnikowe
- Ochrona przed atakami

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

### Produkty

- `GET /api/products/` - Lista produktów
- `GET /api/products/{id}/` - Szczegóły produktu
- `POST /api/products/` - Dodaj produkt
- `PUT /api/products/{id}/` - Aktualizuj produkt
- `DELETE /api/products/{id}/` - Usuń produkt

### Kategorie

- `GET /api/categories/` - Lista kategorii
- `GET /api/categories/{id}/` - Szczegóły kategorii
- `POST /api/categories/` - Dodaj kategorię
- `PUT /api/categories/{id}/` - Aktualizuj kategorię
- `DELETE /api/categories/{id}/` - Usuń kategorię

### Rozmiary

- `GET /api/sizes/` - Lista rozmiarów
- `GET /api/sizes/{id}/` - Szczegóły rozmiaru
- `POST /api/sizes/` - Dodaj rozmiar
- `PUT /api/sizes/{id}/` - Aktualizuj rozmiar
- `DELETE /api/sizes/{id}/` - Usuń rozmiar

### Zamówienia

- `GET /api/orders/` - Lista zamówień
- `GET /api/orders/{id}/` - Szczegóły zamówienia
- `POST /api/orders/` - Dodaj zamówienie
- `PUT /api/orders/{id}/` - Aktualizuj zamówienie
- `DELETE /api/orders/{id}/` - Usuń zamówienie

## Uwierzytelnianie

- `POST /accounts/login/` - Logowanie
- `POST /accounts/logout/` - Wylogowanie
- `POST /accounts/password_change/` - Zmiana hasła
- `POST /accounts/password_reset/` - Reset hasła
- `POST /accounts/two_factor/` - Uwierzytelnianie dwuskładnikowe

## Monitoring

- `GET /defender/` - Monitorowanie prób logowania
- `GET /axes/` - Monitorowanie blokad kont

## Licencja

MIT
