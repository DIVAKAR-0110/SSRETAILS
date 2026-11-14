# textile/views/__init__.py
"""
Views Layer entry point.
Exposes all auth and master viewsets for backward-compatible routing.
"""
from .auth import errorpage, admin_login, admin_register
from .master import *

