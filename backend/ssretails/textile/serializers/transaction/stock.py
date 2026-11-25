# backend/ssretails/textile/serializers/transaction/stock.py
"""
Serializers Layer: Stock Suite
Provides data validation and serialization for Stock Adjustment Note (SAN),
Stock Transfer (STN), Manual Stock Transfer, Stock Inward, and Branch Export.
"""
from rest_framework import serializers
from textile.models.transaction.stock import (
    TransSanMas, TransSanDet,
    TransStnMas, TransStnDet,
    TransManualStnDet,
    StnInwardMas, StnInwardDet,
    ExportSetupMas
)


# ==============================================================================
# 1. Stock Adjustment Note Serializers
# ==============================================================================
class TransSanDetItemSerializer(serializers.Serializer):
    barcode = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    particulars = serializers.CharField(max_length=250, required=False, allow_blank=True, default='')
    stock_qty = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    add_qty = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    less_qty = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    net_rate = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    sale_rate = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    amount = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)


class StockAdjustmentNoteSaveSerializer(serializers.Serializer):
    location_code = serializers.IntegerField(required=True)
    company_code = serializers.IntegerField(default=1)
    section_code = serializers.IntegerField(required=False, default=0)
    entry_date = serializers.DateTimeField(required=False)
    stock_verified = serializers.BooleanField(default=False)
    remarks = serializers.CharField(max_length=500, required=False, allow_blank=True, default='')
    items = TransSanDetItemSerializer(many=True, required=True)


# ==============================================================================
# 2. Stock Transfer (STN Outward) Serializers
# ==============================================================================
class TransStnDetItemSerializer(serializers.Serializer):
    barcode = serializers.CharField(max_length=50, required=True)
    particulars = serializers.CharField(max_length=250, required=False, allow_blank=True, default='')
    fd_percent = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    mtrs = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    qty = serializers.DecimalField(max_digits=18, decimal_places=5, default=1)
    sale_rate = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    cost = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    amount = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    stock_qty = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)


class StockTransferSaveSerializer(serializers.Serializer):
    from_location_code = serializers.IntegerField(required=True)
    to_location_code = serializers.IntegerField(required=True)
    load_from = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    selection_type = serializers.CharField(max_length=10, default='Barcode')
    entry_date = serializers.DateTimeField(required=False)
    remarks = serializers.CharField(max_length=500, required=False, allow_blank=True, default='')
    items = TransStnDetItemSerializer(many=True, required=True)


# ==============================================================================
# 3. Manual Stock Transfer Serializers
# ==============================================================================
class ManualStnItemSerializer(serializers.Serializer):
    product_code = serializers.IntegerField(required=True)
    qty = serializers.DecimalField(max_digits=18, decimal_places=5, default=1)
    mtrs = serializers.DecimalField(max_digits=18, decimal_places=2, default=0)
    rate = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    remarks = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')


class ManualStockTransferSaveSerializer(serializers.Serializer):
    from_location_code = serializers.IntegerField(required=True)
    to_location_code = serializers.IntegerField(required=True)
    entry_date = serializers.DateTimeField(required=False)
    items = ManualStnItemSerializer(many=True, required=True)


# ==============================================================================
# 4. Stock Export Serializers
# ==============================================================================
class StockExportActionSerializer(serializers.Serializer):
    from_location_code = serializers.IntegerField(required=True)
    to_location_code = serializers.IntegerField(required=False, default=0)
    stn_entry_ids = serializers.ListField(child=serializers.CharField(max_length=30), required=True)
    export_type = serializers.CharField(max_length=20, default='Direct')
    file_path = serializers.CharField(max_length=300, required=False, allow_blank=True, default='')


# ==============================================================================
# 5. Stock Inward Serializers
# ==============================================================================
class StockInwardSaveSerializer(serializers.Serializer):
    location_code = serializers.IntegerField(required=True)
    from_location_code = serializers.IntegerField(required=True)
    inward_type = serializers.CharField(max_length=10, default='Direct')
    entry_date = serializers.DateTimeField(required=False)
    stn_bill_nos = serializers.ListField(child=serializers.CharField(max_length=30), required=True)
    change_property = serializers.BooleanField(default=False)
    remarks = serializers.CharField(max_length=500, required=False, allow_blank=True, default='')


# ==============================================================================
# 6. Branch Export Serializers
# ==============================================================================
class BranchExportActionSerializer(serializers.Serializer):
    document_type = serializers.ChoiceField(choices=['Purchase Return', 'Sales Invoice'], default='Purchase Return')
    location_code = serializers.IntegerField(required=True)
    from_date = serializers.DateField(required=True)
    to_date = serializers.DateField(required=True)
    bill_nos = serializers.ListField(child=serializers.CharField(max_length=30), required=True)
    export_to = serializers.ChoiceField(choices=['Access', 'XML'], default='Access')
    file_path = serializers.CharField(max_length=300, required=False, allow_blank=True, default='')
