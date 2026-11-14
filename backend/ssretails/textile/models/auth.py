# textile/models/auth.py
from django.db import models
from django.contrib.auth.hashers import make_password


class Administrator(models.Model):
    username = models.CharField(max_length=120, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    class Meta:
        app_label = 'textile'
        db_table = "administrator"
        ordering = ["-created_at"]

    def __str__(self):
        return self.username

