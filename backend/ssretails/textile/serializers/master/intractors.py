# textile/serializers/master/intractors.py
from rest_framework import serializers

from textile.models.master.intractors import (
    SupplierMas, SupplierCompanyMas, SupplierItemTypeMas,
    AgentMas, AgentCompanyMas,
    ManufactureMas,
    CustomerMas, CustomerCompanyMas,
    CourierMas, TransportMas, TransportCompanyMas
)
from textile.models.master.job_work import ContactDetailsMas
from textile.models.master.general import (
    CityMas, StateMas, CountryMas, BankMas, TitleMas, EmployeeMas,
    CategoryMas, GroupMas, GradeMas, OccupationMas, ReligionMas
)
from textile.models.master.location import LocationMas
from textile.models.master.company import CompanyMas
from textile.models.master.item_definition import ItemTypeMas
from textile.serializers.master.job_work import ContactDetailsSerializer


# ==========================================
# Supplier Child Serializers
# ==========================================
class SupplierCompanySerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SupplierCompanyMas
        fields = ["id", "supplier_id", "company_id", "company_name", "opening_balance"]
        read_only_fields = ["id"]

    def get_company_name(self, obj):
        if obj.company_id:
            c = CompanyMas.objects.filter(id=obj.company_id).first()
            return c.name if c else ""
        return ""


class SupplierItemTypeSerializer(serializers.ModelSerializer):
    item_type_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SupplierItemTypeMas
        fields = ["id", "supplier_id", "item_type_id", "item_type_name"]
        read_only_fields = ["id"]

    def get_item_type_name(self, obj):
        if obj.item_type_id:
            it = ItemTypeMas.objects.filter(id=obj.item_type_id).first()
            return it.name if it else ""
        return ""


