FROM python:3.12-slim

# Ustaw katalog roboczy
WORKDIR /app

# Zaktualizuj i uaktualnij pakiety bazowe, aby usunąć znane podatności z obrazu bazowego
RUN apt-get update && apt-get upgrade -y --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Skopiuj plik requirements.txt
COPY requirements.txt /app/
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
COPY entry.sh /usr/local/bin/entry.sh

COPY . /app
# Zainstaluj zależności
RUN pip install --no-cache-dir -r requirements.txt

RUN chmod +x /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/entry.sh

# Ustaw domyślny punkt wejścia
ENTRYPOINT ["/usr/local/bin/entry.sh"]

# Domyślna komenda (uruchomienie serwera Django)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]