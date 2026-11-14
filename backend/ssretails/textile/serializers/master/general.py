# textile/serializers/master/general.py
from rest_framework import serializers

from textile.models import (
    CountryMas, StateMas, CityMas, TitleMas, GradeMas, GroupMas, CategoryMas,
    RelationMas, ReligionMas, OccupationMas, BankMas, EmployeeMas, TaxTypeMas,
    SystemMas, CounterMas, SystemCounterIntegrationMas, CounterGroupMas,
    GiftvoucherMas, PaymentModeMas, DiscountTypeMas, IncomeAndExpenseMas,
    DepartmentMas, FloorMas, TransferModeMas, StarMas
)


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Country name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Country name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class StateSerializer(serializers.ModelSerializer):
    country_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StateMas
        fields = ["id", "admin_id", "name", "shortname", "country_id", "country_name", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_country_name(self, obj):
        if obj.country_id:
            c = CountryMas.objects.filter(id=obj.country_id).first()
            if c:
                return c.name
        return None

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("State name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("State name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class CitySerializer(serializers.ModelSerializer):
    state_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CityMas
        fields = [
            "id", "admin_id", "name", "shortname", "state_id", "state_name", "active", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def get_state_name(self, obj):
        if obj.state_id:
            state = StateMas.objects.filter(id=obj.state_id).first()
            if state:
                return state.name
        return None

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("City name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("City name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TitleMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Title name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Title name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Grade name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Grade name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Group name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Group name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Category name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Category name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class RelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Relation name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Relation name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class ReligionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReligionMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Religion name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Religion name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class OccupationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupationMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Occupation name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Occupation name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class SystemMasSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemMas
        fields = ["id", "admin_id", "name", "shortname", "mac_id", "allow_scheme", "seperator", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class SystemCounterIntegrationSerializer(serializers.ModelSerializer):
    system_name = serializers.CharField(source="system.name", read_only=True)
    counter_name = serializers.CharField(source="counter.name", read_only=True)

    class Meta:
        model = SystemCounterIntegrationMas
        fields = ["id", "admin_id", "system_id", "counter_id", "system_name", "counter_name", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class TaxTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxTypeMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class CounterSerializer(serializers.ModelSerializer):
    counter_group_name = serializers.CharField(source="counter_group.name", read_only=True)

    class Meta:
        model = CounterMas
        fields = ["id", "admin_id", "name", "shortname", "counter_group_id", "counter_group_name", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class CounterGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounterGroupMas
        fields = ["id", "admin_id", "name", "shortname", "bill_prefix", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class IncomeAndExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeAndExpenseMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class GiftvoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftvoucherMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class PaymentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentModeMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class DiscountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountTypeMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = FloorMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class TransferModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferModeMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class StarSerializer(serializers.ModelSerializer):
    class Meta:
        model = StarMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

