# textile/serializers/master/item_definition.py
from rest_framework import serializers

from textile.models import (
    ItemCategoryMas1, ItemCategoryMas2, ItemCategoryMas3, ItemCategoryMas4,
    ItemCategoryMas5, ItemCategoryMas6, ItemCategoryMas7, ItemCategoryMas8,
    ItemCategoryMas9, ItemCategoryMas10
)


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas1
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas2
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class StyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas3
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class PatternSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas4
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas5
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class HsnCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas6
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class FloorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas7
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas8
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class SectionGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas9
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class SizeOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas10
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

