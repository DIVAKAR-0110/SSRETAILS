# textile/serializers/master/company.py
from rest_framework import serializers
from textile.models import CompanyMas, CityMas, StateMas, CountryMas


class CompanySerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CompanyMas
        fields = [
            "id", "title_id", "name", "shortname", "print_name",
            "address", "print_address", "city_id", "city_name",
            "state_name", "country_name", "pincode", "phoneno",
            "mobile", "fax", "email", "website", "tin_no",
            "tin_date", "area_code", "cst_no", "cst_date",
            "pan_no", "tan_no", "esi_no", "pf_no", "ie_code",
            "greetings", "ret_greetings", "set_greetings", "gst_no",
            "active", "admin_id", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_city_name(self, obj):
        if obj.city_id:
            city = CityMas.objects.filter(id=obj.city_id).first()
            if city:
                return city.name
        return None

    def get_state_name(self, obj):
        if obj.city_id:
            city = CityMas.objects.filter(id=obj.city_id).first()
            if city and city.state_id:
                state = StateMas.objects.filter(id=city.state_id).first()
                if state:
                    return state.name
        return None

    def get_country_name(self, obj):
        if obj.city_id:
            city = CityMas.objects.filter(id=obj.city_id).first()
            if city and city.state_id:
                state = StateMas.objects.filter(id=city.state_id).first()
                if state and state.country_id:
                    country = CountryMas.objects.filter(id=state.country_id).first()
                    if country:
                        return country.name
        return None

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Company name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Company name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_gst_no(self, value):
        if value:
            val = value.strip().upper()
            if len(val) > 30:
                raise serializers.ValidationError("GST NO cannot exceed 30 characters.")
            return val
        return value
