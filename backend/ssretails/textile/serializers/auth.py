# textile/serializers/auth.py
from django.contrib.auth.hashers import check_password
from rest_framework import serializers

from textile.models import Administrator


class AdministratorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, max_length=32)

    class Meta:
        model = Administrator
        fields = ["id", "username", "email", "password", "active", "created_at"]
        read_only_fields = ["id", "active", "created_at"]

    def create(self, validated_data):
        admin = Administrator(**validated_data)
        admin.active = True
        admin.save()
        return admin


class AdministratorLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, max_length=32)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            admin = Administrator.objects.get(email=email, active=True)
        except Administrator.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not check_password(password, admin.password):
            raise serializers.ValidationError("Invalid credentials")

        attrs["admin"] = admin
        return attrs

