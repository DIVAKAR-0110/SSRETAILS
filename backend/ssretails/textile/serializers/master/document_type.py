# textile/serializers/master/document_type.py
from rest_framework import serializers
from textile.models import DocumentTypeMas


class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentTypeMas
        fields = ["id", "admin_id", "name", "shortname", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Document type name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Document type name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val
