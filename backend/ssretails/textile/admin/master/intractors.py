# textile/admin/master/intractors.py
from django.contrib import admin
from textile.models import (
    SupplierMas, AgentMas, ManufactureMas, CustomerMas, CourierMas, TransportMas
)


@admin.register(SupplierMas)
class SupplierMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")


@admin.register(AgentMas)
class AgentMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")


@admin.register(ManufactureMas)
class ManufactureMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")


@admin.register(CustomerMas)
class CustomerMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")


@admin.register(CourierMas)
class CourierMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")


@admin.register(TransportMas)
class TransportMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")

