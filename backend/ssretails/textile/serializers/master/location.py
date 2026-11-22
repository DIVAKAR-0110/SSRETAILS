# textile/serializers/master/location.py
from rest_framework import serializers
from textile.models import LocationMas, CourierTypeMas


class LocationSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = LocationMas
        fields = [
            "id", "name", "shortname", "address",
            "city_id", "city_name", "state_name", "country_name",
            "phoneno", "mobile", "fax", "email", "website",
            "tinno", "tindate", "areaid", "cstno", "cstdate", "active",
            "created_at", "admin_id", "pinid", "servername", "serveruid",
            "dbname", "serverpwd", "servermode", "protocol", "mainserver",
            "accdbname", "ipaddress", "uploaddata",
        ]
        read_only_fields = ["id", "created_at"]

    def get_city_name(self, obj):
        if obj.city_id:
            from textile.models import CityMas
            city = CityMas.objects.filter(id=obj.city_id).first()
            if city:
                return city.name
        return ""

    def get_state_name(self, obj):
        if obj.city_id:
            from textile.models import CityMas, StateMas
            city = CityMas.objects.filter(id=obj.city_id).first()
            if city and city.state_id:
                state = StateMas.objects.filter(id=city.state_id).first()
                if state:
                    return state.name
        return ""

    def get_country_name(self, obj):
        if obj.city_id:
            from textile.models import CityMas, StateMas, CountryMas
            city = CityMas.objects.filter(id=obj.city_id).first()
            if city and city.state_id:
                state = StateMas.objects.filter(id=city.state_id).first()
                if state and state.country_id:
                    country = CountryMas.objects.filter(id=state.country_id).first()
                    if country:
                        return country.name
        return ""

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        for date_field in ["tindate", "cstdate"]:
            if date_field in data and (data[date_field] == "" or data[date_field] is None):
                data[date_field] = None
        for str_field in ["servername", "serveruid", "dbname", "serverpwd", "servermode", "protocol", "accdbname", "ipaddress"]:
            if str_field in data and data[str_field] is None:
                data[str_field] = ""
        return super().to_internal_value(data)

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Location name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Location name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_address(self, value):
        if value and len(value) > 400:
            raise serializers.ValidationError("Address cannot exceed 400 characters.")
        return value


class CourierTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourierTypeMas
        fields = ["id", "name", "shortname", "active", "admin_id", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Courier type name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Courier type name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val
