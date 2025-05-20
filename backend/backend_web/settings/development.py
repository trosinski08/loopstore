from .base import *
import urllib.parse

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-weyhvv4whj*!em(h-k0gv(!+o!4wurak6-%90iw#uwp_t&-=%f'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Database
# Parse DATABASE_URL to get password
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Example: postgres://postgres:password@db:5432/loopstore
    parsed_url = urllib.parse.urlparse(database_url)
    password = urllib.parse.unquote(parsed_url.password) if parsed_url.password else ''
    username = parsed_url.username or 'postgres'
    hostname = parsed_url.hostname or 'db'
    port = parsed_url.port or '5432'
    database_name = parsed_url.path[1:] if parsed_url.path else 'loopstore'
else:
    password = ''
    username = 'postgres'
    hostname = 'db'
    port = '5432'
    database_name = 'loopstore'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': database_name,
        'USER': username,
        'PASSWORD': password,
        'HOST': hostname,
        'PORT': port,
    }
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost",
    "http://127.0.0.1",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_EXPOSE_HEADERS = ['content-type', 'content-length']
CORS_ALLOW_ALL_ORIGINS = True  # Only for development! 