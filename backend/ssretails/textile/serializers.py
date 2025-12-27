# backend/ssretails/textile/serializers.py
from django.contrib.auth.hashers import check_password
from rest_framework import serializers

from .models import *
from .secondmodels import *


class AdministratorSerializer(serializers.ModelSerializer):
    # write_only password so hash never goes back to frontend
    password = serializers.CharField(write_only=True, min_length=6, max_length=32)

    class Meta:
        model = Administrator
        fields = ["id", "username", "email", "password", "active", "created_at"]
        read_only_fields = ["id", "active", "created_at"]

    def create(self, validated_data):
        # model.save() already hashes password via make_password
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

        # compare raw password with stored hash
        if not check_password(password, admin.password):
            raise serializers.ValidationError("Invalid credentials")  # no detail leak

        attrs["admin"] = admin
        return attrs



# =====================


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryMas
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]



class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StateMas
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "country_id",   # plain integer
            "active",
            "created_at",
        ]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CityMas
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "state_id",
            "country_id",
            "active",
            "created_at",
        ]


class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TitleMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]


class RelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]


class ReligionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReligionMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]


class OccupationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupationMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]



class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankMas
        fields = [
            "id",
            "name",
            "shortname",
            "cardservicecharge",
            "active",
            "admin_id",
            "created_at",
            "altered_at",
        ]

class SystemMasSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemMas
        fields = [
            "id",
            "location_id",
            "name",
            "short_name",
            "mac_id",
            "print_function_code",
            "group_bill_prefix",
            "seperator",
            "no_length",
            "last_no",
            "active",
            "admin_id",
            "created_at",
            "floor_code",
            "return_system",
            "settlement_print_function_code",
            "sys_ref_no",
            "allow_scheme",
            "printer_port_code",
        ]

class SystemCounterIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemCounterIntegrationMas
        fields = [
            "id",
            "counter_id",
            "system_id",
            "admin_id",
            "created_at",
            "location_id",
        ]

class TaxTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxTypeMas
        fields = [
            "id",
            "entry_type",
            "name",
            "short_name",
            "tax_percent",
            "tax_on",
            "include",
            "active",
            "created_at",
            "admin_id",
            "is_discount",
            "allow_sales",
            "allow_purchase",
            "acc_head_name",
            "account_post",
            "account_head_id",
            "account_sales_head_id",
            "ss_pur_acc_head_id",
            "ss_sal_acc_head_id",
            "tax_amt_cal_type",
            "allow_tax_amt_cal",
            "commodity_code",
            "section",
            "local_category",
            "other_category",
            "import_category",
            "category",
        ]



class EmployeeSerializer(serializers.ModelSerializer):
    dob = serializers.DateTimeField(required=False, allow_null=True)
    doj = serializers.DateTimeField(required=False, allow_null=True)
    dol = serializers.DateTimeField(required=False, allow_null=True)
    access_time_from = serializers.DateTimeField(required=False, allow_null=True)
    access_time_to = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = EmployeeMas
        fields = [
            "id",
            "location_code",
            "title_code",
            "name",
            "short_name",
            "address",
            "city_code",
            "pincode",
            "dob",
            "doj",
            "dol",
            "phoneno",
            "mobile",
            "fax",
            "email",
            "website",
            "panno",
            "commission_allowed",
            "commission_percent",
            "salesman_incentive",
            "incentive_qty_based",
            "incentive_percentage",
            "incentive_amount",
            "login_user",
            "user_group_code",
            "password",
            "editing_no_of_days",
            "profit_from_cost",
            "access_time_from",
            "access_time_to",
            "system_restrict",
            "sales_less_cost_in_pur",
            "sales_less_cost_in_sales",
            "old_bill_cancel",
            "default_page",
            "desc_edit",
            "change_emp_rights",
            "allow_sales_discount",
            "active",
            "skin_name",
            "admin_id",
            "created_at",
            "department_code",
            "allow_change_location",
            "allow_view_actual_sales",
            "floor_code",
            "allow_lock_date",
            "stock_verification",
            "report_column_change",
            "day_based_incentive",
            "day_based_incentive_amount",
            "allow_all_user",
            "print_name",
            "max_advance",
            "allow_view_cost",
            "is_admin",
            "approved",
            "allow_multi_systems",
            "no_of_systems",
            "display_company_form",
            "target_amount",
        ]



class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounterMas
        fields = [
            "id",
            "location_id",
            "name",
            "short_name",
            "counter_group_id",
            "active",
            "admin_id",
            "created_at",
            "section_code",
            "counter_order",
        ]

class CounterGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounterGroupMas
        fields = [
            "id",
            "location_code",
            "name",
            "short_name",
            "active",
            "admin_id",
            "created_at",
        ]

class IncomeAndExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeAndExpenseMas
        fields = [
            "id",
            "name",
            "short_name",
            "active",
            "admin_id",
            "created_at",
            "head_type",
            "account_head_name",
            "account_post",
            "account_head_code",
        ]

class GiftvoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftvoucherMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]

class PaymentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentModeMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
        ]

class DiscountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountTypeMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
            "discper",
        ]



class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
            "perdaycommission",
        ]

class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = FloorMas
        fields = [
            "id",
            "location_id",
            "name",
            "short_name",
            "active",
            "admin_id",
            "created_at",
        ]

class TransferModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferModeMas
        fields = [
            "id",
            "name",
            "shortname",
            "active",
            "admin_id",
            "created_at",
            "numgeneration",
        ]

class StarSerializer(serializers.ModelSerializer):
    class Meta:
        model = StarMas
        fields = [
            "id",
            "starname",
            "starvalue",
            "active",
            "admin_id",
            "created_at",
        ]


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationMas
        fields = [
            "id",
            "name",
            "shortname",
            "address",
            "city_id",
            "phoneno",
            "mobile",
            "fax",
            "email",
            "website",
            "tinno",
            "tindate",
            "areaid",
            "cstno",
            "cstdate",
            "active",
            "created_at",
            "admin_id",
            "pinid",
            "servername",
            "serveruid",
            "dbname",
            "serverpwd",
            "servermode",
            "protocol",
            "mainserver",
            "accdbname",
            "ipaddress",
            "uploaddata",
        ]



class GroupHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupHeadMas
        fields = [
            "id",
            "name",
            "short_name",
            "group_head_code",
            "is_primary",
            "type",
            "active",
            "admin_id",
            "created_at",
        ]


class AccountHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountHeadMas
        fields = [
            "id",
            "name",
            "short_name",
            "head_type",
            "active",
            "admin_id",
            "created_at",
            "group_head_id",
            "classification_name",
            "accessible_value",
        ]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas1
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas2
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class StyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas3
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]


class PatternSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas4
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas5
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class HsnCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas6
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class FloorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas7
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas8
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class SectionGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas9
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

class SizeOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategoryMas10
        fields = [
            "id",
            "admin_id",
            "name",
            "shortname",
            "active",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]