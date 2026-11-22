# textile/serializers/master/general.py
from rest_framework import serializers

from textile.models import (
    CountryMas, StateMas, CityMas, TitleMas, GradeMas, GroupMas, CategoryMas,
    RelationMas, ReligionMas, OccupationMas, BankMas, EmployeeMas, TaxTypeMas,
    SystemMas, CounterMas, SystemCounterIntegrationMas, SystemCounterMas, SystemCounterDet,
    CounterGroupMas, PrintFunctionMas,
    GiftvoucherMas, PaymentModeMas, DiscountTypeMas, IncomeAndExpenseMas,
    DepartmentMas, FloorMas, TransferModeMas, StarMas, UserGroup, EmployeeIncentiveMas
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
        fields = ["id", "admin_id", "name", "shortname", "cardservicecharge", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Bank name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Bank name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = value.strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_cardservicecharge(self, value):
        if value is None:
            return 0.00
        if value < 0:
            raise serializers.ValidationError("Card service charge percentage cannot be negative.")
        if value > 100:
            raise serializers.ValidationError("Card service charge percentage cannot exceed 100%.")
        return round(float(value), 2)


class PrintFunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintFunctionMas
        fields = ["id", "name", "short_name", "active", "cashier_print"]
        read_only_fields = ["id"]


class SystemMasSerializer(serializers.ModelSerializer):
    location_name = serializers.SerializerMethodField(read_only=True)
    floor_name = serializers.SerializerMethodField(read_only=True)
    print_function_name = serializers.SerializerMethodField(read_only=True)
    settlement_print_function_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SystemMas
        fields = [
            "id", "location_id", "floor_id", "name", "short_name", "mac_id",
            "print_function_code", "group_bill_prefix", "seperator", "no_length",
            "last_no", "active", "admin_id", "created_at", "return_system",
            "settlement_print_function_code", "sys_ref_no", "allow_scheme",
            "printer_port_code",
            # Lookups
            "location_name", "floor_name", "print_function_name", "settlement_print_function_name"
        ]
        read_only_fields = ["id", "created_at"]

    def get_location_name(self, obj):
        if obj.location_id:
            from textile.models import LocationMas
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def get_floor_name(self, obj):
        if obj.floor_id:
            fl = FloorMas.objects.filter(id=obj.floor_id).first()
            return fl.name if fl else ""
        return ""

    def get_print_function_name(self, obj):
        if obj.print_function_code:
            pf = PrintFunctionMas.objects.filter(id=obj.print_function_code).first()
            return pf.name if pf else ""
        return ""

    def get_settlement_print_function_name(self, obj):
        if obj.settlement_print_function_code:
            pf = PrintFunctionMas.objects.filter(id=obj.settlement_print_function_code).first()
            return pf.name if pf else ""
        return ""

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("System name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("System name cannot exceed 50 characters.")
        return val

    def validate_short_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class SystemCounterDetSerializer(serializers.ModelSerializer):
    system_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SystemCounterDet
        fields = ["id", "location_id", "counter_id", "system_id", "counter_type", "system_name"]
        read_only_fields = ["id"]

    def get_system_name(self, obj):
        if obj.system_id:
            s = SystemMas.objects.filter(id=obj.system_id).first()
            return s.name if s else ""
        return ""


class SystemCounterIntegrationSerializer(serializers.ModelSerializer):
    location_name = serializers.SerializerMethodField(read_only=True)
    counter_name = serializers.SerializerMethodField(read_only=True)
    systems = SystemCounterDetSerializer(many=True, read_only=True)
    systems_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SystemCounterMas
        fields = [
            "id", "location_id", "counter_id", "counter_type", "admin_id",
            "created_at", "location_name", "counter_name", "systems", "systems_display"
        ]
        read_only_fields = ["id", "created_at"]

    def get_location_name(self, obj):
        if obj.location_id:
            from textile.models import LocationMas
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def get_counter_name(self, obj):
        if obj.counter_id:
            c = CounterMas.objects.filter(id=obj.counter_id).first()
            return c.name if c else ""
        return ""

    def get_systems_display(self, obj):
        det_ids = SystemCounterDet.objects.filter(
            location_id=obj.location_id,
            counter_id=obj.counter_id,
            counter_type=obj.counter_type
        ).values_list("system_id", flat=True)
        if not det_ids:
            return "None"
        names = list(SystemMas.objects.filter(id__in=det_ids).values_list("name", flat=True))
        return ", ".join(names) if names else "None"


class TaxTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxTypeMas
        fields = [
            "id", "admin_id", "entry_type", "name", "short_name",
            "tax_percent", "tax_on", "include", "active", "is_discount",
            "allow_sales", "allow_purchase", "acc_head_name", "account_post",
            "account_head_id", "account_sales_head_id", "ss_pur_acc_head_id",
            "ss_sal_acc_head_id", "tax_amt_cal_type", "allow_tax_amt_cal",
            "commodity_code", "section", "local_category", "other_category",
            "import_category", "category", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Tax name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Tax name cannot exceed 50 characters.")
        return val

    def validate_short_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_tax_percent(self, value):
        if value is None:
            return 0.00000
        try:
            val = round(float(value), 5)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Tax percent must be a valid number.")
        if val < 0:
            raise serializers.ValidationError("Tax percent cannot be negative.")
        return val


class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = ["id", "name", "shortname", "active"]


class EmployeeIncentiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeIncentiveMas
        fields = ["id", "employee_code", "range_from", "range_to", "incentive_percentage", "incentive_amount"]


class EmployeeSerializer(serializers.ModelSerializer):
    location_name = serializers.SerializerMethodField(read_only=True)
    department_name = serializers.SerializerMethodField(read_only=True)
    floor_name = serializers.SerializerMethodField(read_only=True)
    city_name = serializers.SerializerMethodField(read_only=True)
    incentive_details = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )

    class Meta:
        model = EmployeeMas
        fields = [
            "id", "name", "short_name", "print_name", "location_code", "location_name",
            "floor_code", "floor_name", "department_code", "department_name",
            "address", "city_code", "city_name", "pincode",
            "phoneno", "mobile", "fax", "email", "website", "panno",
            "dob", "doj", "dol",
            "commission_allowed", "commission_percent",
            "salesman_incentive", "incentive_qty_based", "incentive_percentage", "incentive_amount",
            "max_advance", "target_amount",
            "login_user", "user_group_code", "password",
            "active", "admin_id", "created_at",
            "incentive_details"
        ]
        read_only_fields = ["id", "created_at"]

    def get_location_name(self, obj):
        if obj.location_code:
            from textile.models import LocationMas
            loc = LocationMas.objects.filter(id=obj.location_code).first()
            return loc.name if loc else ""
        return ""

    def get_department_name(self, obj):
        if obj.department_code:
            from textile.models import DepartmentMas
            dep = DepartmentMas.objects.filter(id=obj.department_code).first()
            return dep.name if dep else ""
        return ""

    def get_floor_name(self, obj):
        if obj.floor_code:
            from textile.models import FloorMas
            flr = FloorMas.objects.filter(id=obj.floor_code).first()
            return flr.name if flr else ""
        return ""

    def get_city_name(self, obj):
        if obj.city_code:
            from textile.models import CityMas
            city = CityMas.objects.filter(id=obj.city_code).first()
            return city.name if city else ""
        return ""

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Employee name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Employee name cannot exceed 50 characters.")
        return val

    def validate_short_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_print_name(self, value):
        if not value:
            return ""
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("Print name cannot exceed 50 characters.")
        return val

    def validate_panno(self, value):
        if not value:
            return ""
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("PAN cannot exceed 50 characters.")
        return val

    def validate_address(self, value):
        if not value:
            return ""
        val = value.strip()
        if len(val) > 400:
            raise serializers.ValidationError("Address cannot exceed 400 characters.")
        return val

    def sync_incentives(self, employee, details):
        if details is None:
            return
        EmployeeIncentiveMas.objects.filter(employee_code=employee.id).delete()
        for item in details:
            r_from = item.get("range_from") or 0
            r_to = item.get("range_to") or 0
            pct = item.get("incentive_percentage") or item.get("percentage") or 0
            amt = item.get("incentive_amount") or item.get("amount") or 0
            EmployeeIncentiveMas.objects.create(
                employee_code=employee.id,
                range_from=r_from,
                range_to=r_to,
                incentive_percentage=pct,
                incentive_amount=amt
            )

    def create(self, validated_data):
        incentive_details = validated_data.pop("incentive_details", None)
        employee = super().create(validated_data)
        self.sync_incentives(employee, incentive_details)
        return employee

    def update(self, instance, validated_data):
        incentive_details = validated_data.pop("incentive_details", None)
        employee = super().update(instance, validated_data)
        self.sync_incentives(employee, incentive_details)
        return employee


class CounterSerializer(serializers.ModelSerializer):
    location_name = serializers.SerializerMethodField(read_only=True)
    counter_group_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CounterMas
        fields = [
            "id", "location_id", "name", "short_name", "counter_group_id",
            "counter_order", "section_code", "active", "admin_id", "created_at",
            "location_name", "counter_group_name"
        ]
        read_only_fields = ["id", "created_at"]

    def get_location_name(self, obj):
        if obj.location_id:
            from textile.models import LocationMas
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def get_counter_group_name(self, obj):
        if obj.counter_group_id:
            cg = CounterGroupMas.objects.filter(id=obj.counter_group_id).first()
            return cg.name if cg else ""
        return ""

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Counter name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Counter name cannot exceed 50 characters.")
        return val

    def validate_short_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class CounterGroupSerializer(serializers.ModelSerializer):
    location_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CounterGroupMas
        fields = ["id", "admin_id", "location_id", "location_name", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_location_name(self, obj):
        if obj.location_id:
            from textile.models import LocationMas
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            if loc:
                return loc.name
        return None

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Counter Group name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Counter Group name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class IncomeAndExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeAndExpenseMas
        fields = [
            "id", "name", "shortname", "head_type", "account_head_name",
            "account_post", "account_head_code", "active", "admin_id", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Income/Expense name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Income/Expense name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_account_head_name(self, value):
        if not value:
            return ""
        val = value.strip()
        if len(val) > 100:
            raise serializers.ValidationError("Account Head Name cannot exceed 100 characters.")
        return val


class GiftvoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftvoucherMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Gift voucher name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Gift voucher name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class PaymentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentModeMas
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Payment mode name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Payment mode name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class DiscountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountTypeMas
        fields = ["id", "admin_id", "name", "shortname", "discper", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Discount type name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Discount type name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_discper(self, value):
        if value is None:
            return 0.00
        try:
            val = round(float(value), 2)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Discount percentage must be a valid number.")
        if val < 0:
            raise serializers.ValidationError("Discount percentage cannot be negative.")
        if val > 100:
            raise serializers.ValidationError("Discount percentage cannot exceed 100%.")
        return val


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentMas
        fields = ["id", "admin_id", "name", "shortname", "perdaycommission", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Department name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Department name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val

    def validate_perdaycommission(self, value):
        if value is None:
            return 0.00000
        if value < 0:
            raise serializers.ValidationError("Per day commission cannot be negative.")
        return round(float(value), 5)


class FloorSerializer(serializers.ModelSerializer):
    location_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FloorMas
        fields = ["id", "admin_id", "location_id", "location_name", "name", "shortname", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_location_name(self, obj):
        if obj.location_id:
            from textile.models import LocationMas
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            if loc:
                return loc.name
        return None

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Floor name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Floor name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class TransferModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferModeMas
        fields = ["id", "admin_id", "name", "shortname", "numgeneration", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Transfer mode name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Transfer mode name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        if value:
            val = value.strip().upper()
            if len(val) > 25:
                raise serializers.ValidationError("Short name cannot exceed 25 characters.")
            return val
        return ""


class StarSerializer(serializers.ModelSerializer):
    class Meta:
        model = StarMas
        fields = ["id", "admin_id", "starname", "starvalue", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_starname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Star name is required.")
        if len(val) > 10:
            raise serializers.ValidationError("Star name cannot exceed 10 characters.")
        return val

    def validate_starvalue(self, value):
        if value is None:
            raise serializers.ValidationError("Star value is required.")
        try:
            val = round(float(value), 2)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Star value must be a valid number.")
        if val < 0:
            raise serializers.ValidationError("Star value cannot be negative.")
        return val

