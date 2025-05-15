# Plan działania - Sklep z odzieżą upcyclingową

## Rozważane projekty

Podczas planowania rozważane były dwa projekty:

1. **Sklep z odzieżą upcyclingową** (wybrany do realizacji)
   - Platforma e-commerce skupiona na sprzedaży upcyclingowanej odzieży
   - Wykorzystanie nowoczesnych technologii (Next.js, Django, PostgreSQL)
   - Integracja z systemami płatności i wysyłki

2. **Platforma do usług sprzątania (typu Uber)**
   - Aplikacja łącząca osoby szukające usług sprzątania z wykonawcami
   - System rezerwacji i płatności
   - Geolokalizacja i zarządzanie zleceniami
   - *Projekt odłożony na później*

## Stan obecny projektu

- Skonfigurowane środowisko Docker z Django i PostgreSQL
- Podstawowa struktura projektu frontend (Next.js) i backend (Django)
- Podstawowe modele i widoki w Django
- Wstępna konfiguracja Next.js

## Plan działania

### Dzień 1: Dokończenie podstawowego API w Django

1. **Rozbudowa modeli w Django:**
   - Dodanie brakujących pól do modelu `Product` (np. kategorie, tagi, wymiary)
   - Dodanie modelu `Category` do grupowania produktów
   - Implementacja relacji między modelami

2. **Rozszerzenie API:**
   - Dodanie filtrowania produktów po kategoriach
   - Implementacja wyszukiwania produktów
   - Dodanie paginacji wyników

3. **Dokumentacja API:**
   - Dodanie Swagger/OpenAPI do dokumentacji endpointów
   - Opisanie wszystkich dostępnych endpointów

### Dzień 2: Rozwój frontendu - strona główna

1. **Implementacja layoutu głównego:**
   - Dodanie nawigacji (menu główne)
   - Implementacja stopki
   - Dodanie responsywności

2. **Lista produktów:**
   - Implementacja karty produktu
   - Dodanie filtrowania i sortowania
   - Implementacja paginacji

3. **Integracja z API:**
   - Konfiguracja klienta HTTP (axios/fetch)
   - Obsługa błędów i stanów ładowania

### Dzień 3: Szczegóły produktu i koszyk

1. **Strona szczegółów produktu:**
   - Implementacja galerii zdjęć
   - Dodanie sekcji z opisem
   - Dodanie przycisku "Dodaj do koszyka"

2. **Implementacja koszyka:**
   - Utworzenie kontekstu dla koszyka (React Context)
   - Implementacja persystencji koszyka (localStorage)
   - Dodanie widoku koszyka

### Dzień 4: System zamówień

1. **Formularz zamówienia:**
   - Implementacja wieloetapowego formularza
   - Walidacja danych
   - Integracja z API zamówień

2. **Panel użytkownika:**
   - Historia zamówień
   - Zarządzanie danymi dostawy

### Dzień 5: Integracja płatności

1. **Konfiguracja Stripe:**
   - Dodanie kluczy API
   - Implementacja webhook'ów

2. **Implementacja procesu płatności:**
   - Dodanie formularza karty
   - Obsługa różnych metod płatności
   - Implementacja potwierdzeń

### Dzień 6: UI/UX i optymalizacja

1. **Optymalizacja wydajności:**
   - Implementacja lazy loading dla obrazów
   - Optymalizacja zapytań do API
   - Dodanie cache'owania

2. **Poprawa UX:**
   - Dodanie animacji i przejść
   - Implementacja komunikatów o błędach
   - Dodanie wskaźników ładowania

### Dzień 7: Testowanie i debugowanie

1. **Testy jednostkowe:**
   - Dodanie testów dla API Django
   - Testy komponentów React

2. **Testy integracyjne:**
   - Testy procesu zakupowego
   - Testy płatności

### Dzień 8: Wdrożenie produkcyjne

1. **Konfiguracja środowiska produkcyjnego:**
   - Ustawienie zmiennych środowiskowych
   - Konfiguracja CORS i bezpieczeństwa

2. **Wdrożenie:**
   - Deploy backendu na Heroku
   - Deploy frontendu na Netlify
   - Konfiguracja domeny

### Dzień 9: Monitoring i analityka

1. **Implementacja monitoringu:**
   - Konfiguracja Sentry dla błędów
   - Dodanie logowania zdarzeń

2. **Analityka:**
   - Implementacja Google Analytics
   - Śledzenie konwersji

### Dzień 10: Dokumentacja i finalizacja

1. **Dokumentacja:**
   - Aktualizacja README
   - Dokumentacja procesu wdrożenia
   - Instrukcje dla użytkowników

2. **Finalne testy:**
   - Testy na różnych urządzeniach
   - Testy wydajności
   - Testy bezpieczeństwa

## Uwagi

- Plan zakłada pracę około 2 godzin dziennie
- Niektóre zadania mogą wymagać więcej czasu - można je przenieść na kolejny dzień
- Warto regularnie commitować zmiany do repozytorium
- Każdy dzień zaczynaj od przeglądu zadań z poprzedniego dnia

## Narzędzia z GitHub Student Developer Pack

### Hosting i infrastruktura

- **Heroku**: Hosting backendu
- **Netlify**: Hosting frontendu
- **Namecheap**: Domena .me

### Narzędzia deweloperskie

- **GitHub Copilot**: Asystent AI do pisania kodu
- **Sentry**: Monitoring błędów
- **BrowserStack**: Testowanie na różnych przeglądarkach

### Płatności

- **Stripe**: Obsługa płatności online

## Środowisko deweloperskie

- **Docker**: Kontenery dla backendu i bazy danych
- **VS Code**: Edytor kodu
- **PostgreSQL**: Baza danych
