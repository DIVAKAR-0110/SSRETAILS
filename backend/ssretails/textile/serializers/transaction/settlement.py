"""
textile/serializers/transaction/settlement.py
Serializers for Settlement transactions:
- TransSettlementMasSerializer
- TransSettlementSalesBillDetSerializer
- TransSettlementVoucherMasSerializer
- SettlementCancelActionSerializer
- ManualVoucherCancelActionSerializer
"""
from rest_framework import serializers
from textile.models.transaction.settlement import (
    TransSettlementMas,
    TransSettlementDet,
    TransSettlementSalesBillDet,
    TransSettlementVoucherMas,
)
from textile.models.master.general import EmployeeMas


class TransSettlementSalesBillDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransSettlementSalesBillDet
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'entry_order_id',
            'sales_entry_id',
            'sales_entry_no',
            'sales_entry_date',
            'bill_amount',
            'cancel',
        ]


class TransSettlementMasSerializer(serializers.ModelSerializer):
    bills = TransSettlementSalesBillDetSerializer(many=True, read_only=True)

    class Meta:
        model = TransSettlementMas
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'location_code',
            'counter_code',
            'customer_code',
            'cash',
            'card',
            'cheque',
            'total_amount',
            'disc_amt',
            'round_off',
            'net_amount',
            'remarks',
            'cancel',
            'cancel_user_id',
            'cancel_user_entry_date_time',
            'bills',
        ]


class TransSettlementVoucherMasSerializer(serializers.ModelSerializer):
    cashier_name = serializers.SerializerMethodField()

    class Meta:
        model = TransSettlementVoucherMas
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'location_code',
            'voucher_amount',
            'issue_cashier_code',
            'cashier_name',
            'issue_settlement_id',
            'issue_settlement_no',
            'issue_settlement_date',
            'cancel',
            'cancel_user_id',
            'cancel_user_entry_date_time',
        ]

    def get_cashier_name(self, obj):
        if obj.issue_cashier_code:
            emp = EmployeeMas.objects.using('default').filter(id=obj.issue_cashier_code).first()
            if emp:
                return emp.name
        return ""


class SettlementCancelActionSerializer(serializers.Serializer):
    entry_id = serializers.CharField(max_length=30)
    user_id = serializers.IntegerField(default=1)
    cancel_date = serializers.DateTimeField(required=False, allow_null=True)


class ManualVoucherCancelActionSerializer(serializers.Serializer):
    entry_id = serializers.CharField(max_length=30)
    user_id = serializers.IntegerField(default=1)
    cancel_date = serializers.DateTimeField(required=False, allow_null=True)
