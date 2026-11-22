# textile/admin/master/location.py
from django.contrib import admin
from textile.models import LocationMas


@admin.register(LocationMas)
class LocationMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")

