from .base import *
import urllib.parse
import secrets

# Generate a secure secret key
SECRET_KEY = secrets.token_urlsafe(50)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Limit allowed hosts even in development
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']

# Database configuration with security improvements
database_url = os.environ.get('DATABASE_URL')
if database_url:
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
        'OPTIONS': {
            'sslmode': 'prefer',
        },
    }
}

# CORS settings with more restrictive configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:80",
    "http://127.0.0.1:80",
    "http://localhost",
    "http://127.0.0.1"
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

# Security middleware settings
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# Replace CORS_ALLOW_ALL_ORIGINS with specific origins
CORS_ALLOW_ALL_ORIGINS = False  # More secure option 