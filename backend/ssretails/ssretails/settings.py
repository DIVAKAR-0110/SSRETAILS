from pathlib import Path

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent


# =========================
# CORE SETTINGS
# =========================

SECRET_KEY = 'django-insecure-localhost-only-very-secure-key'

DEBUG = True


ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
]


# =========================
# APPLICATIONS
# =========================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'textile',
]


# =========================
# MIDDLEWARE
# =========================

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# =========================
# CORS (LOCAL FRONTEND ONLY)
# =========================

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_ALL_ORIGINS = False


# =========================
# URLS / WSGI
# =========================

ROOT_URLCONF = 'ssretails.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ssretails.wsgi.application'


# =========================
# DATABASE (MS SQL SERVER)
# =========================

DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'GANESHSSRETAIL',
        'HOST': r'localhost\SQL2008',
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
            'trusted_connection': 'yes',
        },
    },
    'transaction': {
        'ENGINE': 'mssql',
        'NAME': 'GANESHSSRETAILTRAN',
        'HOST': r'localhost\SQL2008',
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
            'trusted_connection': 'yes',
        },
    },
}

DATABASE_ROUTERS = ['ssretails.router.TransactionRouter']


# =========================
# PASSWORD VALIDATION
# =========================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# =========================
# INTERNATIONALIZATION
# =========================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# =========================
# EMAIL (LOCAL USE)
# =========================

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "divaleetcode@gmail.com"
EMAIL_HOST_PASSWORD = "lglj fcjx vpqr kbtz"
DEFAULT_FROM_EMAIL = "SSRetails <divaleetcode@gmail.com>"


# =========================
# STATIC FILES
# =========================

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_DIRS = [
    BASE_DIR / "textile" / "assets",
]


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
