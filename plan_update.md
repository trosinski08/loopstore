# LoopStore - Plan Projektu (Zaktualizowany)

Projekt LoopStore to implementacja sklepu internetowego z przypisanymi wymaganiami i technologiami. Poniżej znajdziesz szczegółowy plan, uwzględniający narzędzia, architekturę, etapy rozwoju oraz CI/CD, containerizację i monitoring.

---

## 1. Narzędzia z GitHub Student Developer Pack

### Hosting i Deployment
- **DigitalOcean**  
  - Kubernetes Cluster – dla skalowalnych kontenerów
  - Managed Database dla PostgreSQL
  - Spaces (S3) – przechowywanie mediów  
- **Microsoft Azure**  
  - Azure Container Registry
  - Azure CDN – dla statycznych zasobów
  - Backup i disaster recovery

### Monitoring i Wydajność
- **DataDog** (2 lata Pro)  
  - Monitoring infrastruktury i aplikacji (APM)
  - Log Management  
- **Sentry** (500k wydarzeń/miesiąc)  
  - Śledzenie błędów i performance monitoring  
  - Release tracking

### Rozwój i Testowanie
- **JetBrains IDEs** (PyCharm Professional, WebStorm, DataGrip)  
  - Wydajne środowiska pracy dla backendu, frontendu i baz danych  
- **GitHub Copilot**  
  - Asystent AI przy generowaniu kodu  
- **BrowserStack**  
  - Testowanie na różnych urządzeniach i przeglądarkach  

### Design i UI/UX
- **Figma** (Professional plan)  
  - Kompleksowy design, systemy komponentów  
- **Canva** (Pro subscription)  
  - Grafiki marketingowe, banery, social media assets  

### Bezpieczeństwo
- **Name.com / Namecheap**  
  - Rejestracja domeny (.tech lub .me) z darmowym certyfikatem SSL  
- **Auth0**  
  - Uwierzytelnianie (OAuth2, Single Sign-On)

---

## 2. Architektura Projektu

### Frontend (Next.js 14)
- **Struktura katalogów:**
  ```
  frontend/
  ├── app/
  │   ├── (shop)/
  │   │   ├── page.tsx                 # Strona główna z listą produktów
  │   │   ├── products/
  │   │   │   ├── [slug]/page.tsx       # Szczegóły produktu
  │   │   │   └── page.tsx              # Lista produktów
  │   │   ├── cart/                    # Koszyk
  │   │   └── checkout/                # Formularz zamówienia
  │   ├── (auth)/
  │   │   ├── login/
  │   │   └── register/
  │   └── (account)/
  │       ├── orders/
  │       └── settings/
  ├── components/
  │   ├── ui/                          # Przykładowe komponenty (Button, Input, Card)
  │   ├── shop/                        # Komponenty związane z produktami i koszykiem
  │   └── layout/                      # Navbar, Footer, globalny layout
  └── lib/
      ├── api/                         # Integracja z API backendu
      ├── hooks/                       # Custom hooks
      └── utils/                       # Narzędzia pomocnicze (np. getMediaUrl)
  ```

### Backend (Django 5.2)
- **Struktura katalogów:**
  ```
  backend/
  ├── apps/
  │   ├── products/
  │   │   ├── models.py
  │   │   ├── views.py
  │   │   ├── serializers.py
  │   │   └── tests/
  │   ├── orders/
  │   │   ├── models.py
  │   │   ├── views.py
  │   │   └── services/
  │   └── users/
  │       ├── models.py
  │       └── views.py
  ├── core/
  │   ├── settings/
  │   │   ├── base.py
  │   │   ├── development.py
  │   │   └── production.py
  │   └── urls.py
  └── utils/
      ├── storage.py                   # Integracja z DigitalOcean Spaces/S3
      └── validators.py
  ```

---

## 3. Konfiguracja Infrastruktury i Containerizacja

### Docker & Docker Compose
- **Frontend, Backend, DB, Redis, Nginx** w oddzielnych kontenerach
- Przykładowy plik `docker-compose.yml` (wersja developerska / produkcyjna):

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost/api
      - NEXT_PUBLIC_MEDIA_URL=http://localhost
    ports:
      - "3000:3000"
    networks:
      - loopstore_network

  backend:
    build: ./backend
    environment:
      - DJANGO_SETTINGS_MODULE=core.settings.development
      - SECURE_SSL_REDIRECT=False
      - SESSION_COOKIE_SECURE=False
      - CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000
    ports:
      - "8000:8000"
    networks:
      - loopstore_network

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - loopstore_network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - loopstore_network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
    depends_on:
      - frontend
      - backend
    networks:
      - loopstore_network

