from django.contrib import admin
from .secondmodels import (
    ItemCategoryMas1,
    ItemCategoryMas2,
    ItemCategoryMas3,
    ItemCategoryMas4,
    ItemCategoryMas5,
    ItemCategoryMas6,
    ItemCategoryMas7,
    ItemCategoryMas8,
    ItemCategoryMas9,
    ItemCategoryMas10,
)

@admin.register(ItemCategoryMas1)
class ItemCategoryMas1Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas2)
class ItemCategoryMas2Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas3)
class ItemCategoryMas3Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas4)
class ItemCategoryMas4Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas5)
class ItemCategoryMas5Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas6)
class ItemCategoryMas6Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas7)
class ItemCategoryMas7Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas8)
class ItemCategoryMas8Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas9)
class ItemCategoryMas9Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)


@admin.register(ItemCategoryMas10)
class ItemCategoryMas10Admin(admin.ModelAdmin):
    list_display = ('id', 'name', 'shortname', 'active', 'admin_id', 'created_at')
    search_fields = ('name', 'shortname')
    list_filter = ('active',)
