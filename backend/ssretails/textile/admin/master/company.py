# textile/admin/master/company.py
from django.contrib import admin
from textile.models import CompanyMas


@admin.register(CompanyMas)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "print_name", "city_id", "phoneno", "mobile", "gst_no", "active", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname", "gst_no", "pan_no")
    ordering = ("-created_at",)