# ==========================================
# Supplier Master Serializer
# ==========================================
class SupplierSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)
    bank_name = serializers.SerializerMethodField(read_only=True)
    title_name = serializers.SerializerMethodField(read_only=True)
    location_name = serializers.SerializerMethodField(read_only=True)
    agent_name = serializers.SerializerMethodField(read_only=True)
    representative_name = serializers.SerializerMethodField(read_only=True)
    category_name = serializers.SerializerMethodField(read_only=True)
    group_name = serializers.SerializerMethodField(read_only=True)
    grade_name = serializers.SerializerMethodField(read_only=True)

    contacts = ContactDetailsSerializer(many=True, read_only=True)
    companies = SupplierCompanySerializer(many=True, read_only=True)
    item_types = SupplierItemTypeSerializer(many=True, read_only=True)

    class Meta:
        model = SupplierMas
        fields = [
            "id", "title_id", "name", "shortname", "print_name", "address",
            "city_id", "pincode", "phoneno", "mobile", "fax", "email", "website",
            "cst_no", "cst_date", "tin_no", "tin_date", "pan_no", "tan_no",
            "credit_days", "credit_limit", "standard_discount_on_bill", "agent_id",
            "agent_commission", "cash_discount_days", "cash_discount_percent",
            "debit_dd_commission", "dd_commission_percent", "profit",
            "interest_on_delay", "interest_on_early", "category_id", "group_id",
            "grade_id", "company_depend", "ecs_transfer", "bank_id", "branch",
            "account_no", "ifpn_no", "micr_code", "cheque_name", "active",
            "admin_id", "created_at", "area_code", "location_id", "acc_head_name",
            "representative_id", "due_days", "account_head_id", "ss_acc_head_id",
            "gst_no", "bill_discount", "manual_cash_disc_per", "manual_cash_days",
            # Computed Read-Only Lookups
            "city_name", "state_name", "country_name", "bank_name", "title_name",
            "location_name", "agent_name", "representative_name", "category_name",
            "group_name", "grade_name",
            # Child relations
            "contacts", "companies", "item_types"
        ]
        read_only_fields = ["id", "created_at"]

    def get_city_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            return c.name if c else ""
        return ""

    def get_state_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                return s.name if s else ""
        return ""

    def get_country_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                if s and s.country_id:
                    cnt = CountryMas.objects.filter(id=s.country_id).first()
                    return cnt.name if cnt else ""
        return "INDIA"

    def get_bank_name(self, obj):
        if obj.bank_id:
            b = BankMas.objects.filter(id=obj.bank_id).first()
            return b.name if b else ""
        return ""

    def get_title_name(self, obj):
        if obj.title_id:
            t = TitleMas.objects.filter(id=obj.title_id).first()
            return t.name if t else ""
        return ""

    def get_location_name(self, obj):
        if obj.location_id:
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def get_agent_name(self, obj):
        if obj.agent_id:
            a = AgentMas.objects.filter(id=obj.agent_id).first()
            return a.name if a else ""
        return ""

    def get_representative_name(self, obj):
        if obj.representative_id:
            emp = EmployeeMas.objects.filter(id=obj.representative_id).first()
            return emp.name if emp else ""
        return ""

    def get_category_name(self, obj):
        if obj.category_id:
            cat = CategoryMas.objects.filter(id=obj.category_id).first()
            return cat.name if cat else ""
        return ""

    def get_group_name(self, obj):
        if obj.group_id:
            grp = GroupMas.objects.filter(id=obj.group_id).first()
            return grp.name if grp else ""
        return ""

    def get_grade_name(self, obj):
        if obj.grade_id:
            grd = GradeMas.objects.filter(id=obj.grade_id).first()
            return grd.name if grd else ""
        return ""

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("Name must not exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        if not value:
            raise serializers.ValidationError("Short name is required.")
        val = value.strip().upper()
        if len(val) > 25:
            raise serializers.ValidationError("Short name must not exceed 25 characters.")
        return val


# ==========================================
# Agent Master Serializers
# ==========================================
class AgentCompanySerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AgentCompanyMas
        fields = ["id", "agent_id", "company_id", "company_name", "opening_balance"]
        read_only_fields = ["id"]

    def get_company_name(self, obj):
        if obj.company_id:
            c = CompanyMas.objects.filter(id=obj.company_id).first()
            return c.name if c else ""
        return ""


class AgentSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)
    bank_name = serializers.SerializerMethodField(read_only=True)
    location_name = serializers.SerializerMethodField(read_only=True)

    contacts = ContactDetailsSerializer(many=True, read_only=True)
    companies = AgentCompanySerializer(many=True, read_only=True)

    class Meta:
        model = AgentMas
        fields = [
            "id", "name", "shortname", "commission_percent", "address",
            "city_id", "pincode", "phoneno", "mobile", "fax", "email",
            "website", "tin_no", "tin_date", "area_code", "cst_no",
            "cst_date", "tan_no", "pan_no", "service_tax_no", "ecs_transfer",
            "bank_id", "branch", "account_no", "ifpn_no", "micr_code",
            "cheque_name", "active", "admin_id", "created_at",
            "location_id", "acc_head_name", "sales", "account_head_id",
            # Computed Lookups
            "city_name", "state_name", "country_name", "bank_name", "location_name",
            # Child relations
            "contacts", "companies"
        ]
        read_only_fields = ["id", "created_at"]

    def get_city_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            return c.name if c else ""
        return ""

    def get_state_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                return s.name if s else ""
        return ""

    def get_country_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                if s and s.country_id:
                    cnt = CountryMas.objects.filter(id=s.country_id).first()
                    return cnt.name if cnt else ""
        return "INDIA"

    def get_bank_name(self, obj):
        if obj.bank_id:
            b = BankMas.objects.filter(id=obj.bank_id).first()
            return b.name if b else ""
        return ""

    def get_location_name(self, obj):
        if obj.location_id:
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("Name must not exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        if not value:
            raise serializers.ValidationError("Short name is required.")
        val = value.strip().upper()
        if len(val) > 25:
            raise serializers.ValidationError("Short name must not exceed 25 characters.")
        return val


# ==========================================
# Manufacture Master Serializers
# ==========================================
class ManufactureSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)
    location_name = serializers.SerializerMethodField(read_only=True)

    contacts = ContactDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = ManufactureMas
        fields = [
            "id", "name", "shortname", "address", "city_id",
            "phoneno", "mobile", "fax", "email", "website",
            "tin_no", "tin_date", "area_code", "cst_no", "cst_date",
            "pincode", "tan_no", "pan_no", "active", "admin_id",
            "created_at", "location_id", "acc_head_name", "account_head_id",
            # Computed Lookups
            "city_name", "state_name", "country_name", "location_name",
            # Child relations
            "contacts"
        ]
        read_only_fields = ["id", "created_at"]

    def get_city_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            return c.name if c else ""
        return ""

    def get_state_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                return s.name if s else ""
        return ""

    def get_country_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                if s and s.country_id:
                    cnt = CountryMas.objects.filter(id=s.country_id).first()
                    return cnt.name if cnt else ""
        return "INDIA"

    def get_location_name(self, obj):
        if obj.location_id:
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("Name must not exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        if not value:
            raise serializers.ValidationError("Short name is required.")
        val = value.strip().upper()
        if len(val) > 25:
            raise serializers.ValidationError("Short name must not exceed 25 characters.")
        return val


# ==========================================
# Customer Master Serializers
# ==========================================
class CustomerCompanySerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomerCompanyMas
        fields = ["id", "customer_id", "company_id", "company_name", "opening_balance"]
        read_only_fields = ["id"]

    def get_company_name(self, obj):
        if obj.company_id:
            c = CompanyMas.objects.filter(id=obj.company_id).first()
            return c.name if c else ""
        return ""


class CustomerSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)
    title_name = serializers.SerializerMethodField(read_only=True)
    location_name = serializers.SerializerMethodField(read_only=True)
    occupation_name = serializers.SerializerMethodField(read_only=True)
    religion_name = serializers.SerializerMethodField(read_only=True)
    category_name = serializers.SerializerMethodField(read_only=True)
    group_name = serializers.SerializerMethodField(read_only=True)
    grade_name = serializers.SerializerMethodField(read_only=True)

    contacts = ContactDetailsSerializer(many=True, read_only=True)
    companies = CustomerCompanySerializer(many=True, read_only=True)

    class Meta:
        model = CustomerMas
        fields = [
            "id", "title_id", "name", "shortname", "address",
            "city_id", "pincode", "phoneno", "mobile", "fax",
            "email", "website", "cst_no", "cst_date", "tin_no",
            "tin_date", "pan_no", "tan_no", "discount_percent",
            "loyalty_card_no", "credit_allowed", "cr_limit", "is_company",
            "due_days", "dob", "doa", "occupation_id", "religion_id",
            "allow_promotion_mailers", "allow_promotion_sms",
            "allow_promotion_email", "category_id", "group_id", "grade_id",
            "active", "admin_id", "created_at", "area_code",
            "location_id", "acc_head_name", "loyalty_amount",
            "avail_points", "account_head_id", "ss_acc_head_id", "gst_no",
            # Computed Lookups
            "city_name", "state_name", "country_name", "title_name",
            "location_name", "occupation_name", "religion_name",
            "category_name", "group_name", "grade_name",
            # Child relations
            "contacts", "companies"
        ]
        read_only_fields = ["id", "created_at"]

    def get_city_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            return c.name if c else ""
        return ""

    def get_state_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                return s.name if s else ""
        return ""

    def get_country_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                if s and s.country_id:
                    cnt = CountryMas.objects.filter(id=s.country_id).first()
                    return cnt.name if cnt else ""
        return "INDIA"

    def get_title_name(self, obj):
        if obj.title_id:
            t = TitleMas.objects.filter(id=obj.title_id).first()
            return t.name if t else ""
        return ""

    def get_location_name(self, obj):
        if obj.location_id:
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def get_occupation_name(self, obj):
        if obj.occupation_id:
            occ = OccupationMas.objects.filter(id=obj.occupation_id).first()
            return occ.name if occ else ""
        return ""

    def get_religion_name(self, obj):
        if obj.religion_id:
            rel = ReligionMas.objects.filter(id=obj.religion_id).first()
            return rel.name if rel else ""
        return ""

    def get_category_name(self, obj):
        if obj.category_id:
            cat = CategoryMas.objects.filter(id=obj.category_id).first()
            return cat.name if cat else ""
        return ""

    def get_group_name(self, obj):
        if obj.group_id:
            grp = GroupMas.objects.filter(id=obj.group_id).first()
            return grp.name if grp else ""
        return ""

    def get_grade_name(self, obj):
        if obj.grade_id:
            grd = GradeMas.objects.filter(id=obj.grade_id).first()
            return grd.name if grd else ""
        return ""

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("Name must not exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        if not value:
            raise serializers.ValidationError("Short name is required.")
        val = value.strip().upper()
        if len(val) > 25:
            raise serializers.ValidationError("Short name must not exceed 25 characters.")
        return val


# ==========================================
# Courier Master Serializer
# ==========================================
class CourierSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)
    bank_name = serializers.SerializerMethodField(read_only=True)
    title_name = serializers.SerializerMethodField(read_only=True)
    location_name = serializers.SerializerMethodField(read_only=True)

    contacts = ContactDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = CourierMas
        fields = [
            "id", "title_id", "name", "shortname", "print_name", "address",
            "city_id", "pincode", "phoneno", "mobile", "fax", "email",
            "website", "pan_no", "cst_no", "cst_date", "tin_no", "tin_date",
            "area_code", "tan_no", "charge_type", "pay_type", "service_tax_no",
            "discount_percent", "discount_amount", "ecs_transfer", "bank_id",
            "branch", "account_no", "ifpn_no", "micr_code", "cheque_name",
            "active", "admin_id", "created_at", "location_id", "acc_head_name",
            "account_head_id",
            # Computed Lookups
            "city_name", "state_name", "country_name", "bank_name",
            "title_name", "location_name",
            # Child relations
            "contacts"
        ]
        read_only_fields = ["id", "created_at"]

    def get_city_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            return c.name if c else ""
        return ""

    def get_state_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                return s.name if s else ""
        return ""

    def get_country_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                if s and s.country_id:
                    cnt = CountryMas.objects.filter(id=s.country_id).first()
                    return cnt.name if cnt else ""
        return "INDIA"

    def get_bank_name(self, obj):
        if obj.bank_id:
            b = BankMas.objects.filter(id=obj.bank_id).first()
            return b.name if b else ""
        return ""

    def get_title_name(self, obj):
        if obj.title_id:
            t = TitleMas.objects.filter(id=obj.title_id).first()
            return t.name if t else ""
        return ""

    def get_location_name(self, obj):
        if obj.location_id:
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("Name must not exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        if not value:
            raise serializers.ValidationError("Short name is required.")
        val = value.strip().upper()
        if len(val) > 25:
            raise serializers.ValidationError("Short name must not exceed 25 characters.")
        return val


# ==========================================
# Transport Master Serializers
# ==========================================
class TransportCompanySerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransportCompanyMas
        fields = ["id", "transport_id", "company_id", "company_name", "opening_balance"]
        read_only_fields = ["id"]

    def get_company_name(self, obj):
        if obj.company_id:
            c = CompanyMas.objects.filter(id=obj.company_id).first()
            return c.name if c else ""
        return ""


class TransportSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)
    bank_name = serializers.SerializerMethodField(read_only=True)
    location_name = serializers.SerializerMethodField(read_only=True)

    contacts = ContactDetailsSerializer(many=True, read_only=True)
    companies = TransportCompanySerializer(many=True, read_only=True)

    class Meta:
        model = TransportMas
        fields = [
            "id", "title_id", "name", "shortname", "print_name", "address",
            "city_id", "pincode", "phoneno", "mobile", "fax", "email",
            "website", "pan_no", "cst_no", "cst_date", "tin_no", "tin_date",
            "area_code", "tan_no", "charge_type", "pay_type", "service_tax_no",
            "discount_percent", "discount_amount", "ecs_transfer", "bank_id",
            "branch", "account_no", "ifpn_no", "micr_code", "cheque_name",
            "active", "admin_id", "created_at", "location_id", "acc_head_name",
            "account_head_id",
            # Computed Lookups
            "city_name", "state_name", "country_name", "bank_name", "location_name",
            # Child relations
            "contacts", "companies"
        ]
        read_only_fields = ["id", "created_at"]

    def get_city_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            return c.name if c else ""
        return ""

    def get_state_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                return s.name if s else ""
        return ""

    def get_country_name(self, obj):
        if obj.city_id:
            c = CityMas.objects.filter(id=obj.city_id).first()
            if c and c.state_id:
                s = StateMas.objects.filter(id=c.state_id).first()
                if s and s.country_id:
                    cnt = CountryMas.objects.filter(id=s.country_id).first()
                    return cnt.name if cnt else ""
        return "INDIA"

    def get_bank_name(self, obj):
        if obj.bank_id:
            b = BankMas.objects.filter(id=obj.bank_id).first()
            return b.name if b else ""
        return ""

    def get_location_name(self, obj):
        if obj.location_id:
            loc = LocationMas.objects.filter(id=obj.location_id).first()
            return loc.name if loc else ""
        return ""

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("Name must not exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        if not value:
            raise serializers.ValidationError("Short name is required.")
        val = value.strip().upper()
        if len(val) > 25:
            raise serializers.ValidationError("Short name must not exceed 25 characters.")
        return val
