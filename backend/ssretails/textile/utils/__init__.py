# textile/utils/__init__.py
from django.core.mail import send_mail
from django.conf import settings

from .sp_executor import (
    execute_master_sp,
    execute_sp_select,
    get_sp_parameters,
    StoredProcedureMasterViewSetMixin,
)

def send_login_mail(email, subject, message):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=True,
    )
