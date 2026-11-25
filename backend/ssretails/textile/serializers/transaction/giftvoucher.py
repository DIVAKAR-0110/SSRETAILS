"""
textile/serializers/transaction/giftvoucher.py
Serializers for Gift Voucher transactions:
- TransGiftVoucherIssueMasSerializer
- TransGiftVoucherIssueDetSerializer
- TransGiftVoucherIssueDetailDetSerializer
- GiftVoucherIssueSaveSerializer
- GiftVoucherCancelActionSerializer
"""
from rest_framework import serializers
from textile.models.transaction.giftvoucher import (
    TransGiftVoucherIssueMas,
    TransGiftVoucherIssueDet,
    TransGiftVoucherIssueDetailDet,
    TransGiftVoucherMas,
    TransGiftVoucherDet,
    TransAdvanceMas,
    TransAdvanceDet,
)
from textile.models.master.intractors import CustomerMas
from textile.models.master.location import LocationMas
from textile.models.master.general import EmployeeMas


class TransGiftVoucherIssueMasSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = TransGiftVoucherIssueMas
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'location_code',
            'location_name',
            'customer_code',
            'customer_name',
            'auto_or_manual',
            'disc_per',
            'disc_amount',
            'amount',
            'system_name',
            'remarks',
            'user_id',
            'user_name',
            'cancel',
            'cancel_user_id',
            'cancel_user_entry_date_time',
        ]

    def get_customer_name(self, obj):
        if obj.customer_code:
            c = CustomerMas.objects.using('default').filter(id=obj.customer_code).first()
            if c:
                return c.name
        return ""

    def get_location_name(self, obj):
        if obj.location_code:
            loc = LocationMas.objects.using('default').filter(code=obj.location_code).first()
            if loc:
                return loc.name
        return ""

    def get_user_name(self, obj):
        if obj.user_id:
            emp = EmployeeMas.objects.using('default').filter(id=obj.user_id).first()
            if emp:
                return emp.name
        return ""


class TransGiftVoucherIssueDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransGiftVoucherIssueDet
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'prefix',
            'from_voucher_no',
            'to_voucher_no',
            'days',
            'amount',
            'cancel',
        ]


class TransGiftVoucherIssueDetailDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransGiftVoucherIssueDetailDet
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'entry_order_id',
            'voucher_no',
            'days',
            'amount',
            'cancel',
        ]


class DenominationItemSerializer(serializers.Serializer):
    denomination = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    prefix = serializers.CharField(max_length=15, required=False, allow_blank=True, default='')
    from_no = serializers.CharField(max_length=15, required=False, allow_blank=True, default='')
    to_no = serializers.CharField(max_length=15, required=False, allow_blank=True, default='')
    days = serializers.IntegerField(default=30)
    amount = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)


class SettlementItemSerializer(serializers.Serializer):
    pay_type = serializers.CharField(max_length=50)  # CASH, CARD, CHEQUE
    amount = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    reference_no = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    date = serializers.DateTimeField(required=False, allow_null=True)
    bank_code = serializers.IntegerField(default=0)


class GiftVoucherIssueSaveSerializer(serializers.Serializer):
    location_code = serializers.IntegerField(default=1)
    customer_code = serializers.IntegerField(default=0)
    voucher_type = serializers.ChoiceField(choices=['Fixed', 'Variable'], default='Fixed')
    entry_date = serializers.DateTimeField(required=False, allow_null=True)
    posted_by = serializers.IntegerField(default=1)
    disc_per = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    disc_amount = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    amount = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    net_amount = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    remarks = serializers.CharField(max_length=200, required=False, allow_blank=True, default='')
    denominations = DenominationItemSerializer(many=True, required=False, default=list)
    settlements = SettlementItemSerializer(many=True, required=False, default=list)


class VoucherCancelItemSerializer(serializers.Serializer):
    entry_id = serializers.CharField(max_length=30)
    voucher_no = serializers.CharField(max_length=30)
    amount = serializers.DecimalField(max_digits=18, decimal_places=5, required=False, default=0)
    days = serializers.IntegerField(required=False, default=0)


class GiftVoucherCancelActionSerializer(serializers.Serializer):
    vouchers = VoucherCancelItemSerializer(many=True)
    user_id = serializers.IntegerField(default=1)
    cancel_date = serializers.DateTimeField(required=False, allow_null=True)
