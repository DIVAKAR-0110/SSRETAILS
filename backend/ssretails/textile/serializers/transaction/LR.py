# backend/ssretails/textile/serializers/transaction/LR.py
from rest_framework import serializers
from textile.models.transaction.LR import (
    LREntryTypeMas, LRChargeModeMas, TransLRMas, TransLRInvoiceDet, TransLRDet,
    TransLRIssueMas, TransLRIssueDet, TransLRReceiptMas, TransLRReceiptDet,
    TransLRReceiptAddLessDet, TransLRTransferMas, TransLRTransferDet
)
from textile.models.master.general import EmployeeMas, TaxTypeMas
from textile.models.master.location import LocationMas
from textile.models.master.company import CompanyMas
from textile.models.master.intractors import SupplierMas, AgentMas, TransportMas
from textile.models.master.general import CityMas, TransferModeMas


class LREntryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LREntryTypeMas
        fields = ["code", "name", "shortname", "active"]


class LRChargeModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LRChargeModeMas
        fields = ["code", "name", "shortname", "active"]


class TransLRInvoiceDetSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="entry_order_id", required=False)
    supplier_name = serializers.SerializerMethodField(read_only=True)
    city_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransLRInvoiceDet
        fields = [
            "id", "entry_order_id", "supplier_id", "supplier_name",
            "city_name", "invoice_no", "invoice_date", "bundles",
            "amount", "supplier_bundle_no", "cancel"
        ]

    def get_supplier_name(self, obj):
        try:
            supplier = SupplierMas.objects.filter(pk=obj.supplier_id).first()
            return supplier.name if supplier else ""
        except Exception:
            return ""

    def get_city_name(self, obj):
        try:
            supplier = SupplierMas.objects.filter(pk=obj.supplier_id).first()
            if supplier and supplier.city_id:
                city = CityMas.objects.filter(pk=supplier.city_id).first()
                return city.name if city else ""
            return ""
        except Exception:
            return ""


class TransLRDetSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="entry_order_id", required=False)
    transport_name = serializers.SerializerMethodField(read_only=True)
    from_city_name = serializers.SerializerMethodField(read_only=True)
    to_city_name = serializers.SerializerMethodField(read_only=True)
    transfer_mode_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransLRDet
        fields = [
            "id", "entry_order_id", "transport_id", "transport_name",
            "from_city_id", "from_city_name", "to_city_id", "to_city_name",
            "transfer_mode_id", "transfer_mode_name", "lr_no", "lr_date",
            "is_paid", "paid_by", "lr_amount", "other_charge_amount",
            "freight_charge_mode_id", "freight_charge_per_mode", "freight_charge",
            "lu_charge_mode_id", "lu_charge_per_mode", "lu_charge",
            "total", "is_primary", "actual_weight", "charged_weight",
            "noof_bundles", "cancel"
        ]

    def get_transport_name(self, obj):
        try:
            t = TransportMas.objects.filter(pk=obj.transport_id).first()
            return t.name if t else ""
        except Exception:
            return ""

    def get_from_city_name(self, obj):
        try:
            c = CityMas.objects.filter(pk=obj.from_city_id).first()
            return c.name if c else ""
        except Exception:
            return ""

    def get_to_city_name(self, obj):
        try:
            c = CityMas.objects.filter(pk=obj.to_city_id).first()
            return c.name if c else ""
        except Exception:
            return ""

    def get_transfer_mode_name(self, obj):
        try:
            m = TransferModeMas.objects.filter(pk=obj.transfer_mode_id).first()
            return m.name if m else ""
        except Exception:
            return ""


class TransLRMasSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    invoices = TransLRInvoiceDetSerializer(many=True, required=False)
    lr_details = TransLRDetSerializer(many=True, required=False)
    location_name = serializers.SerializerMethodField(read_only=True)
    company_name = serializers.SerializerMethodField(read_only=True)
    agent_name = serializers.SerializerMethodField(read_only=True)
    agent_address = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransLRMas
        fields = [
            "entry_id", "entry_no", "entry_date", "location_id", "location_name",
            "company_id", "company_name", "lr_entry_type_id", "agent_id", "agent_name",
            "agent_address", "actual_weight", "charged_weight", "total_bundles",
            "recvd_bundles", "total_freight_amount", "total_lu_amount",
            "total_other_charge_amount", "total_invoice_amount", "remarks",
            "lr_no", "lr_date", "from_city_id", "to_city_id", "transport_id",
            "cancel", "user_id", "invoices", "lr_details"
        ]

    def get_location_name(self, obj):
        try:
            loc = LocationMas.objects.filter(pk=obj.location_id).first()
            return loc.name if loc else ""
        except Exception:
            return ""

    def get_company_name(self, obj):
        try:
            comp = CompanyMas.objects.filter(pk=obj.company_id).first()
            return comp.name if comp else "SRI GANESHAA SILKS"
        except Exception:
            return "SRI GANESHAA SILKS"

    def get_agent_name(self, obj):
        try:
            agent = AgentMas.objects.filter(pk=obj.agent_id).first()
            return agent.name if agent else ""
        except Exception:
            return ""

    def get_agent_address(self, obj):
        try:
            agent = AgentMas.objects.filter(pk=obj.agent_id).first()
            return agent.address if agent else ""
        except Exception:
            return ""


