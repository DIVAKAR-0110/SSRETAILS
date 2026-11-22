# textile/serializers/master/tally.py
from rest_framework import serializers
from textile.models import GroupHeadMas, AccountHeadMas


TYPE_MAP = {
    "A": "Asset",
    "L": "Liabilities",
    "I": "Income",
    "E": "Expenses",
}


class GroupHeadSerializer(serializers.ModelSerializer):
    parent_group_name = serializers.SerializerMethodField(read_only=True)
    type_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = GroupHeadMas
        fields = [
            "id", "name", "shortname", "group_head_code", "parent_group_name",
            "is_primary", "type", "type_name", "active", "admin_id", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def get_parent_group_name(self, obj):
        if obj.group_head_code:
            parent = GroupHeadMas.objects.filter(id=obj.group_head_code).first()
            if parent:
                return parent.name
        return ""

    def get_type_name(self, obj):
        return TYPE_MAP.get(obj.type, "") if obj.type else ""

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Group Head name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Group Head name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate(self, attrs):
        is_primary = attrs.get("is_primary", getattr(self.instance, "is_primary", False))
        if is_primary:
            attrs["group_head_code"] = 0
            grp_type = attrs.get("type", getattr(self.instance, "type", None))
            if grp_type and grp_type not in ["A", "L", "I", "E"]:
                raise serializers.ValidationError({"type": "Primary type must be Asset (A), Liabilities (L), Income (I), or Expenses (E)."})
        else:
            attrs["type"] = None
        return attrs


class AccountHeadSerializer(serializers.ModelSerializer):
    group_head_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AccountHeadMas
        fields = [
            "id", "name", "shortname", "head_type", "active", "admin_id",
            "created_at", "group_head_id", "group_head_name",
            "classification_name", "accessible_value"
        ]
        read_only_fields = ["id", "created_at"]

    def get_group_head_name(self, obj):
        if obj.group_head_id:
            gh = GroupHeadMas.objects.filter(id=obj.group_head_id).first()
            if gh:
                return gh.name
        return ""

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Account Head name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Account Head name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_classification_name(self, value):
        if value and len(value) > 50:
            raise serializers.ValidationError("Classification name cannot exceed 50 characters.")
        return value
