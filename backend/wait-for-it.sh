#!/bin/bash
# wait-for-it.sh - Czeka na dostępność hosta i portu, a następnie opcjonalnie wykonuje komendę.

set -e # Zakończ natychmiast, jeśli komenda zwróci niezerowy status.

TIMEOUT=0 # Domyślny timeout (0 = bez limitu)
STRICT_MODE=0 # Domyślnie nie jest w trybie strict
QUIET_MODE=0 # Domyślnie nie jest w trybie quiet
HOST=""
PORT=""
CHILD_CMD=()

usage() {
  cat << USAGE >&2
Usage:
  $0 host:port [-s] [-t timeout] [-q] [-- command args...]
  -h HOST | --host=HOST       Host lub IP do sprawdzenia
  -p PORT | --port=PORT       Port TCP do sprawdzenia
                              Alternatywnie, można użyć składni host:port jako pierwszego argumentu.
  -s | --strict               Zakończ z błędem, jeśli timeout zostanie osiągnięty
  -q | --quiet                Nie wyświetlaj żadnych komunikatów oprócz błędów
  -t TIMEOUT | --timeout=TIMEOUT
                              Timeout w sekundach, 0 oznacza brak limitu (domyślnie)
  -- COMMAND ARGS...          Komenda do wykonania po udanym połączeniu
USAGE
  exit 1
}

# Przetwarzanie argumentów
while [[ $# -gt 0 ]]; do
  case "$1" in
    *:* )
    if [[ -z "$HOST" && -z "$PORT" ]]; then
      HOST="${1%%:*}"
      PORT="${1##*:}"
    else
      CHILD_CMD+=("$1") # Jeśli host:port już ustawione, reszta to komenda
    fi
    shift
    ;;
    -h|--host)
    HOST="$2"
    if [[ -z "$HOST" ]]; then echo "Błąd: Brak wartości dla opcji $1." >&2; usage; fi
    shift 2
    ;;
    --host=*)
    HOST="${1#*=}"
    shift
    ;;
    -p|--port)
    PORT="$2"
    if [[ -z "$PORT" ]]; then echo "Błąd: Brak wartości dla opcji $1." >&2; usage; fi
    shift 2
    ;;
    --port=*)
    PORT="${1#*=}"
    shift
    ;;
    -t|--timeout)
    TIMEOUT="$2"
    if [[ -z "$TIMEOUT" ]]; then echo "Błąd: Brak wartości dla opcji $1." >&2; usage; fi
    shift 2
    ;;
    --timeout=*)
    TIMEOUT="${1#*=}"
    shift
    ;;
    -s|--strict)
    STRICT_MODE=1
    shift
    ;;
    -q|--quiet)
    QUIET_MODE=1
    shift
    ;;
    --) # Koniec opcji, reszta to komenda
    shift
    CHILD_CMD=("$@")
    break
    ;;
    -*) # Nieznana opcja
    echo "Błąd: Nieznana opcja: $1" >&2
    usage
    ;;
    *) # Argument, który nie jest opcją i nie jest host:port (jeśli host:port już ustawione)
       # lub jeśli -- nie zostało użyte, to jest to początek komendy
    CHILD_CMD+=("$1")
    shift
    ;;
  esac
done

if [[ -z "$HOST" || -z "$PORT" ]]; then
  echo "Błąd: Nie podano hosta lub portu." >&2
  usage
fi

# Pętla oczekiwania
start_time=$(date +%s)
SERVICE_UP=0
SERVICE_NAME="" # Nazwa usługi do logowania

# Określ typ usługi na podstawie portu (uproszczenie)
if [[ "$PORT" == "5432" ]]; then
  SERVICE_NAME="PostgreSQL"
elif [[ "$PORT" == "6379" ]]; then
  SERVICE_NAME="Redis"
else
  SERVICE_NAME="Usługa" # Generyczna nazwa
fi

