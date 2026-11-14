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


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StateMas
        fields = ["id", "admin_id", "name", "shortname", "country_id", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class CitySerializer(serializers.ModelSerializer):
    country_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CityMas
        fields = [
            "id", "admin_id", "name", "shortname", "state_id", "country_id", "active", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def get_country_id(self, obj):
        if obj.state_id:
            state = StateMas.objects.filter(id=obj.state_id).first()
            if state:
                return state.country_id
        return None


class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TitleMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class RelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class ReligionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReligionMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class OccupationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupationMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


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

