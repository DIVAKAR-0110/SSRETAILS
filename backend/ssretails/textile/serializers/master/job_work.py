# textile/serializers/master/job_work.py
from rest_framework import serializers
from django.db import transaction
from textile.models.master.job_work import (
    JobWorkChargeHeadMas,
    TailorMas,
    ContactDetailsMas,
    TailorChargeMas,
    TailorConsumptionMas,
    SupplierChargeMas,
    SupplierConsumptionMas,
)
from textile.models.master.item_definition import ProductMas, ItemMas
from textile.models.master.intractors import SupplierMas
from textile.models.master.general import CityMas, StateMas, CountryMas, BankMas


class JobWorkChargeHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobWorkChargeHeadMas
        fields = ["id", "name", "shortname", "active", "admin_id", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Charge head name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Charge head name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class ContactDetailsSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ContactDetailsMas
        fields = [
            "entry_order_id",
            "name",
            "shortname",
            "gender",
            "designation",
            "dob",
            "doa",
            "address",
            "city_id",
            "city_name",
            "phoneno",
            "extension_no",
            "mobile",
            "fax",
            "email",
        ]
        read_only_fields = ["entry_order_id"]

    def get_city_name(self, obj):
        if obj.city_id:
            city = CityMas.objects.filter(id=obj.city_id).first()
            return city.name if city else ""
        return ""


class TailorChargeSerializer(serializers.ModelSerializer):
    charge_head_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TailorChargeMas
        fields = ["entry_order_id", "charge_head_id", "charge_head_name", "charge"]
        read_only_fields = ["entry_order_id"]

    def get_charge_head_name(self, obj):
        if obj.charge_head_id:
            head = JobWorkChargeHeadMas.objects.filter(id=obj.charge_head_id).first()
            return head.name if head else ""
        return ""


class TailorConsumptionSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField(read_only=True)
    item_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TailorConsumptionMas
        fields = [
            "entry_order_id",
            "product_id",
            "product_name",
            "item_id",
            "item_name",
            "design_no",
            "cons_pcs",
            "item_category_1",
            "item_category_2",
            "item_category_3",
            "item_category_4",
            "item_category_5",
            "item_category_6",
            "item_category_7",
            "item_category_8",
            "item_category_9",
            "item_category_10",
        ]
        read_only_fields = ["entry_order_id"]

    def get_product_name(self, obj):
        if obj.product_id:
            prod = ProductMas.objects.filter(id=obj.product_id).first()
            return prod.name if prod else ""
        return ""

    def get_item_name(self, obj):
        if obj.item_id:
            item = ItemMas.objects.filter(id=obj.item_id).first()
            return item.name if item else ""
        return ""


class TailorMasSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)
    state_name = serializers.SerializerMethodField(read_only=True)
    country_name = serializers.SerializerMethodField(read_only=True)
    bank_name = serializers.SerializerMethodField(read_only=True)

    contacts = ContactDetailsSerializer(many=True, read_only=True)
    charges = TailorChargeSerializer(many=True, read_only=True)
    consumptions = TailorConsumptionSerializer(many=True, read_only=True)

    class Meta:
        model = TailorMas
        fields = [
            "id",
            "location_id",
            "name",
            "shortname",
            "address",
            "city_id",
            "city_name",
            "state_name",
            "country_name",
            "pincode",
            "phoneno",
            "mobile",
            "fax",
            "email",
            "website",
            "tinno",
            "tindate",
            "area_code",
            "cstno",
            "cstdate",
            "tanno",
            "panno",
            "service_tax_no",
            "commission_percent",
            "ecs_transfer",
            "cheque_name",
            "bank_id",
            "bank_name",
            "branch",
            "account_no",
            "ifpn_no",
            "micr_code",
            "active",
            "admin_id",
            "created_at",
            "acc_head_name",
            "sales",
            "contacts",
            "charges",
            "consumptions",
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
        return ""

    def get_bank_name(self, obj):
        if obj.bank_id:
            b = BankMas.objects.filter(id=obj.bank_id).first()
            return b.name if b else ""
        return ""

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short Name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short Name cannot exceed 25 characters.")
        return val


class SupplierChargeSerializer(serializers.ModelSerializer):
    charge_head_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SupplierChargeMas
        fields = ["entry_order_id", "charge_head_id", "charge_head_name", "charge"]
        read_only_fields = ["entry_order_id"]

    def get_charge_head_name(self, obj):
        if obj.charge_head_id:
            head = JobWorkChargeHeadMas.objects.filter(id=obj.charge_head_id).first()
            return head.name if head else ""
        return ""


class SupplierConsumptionSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField(read_only=True)
    item_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SupplierConsumptionMas
        fields = [
            "entry_order_id",
            "product_id",
            "product_name",
            "item_id",
            "item_name",
            "design_no",
            "cons_pcs",
            "item_category_1",
            "item_category_2",
            "item_category_3",
            "item_category_4",
            "item_category_5",
            "item_category_6",
            "item_category_7",
            "item_category_8",
            "item_category_9",
            "item_category_10",
        ]
        read_only_fields = ["entry_order_id"]

    def get_product_name(self, obj):
        if obj.product_id:
            prod = ProductMas.objects.filter(id=obj.product_id).first()
            return prod.name if prod else ""
        return ""

    def get_item_name(self, obj):
        if obj.item_id:
            item = ItemMas.objects.filter(id=obj.item_id).first()
            return item.name if item else ""
        return ""
