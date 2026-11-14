# textile/admin/auth.py
from django.contrib import admin
from textile.models import Administrator


@admin.register(Administrator)
class AdministratorAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("username", "email")
    ordering = ("-created_at",)

    fieldsets = (
        ("Admin Credentials", {
            "fields": ("username", "email", "password")
        }),
        ("Status", {
            "fields": ("active",)
        }),
        ("Timestamps", {
            "fields": ("created_at",)
        }),
    )

    readonly_fields = ("created_at",)

