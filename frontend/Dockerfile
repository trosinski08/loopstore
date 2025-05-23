FROM node:22-slim


# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki package.json i package-lock.json
COPY package*.json ./

# Zainstaluj zależności
RUN npm install
# RUN npm ci

# Skopiuj resztę plików
COPY . .

# Zbuduj aplikację
RUN npm run build

# Ustaw zmienne środowiskowe
ENV NODE_ENV=production
ENV PORT=3000

# Ustaw domyślny punkt wejścia
ENTRYPOINT ["npm", "start"] 