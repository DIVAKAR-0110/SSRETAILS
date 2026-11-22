# textile/serializers/master/purchase_type.py
from rest_framework import serializers
from textile.models import PurchaseTypeMas


class PurchaseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseTypeMas
        fields = ["id", "admin_id", "name", "shortname", "maximumamount", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Purchase type name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Purchase type name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        if value:
            val = value.strip().upper()
            if len(val) > 25:
                raise serializers.ValidationError("Short name cannot exceed 25 characters.")
            return val
        return ""

    def validate_maximumamount(self, value):
        if value is None:
            return 0.00000
        try:
            val = round(float(value), 5)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Maximum amount must be a valid number.")
        if val < 0:
            raise serializers.ValidationError("Maximum amount cannot be negative.")
        return val
