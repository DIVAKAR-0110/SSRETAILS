"""
textile/serializers/transaction/loyalitycard.py
Serializers for Loyalty Card transactions:
- TransLoyaltyCardDetSerializer
- LoyaltyCardUpdateActionSerializer
- TransLoyaltyRedemptionMasSerializer
- TransLoyaltyPointsMasSerializer
- ManualCancelActionSerializer
"""
from rest_framework import serializers
from textile.models.transaction.loyalitycard import (
    TransLoyaltyCardMas,
    TransLoyaltyCardDet,
    TransLoyaltyRedemptionMas,
    TransLoyaltyPointsMas,
    TransLoyaltyPointsDet,
)
from textile.models.master.intractors import CustomerMas


class TransLoyaltyCardDetSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = TransLoyaltyCardDet
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'location_code',
            'entry_order_id',
            'loyalty_card_no',
            'valid_days',
            'issued',
            'issued_date',
            'customer_code',
            'customer_name',
            'cancel',
            'cancel_user_id',
            'cancel_user_entry_date_time',
            'is_merge',
            'merge_user_id',
            'merge_card_no',
            'merge_entry_date_time',
            'reason',
        ]

    def get_customer_name(self, obj):
        if obj.customer_code:
            cust = CustomerMas.objects.using('default').filter(id=obj.customer_code).first()
            if cust:
                return cust.name
        return ""


class LoyaltyCardUpdateActionSerializer(serializers.Serializer):
    option = serializers.ChoiceField(choices=['Issue', 'Block', 'Merge'])
    date = serializers.DateTimeField(required=False, allow_null=True)
    loyalty_card_no = serializers.CharField(max_length=50)
    customer_code = serializers.IntegerField(required=False, default=0)
    customer_name = serializers.CharField(required=False, allow_blank=True, default='')
    merge_card_no = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    reason = serializers.CharField(max_length=200, required=False, allow_blank=True, default='')
    user_id = serializers.IntegerField(required=False, default=1)


class TransLoyaltyRedemptionMasSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = TransLoyaltyRedemptionMas
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'customer_code',
            'customer_name',
            'loyalty_card_no',
            'redemption_points',
            'balance_points',
            'cancel',
            'cancel_user_id',
            'cancel_user_entry_date_time',
            'location_code',
            'user_id',
            'user_entry_date_time',
        ]

    def get_customer_name(self, obj):
        if obj.customer_code:
            cust = CustomerMas.objects.using('default').filter(id=obj.customer_code).first()
            if cust:
                return cust.name
        return ""


class TransLoyaltyPointsMasSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransLoyaltyPointsMas
        fields = [
            'entry_id',
            'entry_no',
            'entry_date',
            'loyality_name',
            'value_per_points',
            'cancel',
            'cancel_user_id',
            'cancel_user_entry_date_time',
            'location_code',
            'user_id',
            'user_entry_date_time',
        ]


class ManualCancelActionSerializer(serializers.Serializer):
    cancel_type = serializers.ChoiceField(choices=['Redemption', 'Manual'])
    entry_id = serializers.CharField(max_length=30)
    user_id = serializers.IntegerField(required=False, default=1)
    cancel_date = serializers.DateTimeField(required=False, allow_null=True)
