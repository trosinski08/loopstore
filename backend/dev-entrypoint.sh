#!/bin/bash

# Diagnostyka środowiska
echo "$(date): Starting dev-entrypoint.sh script..."
echo "$(date): Checking for Python and Django..."
python --version

# Upewnij się, że Django jest zainstalowane w trybie deweloperskim
if ! python -c "import django" &> /dev/null; then
    echo "$(date): Django not found, installing requirements..."
    pip install -r requirements.txt
else
    echo "$(date): Django is already installed"
fi

# Wykonaj standardowy skrypt entry.sh
exec /usr/local/bin/entry.sh "$@"
