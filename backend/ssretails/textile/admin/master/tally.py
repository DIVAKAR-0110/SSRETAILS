# textile/admin/master/tally.py
from django.contrib import admin
from textile.models import GroupHeadMas, AccountHeadMas


@admin.register(GroupHeadMas)
class GroupHeadMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")


@admin.register(AccountHeadMas)
class AccountHeadMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname")
