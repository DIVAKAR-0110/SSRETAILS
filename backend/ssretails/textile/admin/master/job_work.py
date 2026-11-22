# textile/admin/master/job_work.py
from django.contrib import admin
from textile.models import JobWorkChargeHeadMas


@admin.register(JobWorkChargeHeadMas)
class JobWorkChargeHeadAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)