until [ $SERVICE_UP -eq 1 ]; do
  # Sprawdź dostępność usługi
  if [[ "$SERVICE_NAME" == "PostgreSQL" ]]; then
    # Sprawdź PostgreSQL
    # Upewnij się, że zmienna POSTGRES_PASSWORD jest dostępna w środowisku tego skryptu
    if PGPASSWORD=${POSTGRES_PASSWORD:-} psql -h "$HOST" -p "$PORT" -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-postgres}" -c '\q' >/dev/null 2>&1; then
      SERVICE_UP=1
    fi
  elif [[ "$SERVICE_NAME" == "Redis" ]]; then
    # Sprawdź Redis
    if redis-cli -h "$HOST" -p "$PORT" ping >/dev/null 2>&1; then
      SERVICE_UP=1
    fi
  else
    # Domyślny, bardziej generyczny test (np. netcat, jeśli dostępny)
    # Tutaj można dodać próbę połączenia TCP, np. za pomocą `nc -z $HOST $PORT`
    # Dla uproszczenia, jeśli nie jest to znany port, zakładamy, że nie wiemy jak sprawdzić
    # i pętla będzie kontynuowana aż do timeoutu lub ręcznego przerwania.
    # Można też dodać `bash -c "exec 3<> /dev/tcp/$HOST/$PORT" 2>/dev/null` jako test TCP.
    # Na razie, dla nieznanych, nie robimy nic specjalnego, polegamy na timeout.
    if [[ $QUIET_MODE -eq 0 ]]; then
        >&2 echo "Nie można automatycznie sprawdzić typu usługi dla $SERVICE_NAME ($HOST:$PORT). Polegam na timeout."
    fi
    # Aby pętla nie była nieskończona dla nieznanych usług bez timeoutu, można dodać licznik prób.
    # Lub po prostu pozwolić timeoutowi zadziałać.
  fi

  if [ $SERVICE_UP -eq 1 ]; then
    if [[ $QUIET_MODE -eq 0 ]]; then
      >&2 echo "$SERVICE_NAME ($HOST:$PORT) jest dostępny."
    fi
    break # Wyjdź z pętli until
  else
    if [[ $QUIET_MODE -eq 0 ]]; then
      >&2 echo "$SERVICE_NAME ($HOST:$PORT) jest niedostępny - ponawiam próbę..."
    fi
  fi
  
  # Obsługa timeoutu
  if [[ "$TIMEOUT" -gt 0 ]]; then
    current_time=$(date +%s)
    elapsed_time=$((current_time - start_time))
    if [[ "$elapsed_time" -ge "$TIMEOUT" ]]; then
      if [[ $QUIET_MODE -eq 0 ]]; then
        >&2 echo "Timeout ($TIMEOUT s) osiągnięty - $SERVICE_NAME ($HOST:$PORT) nadal niedostępny."
      fi
      if [[ "$STRICT_MODE" -eq 1 ]]; then
        exit 1
      fi
      # Jeśli nie strict, a timeout osiągnięty, i jest komenda, nie wykonujemy jej.
      if [ ${#CHILD_CMD[@]} -gt 0 ]; then
          if [[ $QUIET_MODE -eq 0 ]]; then
            >&2 echo "Nie wykonuję komendy z powodu timeoutu."
          fi
      fi
      exit 0 # Zakończ pomyślnie (lub z kodem błędu, jeśli preferowane, gdy timeout i nie strict)
    fi
  fi
  sleep 1
done

# Wykonaj komendę potomną, jeśli została podana
if [ ${#CHILD_CMD[@]} -gt 0 ]; then
  if [[ $QUIET_MODE -eq 0 ]]; then
    >&2 echo "Wykonywanie komendy: ${CHILD_CMD[*]}"
  fi
  exec "${CHILD_CMD[@]}"
else
  if [[ $QUIET_MODE -eq 0 ]]; then
    >&2 echo "Brak komendy do wykonania."
  fi
fi