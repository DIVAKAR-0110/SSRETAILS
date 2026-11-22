# textile/admin/master/purchase_type.py
from django.contrib import admin
from textile.models import PurchaseTypeMas


@admin.register(PurchaseTypeMas)
class PurchaseTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "maximumamount", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)