# =========================================================================
# LR Issue Serializers
# =========================================================================

class TransLRIssueDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransLRIssueDet
        fields = [
            "entry_order_id", "lr_entry_id", "bundles", "entry_time",
            "receipt_bundles", "rcvd_bundles", "cancel"
        ]


class TransLRIssueMasSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    issue_details = TransLRIssueDetSerializer(many=True, required=False)
    location_name = serializers.SerializerMethodField(read_only=True)
    issued_to_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransLRIssueMas
        fields = [
            "entry_id", "entry_no", "entry_date", "location_id", "location_name",
            "issued_to_id", "issued_to_name", "posted_by_id", "remarks",
            "system_name", "user_id", "cancel", "issue_details"
        ]

    def get_location_name(self, obj):
        try:
            loc = LocationMas.objects.filter(pk=obj.location_id).first()
            return loc.name if loc else ""
        except Exception:
            return ""

    def get_issued_to_name(self, obj):
        try:
            emp = EmployeeMas.objects.filter(pk=obj.issued_to_id).first()
            return emp.name if emp else ""
        except Exception:
            return ""


# =========================================================================
# LR Receipt Serializers
# =========================================================================

class TransLRReceiptDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransLRReceiptDet
        fields = [
            "entry_order_id", "lr_entry_id", "bundles", "recvd_bundles",
            "receipt_return", "is_paid", "lr_entry_order_id",
            "lr_issue_entry_order_id", "lr_issue_entry_id", "cancel"
        ]


class TransLRReceiptAddLessDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransLRReceiptAddLessDet
        fields = [
            "entry_order_id", "tax_type_id", "add_or_less_type", "tax_percent",
            "tax_on_amount", "amount", "round_off", "net_amount", "cancel"
        ]


class TransLRReceiptMasSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    receipt_details = TransLRReceiptDetSerializer(many=True, required=False)
    addless_details = TransLRReceiptAddLessDetSerializer(many=True, required=False)
    location_name = serializers.SerializerMethodField(read_only=True)
    tax_type_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransLRReceiptMas
        fields = [
            "entry_id", "entry_no", "entry_date", "receipt_no", "receipt_date",
            "location_id", "location_name", "bundles", "charged_weight",
            "tax_type_id", "tax_type_name", "tax_amount", "wages_amount",
            "addless_amount", "posted_by_id", "remarks", "system_name",
            "user_id", "cancel", "receipt_details", "addless_details"
        ]

    def get_location_name(self, obj):
        try:
            loc = LocationMas.objects.filter(pk=obj.location_id).first()
            return loc.name if loc else ""
        except Exception:
            return ""

    def get_tax_type_name(self, obj):
        try:
            t = TaxTypeMas.objects.filter(pk=obj.tax_type_id).first()
            return t.name if t else ""
        except Exception:
            return ""


# =========================================================================
# LR Transfer / Export Serializers
# =========================================================================

class TransLRTransferDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransLRTransferDet
        fields = ["entry_order_id", "lr_entry_id", "bundles", "cancel"]


class TransLRTransferMasSerializer(serializers.ModelSerializer):
    entry_id = serializers.CharField(max_length=30, required=False)
    transfer_details = TransLRTransferDetSerializer(many=True, required=False)
    location_name = serializers.SerializerMethodField(read_only=True)
    to_location_name = serializers.SerializerMethodField(read_only=True)
    company_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransLRTransferMas
        fields = [
            "entry_id", "entry_no", "entry_date", "location_id", "location_name",
            "from_or_to_location_id", "to_location_name", "company_id", "company_name",
            "noof_bundles", "remarks", "entry_type", "system_name", "user_id",
            "cancel", "exported", "transfer_details"
        ]

    def get_location_name(self, obj):
        try:
            loc = LocationMas.objects.filter(pk=obj.location_id).first()
            return loc.name if loc else ""
        except Exception:
            return ""

    def get_to_location_name(self, obj):
        try:
            loc = LocationMas.objects.filter(pk=obj.from_or_to_location_id).first()
            return loc.name if loc else ""
        except Exception:
            return ""

    def get_company_name(self, obj):
        try:
            comp = CompanyMas.objects.filter(pk=obj.company_id).first()
            return comp.name if comp else ""
        except Exception:
            return ""

