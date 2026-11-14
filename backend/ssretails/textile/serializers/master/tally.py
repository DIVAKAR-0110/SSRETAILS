# textile/serializers/master/tally.py
from rest_framework import serializers
from textile.models import GroupHeadMas, AccountHeadMas


class GroupHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupHeadMas
        fields = [
            "id", "name", "short_name", "group_head_code", "is_primary",
            "type", "active", "admin_id", "created_at"
        ]
        read_only_fields = ["id", "created_at"]


class AccountHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountHeadMas
        fields = [
            "id", "name", "short_name", "head_type", "active", "admin_id",
            "created_at", "group_head_id", "classification_name", "accessible_value"
        ]
        read_only_fields = ["id", "created_at"]

