# textile/serializers/master/location.py
from rest_framework import serializers
from textile.models import LocationMas


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationMas
        fields = [
            "id", "name", "shortname", "code", "company_id", "address",
            "city_id", "phoneno", "mobile", "fax", "email", "website",
            "tinno", "tindate", "areaid", "cstno", "cstdate", "active",
            "created_at", "admin_id", "pinid", "servername", "serveruid",
            "dbname", "serverpwd", "servermode", "protocol", "mainserver",
            "accdbname", "ipaddress", "uploaddata",
        ]
        read_only_fields = ["id", "created_at"]

