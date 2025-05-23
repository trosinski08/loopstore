import os
 
# Set default settings module based on environment
if os.environ.get('DJANGO_ENV') == 'production':
    from .production import *
else:
    from .base import * 