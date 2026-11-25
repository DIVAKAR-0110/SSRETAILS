# textile/serializers/transaction/purchaseorder.py
from rest_framework import serializers
from textile.models.transaction.purchaseorder import (
    TransPurchaseOrderMas,
    TransPurchaseOrderDet,
    TransPurchaseOrderDiscountDet,
    TransPurchaseOrderSizeDet,
    TransPurchaseOrderAddLessDet,
)
from textile.models.master.intractors import SupplierMas
from textile.models.master.location import LocationMas
from textile.models.master.company import CompanyMas
from textile.models.master.general import TaxTypeMas


class TransPurchaseOrderDiscountDetSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)

    class Meta:
        model = TransPurchaseOrderDiscountDet
        fields = [
            "entry_id", "entry_no", "entry_date", "entry_order_id",
            "days", "discount_per", "cancel", "location_id", "uploaded"
        ]


class TransPurchaseOrderSizeDetSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)

    class Meta:
        model = TransPurchaseOrderSizeDet
        fields = [
            "entry_id", "entry_no", "entry_date", "mas_entry_order_id",
            "entry_order_id", "fixed_code", "item_category_code1",
            "item_category_code2", "item_category_code3", "item_category_code4",
            "item_category_code5", "item_category_code6", "item_category_code7",
            "item_category_code8", "item_category_code9", "item_category_code10",
            "qty", "mtrs", "recvd_qty", "net_rate", "mrp", "cancel",
            "order_cancel_id", "location_id", "uploaded"
        ]


class TransPurchaseOrderAddLessDetSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    tax_type_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransPurchaseOrderAddLessDet
        fields = [
            "entry_id", "entry_no", "entry_date", "entry_order_id",
            "entry_type", "tax_type_code", "tax_type_name", "add_or_less_type",
            "tax_percent", "tax_on_amount", "amount", "round_off", "net_amount",
            "cancel", "location_id", "uploaded"
        ]

    def get_tax_type_name(self, obj):
        try:
            tax = TaxTypeMas.objects.using("default").filter(tax_type_id=obj.tax_type_code).first()
            return tax.tax_type_name if tax else ""
        except Exception:
            return ""


class TransPurchaseOrderDetSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    size_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransPurchaseOrderDet
        fields = [
            "entry_id", "entry_no", "entry_date", "entry_order_id",
            "fixed_code", "product_id", "item_id", "design_no",
            "qty", "mtrs", "total_qty", "recvd_qty", "cancel_qty",
            "rate", "amount", "mrp", "purchase_tax1_code", "purchase_tax2_code",
            "purchase_tax3_code", "group_tax_code", "delivery_date",
            "item_category_code1", "item_category_code2", "item_category_code3",
            "item_category_code4", "item_category_code5", "item_category_code6",
            "item_category_code7", "item_category_code8", "item_category_code9",
            "image_name", "size_type", "from_size_code", "to_size_code",
            "jump_ratio", "order_cancel_id", "location_id", "uploaded",
            "size_details"
        ]

    def get_size_details(self, obj):
        sizes = TransPurchaseOrderSizeDet.objects.using("transaction").filter(
            entry_id=obj.entry_id, mas_entry_order_id=obj.entry_order_id
        ).order_id() if hasattr(TransPurchaseOrderSizeDet.objects, 'order_id') else TransPurchaseOrderSizeDet.objects.using("transaction").filter(
            entry_id=obj.entry_id, mas_entry_order_id=obj.entry_order_id
        )
        return TransPurchaseOrderSizeDetSerializer(sizes, many=True).data


class TransPurchaseOrderMasSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    location_name = serializers.SerializerMethodField(read_only=True)
    company_name = serializers.SerializerMethodField(read_only=True)
    supplier_name = serializers.SerializerMethodField(read_only=True)

    item_details = serializers.SerializerMethodField(read_only=True)
    discount_details = serializers.SerializerMethodField(read_only=True)
    add_less_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransPurchaseOrderMas
        fields = [
            "entry_id", "entry_no", "entry_date", "location_id", "location_name",
            "company_id", "company_name", "purchase_type", "order_no", "order_date",
            "supplier_id", "supplier_name", "rep_name", "payment_terms",
            "amount", "remarks", "system_name", "user_id", "user_entry_datetime",
            "update_user_id", "update_user_entry_datetime", "cancel",
            "cancel_user_id", "cancel_user_entry_datetime", "uploaded",
            "item_details", "discount_details", "add_less_details"
        ]

    def get_location_name(self, obj):
        try:
            loc = LocationMas.objects.using("default").filter(location_id=obj.location_id).first()
            return loc.location_name if loc else ""
        except Exception:
            return ""

    def get_company_name(self, obj):
        try:
            comp = CompanyMas.objects.using("default").filter(company_id=obj.company_id).first()
            return comp.company_name if comp else ""
        except Exception:
            return ""

    def get_supplier_name(self, obj):
        try:
            sup = SupplierMas.objects.using("default").filter(supplier_id=obj.supplier_id).first()
            return sup.supplier_name if sup else ""
        except Exception:
            return ""

    def get_item_details(self, obj):
        items = TransPurchaseOrderDet.objects.using("transaction").filter(entry_id=obj.entry_id)
        return TransPurchaseOrderDetSerializer(items, many=True).data

    def get_discount_details(self, obj):
        discounts = TransPurchaseOrderDiscountDet.objects.using("transaction").filter(entry_id=obj.entry_id)
        return TransPurchaseOrderDiscountDetSerializer(discounts, many=True).data

    def get_add_less_details(self, obj):
        add_less = TransPurchaseOrderAddLessDet.objects.using("transaction").filter(entry_id=obj.entry_id)
        return TransPurchaseOrderAddLessDetSerializer(add_less, many=True).data
