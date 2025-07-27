from .base import *
import urllib.parse
import secrets

# Generate a secure secret key
SECRET_KEY = secrets.token_urlsafe(50)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Development-specific settings
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'backend']

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
        'NAME': 'loopstore_db',
        'USER': 'postgres',
        'PASSWORD': 'Loops123!',
        'HOST': 'db',
        'PORT': '5432',
    }
}

# Override REST Framework settings for development
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
}

# CORS settings for development
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://frontend:3000',
    'http://host.docker.internal:3000',  # For Docker Desktop on Windows/Mac
    'http://localhost:8000', # Added for backend access
    'http://127.0.0.1:8000', # Added for backend access
    'http://backend:8000', # Added for backend access
    'http://localhost:80', # Nginx
    'http://127.0.0.1:80', # Nginx
    'http://localhost', # Nginx without port
    'http://127.0.0.1', # Nginx without port
    'https://localhost:8443', # If you use HTTPS for backend directly
    'https://127.0.0.1:8443', # If you use HTTPS for backend directly
    'https://backend:8443', # If you use HTTPS for backend directly
]

# More permissive CORS for development troubleshooting
# CORS_ALLOW_ALL_ORIGINS = True # Keep this False for now, use specific origins

# Redis settings for development
REDIS_URL = 'redis://redis:6379/0'

# Cache settings
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': '/tmp/django_cache',
    }
}

# Session settings
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# Email settings for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Logging settings for development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
        'skip_static_file_messages': {
            '()': 'django.utils.log.CallbackFilter',
            'callback': lambda record: not (
                record.getMessage().startswith('File ') and
                record.getMessage().endswith(' first seen with mtime')
            ),
        },
    },
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'filters': ['skip_static_file_messages'],
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
        'django.security': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        # Wyciszenie komunikatów o ładowaniu plików statycznych
        'django.template': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}

# CORS settings with more restrictive configuration
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
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False

# Replace CORS_ALLOW_ALL_ORIGINS with specific origins
CORS_ALLOW_ALL_ORIGINS = False  # More secure option
CORS_ALLOW_CREDENTIALS = True # Allow cookies to be sent

# Ensure CSRF trusted origins includes the frontend's origin as seen by the backend
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://frontend:3000',
    'http://localhost:80', # Nginx
    'http://127.0.0.1:80', # Nginx
    'http://localhost', # Nginx without port
]