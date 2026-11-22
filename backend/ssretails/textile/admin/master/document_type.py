# textile/admin/master/document_type.py
from django.contrib import admin
from textile.models import DocumentTypeMas


@admin.register(DocumentTypeMas)
class DocumentTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "admin_id", "created_at")
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)