volumes:
  postgres_data:
  redis_data:

networks:
  loopstore_network:
```

---

## 4. Funkcjonalności i Implementacja

### System Produktów
- Kategorie, tagi, warianty produktów (rozmiary, kolory)
- Zarządzanie stanem magazynowym
- Wyszukiwanie i filtrowanie (np. po cenie, kategorii)

### Koszyk i Zamówienia
- Koszyk persystowany w Redis (na potrzeby sesji)
- Proces checkout z formularzem zbierającym dane klienta
- Historia zamówień (model Order)
- Endpointy API do składania i podglądu zamówień

### System Płatności
- **Integracja Stripe**  
  - Endpoint do tworzenia `PaymentIntent` w Django  
  - Formularz płatności w Next.js wykorzystujący Stripe SDK
- Opcjonalnie: PayPal lub lokalne rozwiązania (np. Przelewy24)

### Użytkownicy i Autoryzacja
- Autoryzacja z Auth0 lub standardowy system Django (z rejestracją i profilami)
- Role użytkowników, system logowania/rejestracji
- Historia aktywności i zamówień

### SEO i Wydajność
- Server-Side Rendering (Next.js) i optymalizacja stron
- Meta tagi, Sitemap, robots.txt, Schema.org
- Lazy loading obrazów, Code splitting, integracja z CDN

---

## 5. Plan Wdrożenia i Etapy Rozwoju

### Etap 1: Setup oraz CI/CD (Tydzień 1-2)
- **Środowisko developerskie**:
  - Konteneryzacja aplikacji (Docker, Docker Compose)
  - Konfiguracja repozytorium Git (GitHub)
  - Integracja z CI/CD (GitHub Actions, testy jednostkowe)
- **Podstawowa struktura projektu**:
  - Szkielet projektu Next.js i Django
  - Konfiguracja bazy danych, routing API

### Etap 2: Core Features (Tydzień 3-6)
- **Frontend**:
  - Lista produktów, szczegóły produktu, koszyk i formularz checkout
- **Backend**:
  - Modele produktów i zamówień
  - Endpointy REST API przy użyciu Django REST Framework
- **Integracja**:
  - Połączenie frontendu z backendem (pobieranie produktów, składanie zamówień)

### Etap 3: Enhanced Features (Tydzień 7-10)
- **System płatności**:
  - Integracja i testowanie Stripe (endpointy, formularze płatności)
- **Autoryzacja i użytkownicy**:
  - System rejestracji/logowania, profile użytkowników
  - Wdrożenie Auth0, jeśli wymagane
- **Panel administracyjny**:
  - Rozbudowany panel zarządzania produktami i zamówieniami

### Etap 4: Optymalizacja i Skalowalność (Tydzień 11-12)
- **Wdrożenie hostingu**:
  - Frontend na Netlify/Vercel
  - Backend na Heroku lub DigitalOcean (konteneryzacja, Kubernetes)
- **Monitoring**:
  - DataDog, Sentry, logowanie
- **SEO i optymalizacja**:
  - Pełna konfiguracja SEO, integracja z CDN, optymalizacja kodu, cache

---

## 6. Rozwój i Utrzymanie

### Monitoring i Backup
- **Monitoring**: DataDog (APM, logi), Sentry (błędy, performance)
- **Backup**: Regularne kopie bazy danych, media, konfiguracja
- **Aktualizacje**: Patches bezpieczeństwa, dependency updates

### CI/CD i Automatyzacja
- **GitHub Actions**: Automatyczne testy, budowanie i wdrażanie
- **Deployment Pipelines**: Oddzielne pipeline’y dla frontendu i backendu

---

## 7. Dodatkowe Rozwiązania i Integracje

- **Design i prototypowanie**: Figma + Canva – tworzenie profesjonalnego interfejsu
- **Bezpieczeństwo**: Konfiguracja HTTPS, CORS, rate limiting, CSRF protection
- **Integracje**: Płatności Stripe, Auth0, integracja z zewnętrznymi API

---