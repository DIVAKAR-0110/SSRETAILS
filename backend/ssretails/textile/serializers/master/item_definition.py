# textile/serializers/master/item_definition.py
from rest_framework import serializers
from django.db import transaction

from textile.models import (
    ItemCategoryMas1, ItemCategoryMas2, ItemCategoryMas3, ItemCategoryMas4,
    ItemCategoryMas5, ItemCategoryMas6, ItemCategoryMas7, ItemCategoryMas8,
    ItemCategoryMas9, ItemCategoryMas10, ProductMas, ProductCategoryValuesMas,
    ItemMas, UomMas, ItemTypeMas, CommodityCodeMas, ProductRolMas,
    LocationMas, SupplierMas
)


class ProductMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMas
        fields = ["id", "name", "shortname", "active"]


class ProductCategoryValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategoryValuesMas
        fields = ["id", "product_code", "item_category_code", "item_category_value_code", "is_default"]


class BaseItemCategorySerializer(serializers.ModelSerializer):
    product_mappings = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )

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

    def sync_product_mappings(self, instance, category_code, mappings):
        if mappings is None:
            return
        for m in mappings:
            p_code = m.get("product_code") or m.get("product_id") or m.get("id")
            selected = m.get("select", False)
            is_default = m.get("is_default", False)
            if not p_code:
                continue
            if selected:
                ProductCategoryValuesMas.objects.update_or_create(
                    product_code=p_code,
                    item_category_code=category_code,
                    item_category_value_code=instance.id,
                    defaults={"is_default": bool(is_default)}
                )
            else:
                ProductCategoryValuesMas.objects.filter(
                    product_code=p_code,
                    item_category_code=category_code,
                    item_category_value_code=instance.id
                ).delete()


class BrandSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas1
        fields = [
            "id", "admin_id", "name", "shortname", "allow_fixed_disc_amt",
            "active", "created_at", "product_mappings"
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().create(validated_data)
        self.sync_product_mappings(instance, 1, mappings)
        return instance

    def update(self, instance, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().update(instance, validated_data)
        self.sync_product_mappings(instance, 1, mappings)
        return instance


class TypeSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas2
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at", "product_mappings"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().create(validated_data)
        self.sync_product_mappings(instance, 2, mappings)
        return instance

    def update(self, instance, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().update(instance, validated_data)
        self.sync_product_mappings(instance, 2, mappings)
        return instance


class StyleSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas3
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at", "product_mappings"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().create(validated_data)
        self.sync_product_mappings(instance, 3, mappings)
        return instance

    def update(self, instance, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().update(instance, validated_data)
        self.sync_product_mappings(instance, 3, mappings)
        return instance


class PatternSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas4
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at", "product_mappings"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().create(validated_data)
        self.sync_product_mappings(instance, 4, mappings)
        return instance

    def update(self, instance, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().update(instance, validated_data)
        self.sync_product_mappings(instance, 4, mappings)
        return instance


class ColorSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas5
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at", "product_mappings"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().create(validated_data)
        self.sync_product_mappings(instance, 5, mappings)
        return instance

    def update(self, instance, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().update(instance, validated_data)
        self.sync_product_mappings(instance, 5, mappings)
        return instance


class HsnCodeSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas6
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at", "product_mappings"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().create(validated_data)
        self.sync_product_mappings(instance, 6, mappings)
        return instance

    def update(self, instance, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().update(instance, validated_data)
        self.sync_product_mappings(instance, 6, mappings)
        return instance


class FloorsSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas7
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at", "product_mappings"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().create(validated_data)
        self.sync_product_mappings(instance, 7, mappings)
        return instance

    def update(self, instance, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().update(instance, validated_data)
        self.sync_product_mappings(instance, 7, mappings)
        return instance


class SectionSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas8
        fields = [
            "id", "admin_id", "name", "shortname", "square_feet",
            "active", "created_at"
        ]
        read_only_fields = ["id", "created_at"]


class SectionGroupSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas9
        fields = ["id", "admin_id", "name", "shortname", "active", "created_at", "product_mappings"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().create(validated_data)
        self.sync_product_mappings(instance, 9, mappings)
        return instance

    def update(self, instance, validated_data):
        mappings = validated_data.pop("product_mappings", None)
        instance = super().update(instance, validated_data)
        self.sync_product_mappings(instance, 9, mappings)
        return instance


class SizeOrderSerializer(BaseItemCategorySerializer):
    class Meta:
        model = ItemCategoryMas10
        fields = [
            "id", "admin_id", "name", "shortname", "size_order",
            "active", "created_at"
        ]
        read_only_fields = ["id", "created_at"]


# =========================================================================
# Item, UOM, ItemType, Product Serializers
# =========================================================================

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemMas
        fields = ["id", "name", "shortname", "active", "admin_id", "created_at"]
        read_only_fields = ["id", "created_at"]

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


class UomSerializer(serializers.ModelSerializer):
    class Meta:
        model = UomMas
        fields = ["id", "name", "shortname", "active", "admin_id", "created_at"]
        read_only_fields = ["id", "created_at"]

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


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTypeMas
        fields = ["id", "name", "shortname", "active", "admin_id", "created_at", "allow_grocery_purchase"]
        read_only_fields = ["id", "created_at"]

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


class ProductSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField(read_only=True)
    item_type_name = serializers.SerializerMethodField(read_only=True)
    base_uom_name = serializers.SerializerMethodField(read_only=True)
    purchase_uom_name = serializers.SerializerMethodField(read_only=True)
    sales_uom_name = serializers.SerializerMethodField(read_only=True)
    category_values = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )

    class Meta:
        model = ProductMas
        fields = [
            "id", "name", "shortname", "print_name", "item_code", "item_type_code",
            "multiple_size", "jump_ratio", "secondary_qty", "barcode_type", "barcode_count",
            "last_bit_length", "decimal_length_in_rate", "stock_maintain", "batch_no",
            "manufacture_details", "expiry_date", "expiry_days", "packing_date", "allow_sales",
            "allow_sales_rate_edit", "round_off", "round_off_type", "round_calc_type",
            "rupee_or_paise", "round_rupee", "round_paise", "sales_disc_per", "add_sales_disc_per",
            "add_sales_disc_per_include", "loyalty_card_disc", "loyalty_card_disc_include",
            "allow_lock_sales_discount", "image_display", "image_name", "product_sale_rate",
            "fixed_or_variable_sal_rate", "repackable", "core_item", "hsn_code", "star_item",
            "salesman_incentive", "incentive_qty_based", "incentive_percentage", "incentive_amount",
            "margin_setup_reqd", "unit_conversion", "purchase_uom_code", "sales_uom_code",
            "base_uom_code", "company_depend", "active", "admin_id", "created_at",
            # Computed read-only fields
            "item_name", "item_type_name", "base_uom_name", "purchase_uom_name", "sales_uom_name",
            # Write-only helper fields
            "category_values"
        ]
        read_only_fields = ["id", "created_at"]

    def get_item_name(self, obj):
        if obj.item_code:
            item = ItemMas.objects.filter(id=obj.item_code).first()
            return item.name if item else ""
        return ""

    def get_item_type_name(self, obj):
        if obj.item_type_code:
            item_type = ItemTypeMas.objects.filter(id=obj.item_type_code).first()
            return item_type.name if item_type else ""
        return ""

    def get_base_uom_name(self, obj):
        if obj.base_uom_code:
            uom = UomMas.objects.filter(id=obj.base_uom_code).first()
            return uom.name if uom else ""
        return ""

    def get_purchase_uom_name(self, obj):
        if obj.purchase_uom_code:
            uom = UomMas.objects.filter(id=obj.purchase_uom_code).first()
            return uom.name if uom else ""
        return ""

    def get_sales_uom_name(self, obj):
        if obj.sales_uom_code:
            uom = UomMas.objects.filter(id=obj.sales_uom_code).first()
            return uom.name if uom else ""
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

    def sync_category_values(self, product_id, category_values):
        if category_values is None:
            return
        ProductCategoryValuesMas.objects.filter(product_code=product_id).delete()
        new_records = []
        for cv in category_values:
            cat_code = cv.get("item_category_code") or cv.get("category_code")
            val_code = cv.get("item_category_value_code") or cv.get("value_code")
            is_def = cv.get("is_default", False)
            if cat_code and val_code:
                new_records.append(
                    ProductCategoryValuesMas(
                        product_code=product_id,
                        item_category_code=cat_code,
                        item_category_value_code=val_code,
                        is_default=bool(is_def)
                    )
                )
        if new_records:
            ProductCategoryValuesMas.objects.bulk_create(new_records)

    def create(self, validated_data):
        cat_values = validated_data.pop("category_values", None)
        with transaction.atomic():
            instance = super().create(validated_data)
            self.sync_category_values(instance.id, cat_values)
        return instance

    def update(self, instance, validated_data):
        cat_values = validated_data.pop("category_values", None)
        with transaction.atomic():
            instance = super().update(instance, validated_data)
            self.sync_category_values(instance.id, cat_values)
        return instance


class CommodityCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommodityCodeMas
        fields = ["id", "name", "active", "admin_id", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Code is required.")
        val = value.strip().upper()
        if len(val) > 50:
            raise serializers.ValidationError("Code must not exceed 50 characters.")
        return val


class ProductRolSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField(read_only=True)
    item_name = serializers.SerializerMethodField(read_only=True)
    base_uom_name = serializers.SerializerMethodField(read_only=True)
    location_name = serializers.SerializerMethodField(read_only=True)
    supplier_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductRolMas
        fields = [
            "id", "product_code", "location_code", "supplier_code", "item_code",
            "item_category1_code", "item_category2_code", "item_category3_code",
            "item_category4_code", "item_category5_code", "item_category6_code",
            "item_category7_code", "item_category8_code", "item_category9_code",
            "item_category10_code", "rate_from", "rate_to", "min_stk", "max_stk", "rol_qty",
            # Computed read-only fields
            "product_name", "item_name", "base_uom_name", "location_name", "supplier_name"
        ]
        read_only_fields = ["id"]

    def get_product_name(self, obj):
        if obj.product_code:
            prod = ProductMas.objects.filter(id=obj.product_code).first()
            return prod.name if prod else ""
        return ""

    def get_item_name(self, obj):
        code = obj.item_code
        if not code and obj.product_code:
            prod = ProductMas.objects.filter(id=obj.product_code).first()
            if prod:
                code = prod.item_code
        if code:
            item = ItemMas.objects.filter(id=code).first()
            return item.name if item else ""
        return ""

    def get_base_uom_name(self, obj):
        if obj.product_code:
            prod = ProductMas.objects.filter(id=obj.product_code).first()
            if prod and prod.base_uom_code:
                uom = UomMas.objects.filter(id=prod.base_uom_code).first()
                return uom.name if uom else ""
        return ""

    def get_location_name(self, obj):
        if obj.location_code:
            loc = LocationMas.objects.filter(id=obj.location_code).first()
            return loc.name if loc else ""
        return ""

    def get_supplier_name(self, obj):
        if obj.supplier_code:
            sup = SupplierMas.objects.filter(id=obj.supplier_code).first()
            return sup.name if sup else ""
        return ""

    def validate(self, attrs):
        product_code = attrs.get("product_code")
        if product_code and not attrs.get("item_code"):
            prod = ProductMas.objects.filter(id=product_code).first()
            if prod:
                attrs["item_code"] = prod.item_code
        return attrs

