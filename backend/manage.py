#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from django.core.management.commands.runserver import Command as RunserverCommand


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_web.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Override default runserver command to use SSL in development
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        RunserverCommand.default_port = '8443'
        RunserverCommand.default_addr = '0.0.0.0'
    
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
