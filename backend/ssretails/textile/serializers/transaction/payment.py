# textile/serializers/transaction/payment.py
from rest_framework import serializers
from textile.models.transaction.payment import (
    TransPaymentMas,
    TransPaymentDet,
    TransPaymentModeDet,
    TransPaymentTaxDet,
    TransBalanceDet,
    TransSupplierAdvanceMas,
)
from textile.models.master.intractors import SupplierMas
from textile.models.master.location import LocationMas
from textile.models.master.company import CompanyMas
from textile.models.master.general import EmployeeMas, BankMas, TaxTypeMas


class TransPaymentDetSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)

    class Meta:
        model = TransPaymentDet
        fields = [
            "entry_id", "ref_entry_id", "ref_entry_no", "ref_entry_date",
            "entry_order_id", "location_id", "company_id", "supplier_id",
            "inv_no", "inv_date", "inv_amount", "entry_type",
            "paid_amount", "balance_amount", "cd_percentage", "cd_amount",
            "agent_id", "agent_per", "agent_amount", "disc_per", "disc_amount",
            "delay_or_early", "interest_per", "interest_amount", "net_amount",
            "cancel", "edited", "verified"
        ]


class TransPaymentModeDetSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    bank_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransPaymentModeDet
        fields = [
            "entry_id", "entry_order_id", "location_id", "pay_mode_type",
            "bank_id", "bank_name", "set_no", "payable_at",
            "dd_favour_of", "dd_or_cheque_no", "dd_or_cheque_date",
            "amount", "cancel", "edited", "verified"
        ]

    def get_bank_name(self, obj):
        try:
            b = BankMas.objects.using("default").filter(bank_id=obj.bank_id).first()
            return b.bank_name if b else ""
        except Exception:
            return ""


class TransPaymentTaxDetSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    tax_type_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransPaymentTaxDet
        fields = [
            "entry_id", "entry_no", "entry_date", "entry_order_id",
            "location_id", "entry_type", "tax_type_code", "tax_type_name",
            "add_or_less_type", "tax_on_amount", "tax_percent",
            "amount", "round_off", "net_amount", "cancel", "verified", "edited"
        ]

    def get_tax_type_name(self, obj):
        try:
            t = TaxTypeMas.objects.using("default").filter(tax_type_id=obj.tax_type_code).first()
            return t.tax_type_name if t else ""
        except Exception:
            return ""


class TransPaymentMasSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    location_name = serializers.SerializerMethodField(read_only=True)
    company_name = serializers.SerializerMethodField(read_only=True)
    supplier_name = serializers.SerializerMethodField(read_only=True)
    posted_by_name = serializers.SerializerMethodField(read_only=True)

    payment_details = serializers.SerializerMethodField(read_only=True)
    payment_modes = serializers.SerializerMethodField(read_only=True)
    payment_taxes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransPaymentMas
        fields = [
            "entry_id", "entry_no", "entry_date", "location_id", "location_name",
            "company_id", "company_name", "supplier_id", "supplier_name",
            "advance_amount", "add_less_amount", "tax_amount", "paid_amount",
            "posted_by", "posted_by_name", "system_name", "user_id",
            "user_entry_datetime", "cancel", "edited", "verified",
            "payment_details", "payment_modes", "payment_taxes"
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

    def get_posted_by_name(self, obj):
        try:
            emp = EmployeeMas.objects.using("default").filter(employee_id=obj.posted_by).first()
            return emp.employee_name if emp else ""
        except Exception:
            return ""

    def get_payment_details(self, obj):
        items = TransPaymentDet.objects.using("transaction").filter(entry_id=obj.entry_id)
        return TransPaymentDetSerializer(items, many=True).data

    def get_payment_modes(self, obj):
        modes = TransPaymentModeDet.objects.using("transaction").filter(entry_id=obj.entry_id)
        return TransPaymentModeDetSerializer(modes, many=True).data

    def get_payment_taxes(self, obj):
        taxes = TransPaymentTaxDet.objects.using("transaction").filter(entry_id=obj.entry_id)
        return TransPaymentTaxDetSerializer(taxes, many=True).data


class TransBalanceDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransBalanceDet
        fields = "__all__"


class TransSupplierAdvanceMasSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransSupplierAdvanceMas
        fields = "__all__"
