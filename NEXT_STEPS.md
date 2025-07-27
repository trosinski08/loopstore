# LoopStore – Next Steps (Audit 2025-07-27)

Poniższa lista została utworzona na podstawie audytu repozytorium `loopstore` i stanowi plan najbliższych działań. Każdy punkt należy traktować jako osobne zadanie do wykonania.

1. Wprowadzić pełny pipeline CI (GitHub Actions) obejmujący lint, testy jednostkowe i budowę obrazów.
2. Skonfigurować pre-commit hooks (Python – black, isort, flake8; JS/TS – eslint, prettier; CSS – stylelint).
3. Ujednolicić routingi w Next.js: wybrać między `app/` a `pages/` i usunąć duplikaty.
4. Oczyścić i usystematyzować ustawienia Django (secret key z ENV, `DEBUG=False` w prod, `ALLOWED_HOSTS`).
5. Rozszerzyć testy backendu (modele i API) oraz dodać testy e2e dla frontu (Playwright/Cypress).
6. Zaimplementować security hardening: rate-limiting, CSRF, CORS, brute-force protection.
7. Oczyścić repozytorium z plików tymczasowych (np. `ERROR`, `transferring`) i dodać `.env.example` z opisem.
8. Uzupełnić Docker Compose o healthchecki, przygotować multi-stage Dockerfile (prod) i odchudzić obrazy.
9. Wdrożyć klienta danych (SWR/React Query) w front-endzie z obsługą cache i błędów.
10. Zintegrować koszyk i zamówienia po stronie backendu (walidacja stocku i ceny). 