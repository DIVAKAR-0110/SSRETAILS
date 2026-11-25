"""
textile/models/transaction/loyalitycard.py
Models for Loyalty Card transactions:
- Trans_LoyaltyCard_Mas
- Trans_LoyaltyCard_Det
- Trans_Loyalty_Redemption_Mas
- Trans_LoyaltyPoints_Mas
- Trans_LoyaltyPoints_Det
Database: GANESHSSRETAILTRAN
"""
from django.db import models


class TransLoyaltyCardMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=30)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    valid_days = models.IntegerField(db_column='ValidDays', default=365)
    digits = models.IntegerField(db_column='Digits', default=0)
    from_no = models.CharField(db_column='FromNo', max_length=50, blank=True, null=True)
    to_no = models.CharField(db_column='ToNo', max_length=50, blank=True, null=True)
    location_code = models.IntegerField(db_column='LocationCode', default=0)
    cancel = models.IntegerField(db_column='Cancel', default=0)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=0)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_LoyaltyCard_Mas'

    def __str__(self):
        return f"{self.entry_no} ({self.from_no} - {self.to_no})"


class TransLoyaltyCardDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, blank=True, null=True)
    entry_no = models.CharField(db_column='EntryNo', max_length=30, blank=True, null=True)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    location_code = models.IntegerField(db_column='LocationCode', default=0)
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=1)
    loyalty_card_no = models.CharField(db_column='LoyaltyCardNo', primary_key=True, max_length=50)
    valid_days = models.IntegerField(db_column='ValidDays', default=365)
    issued = models.IntegerField(db_column='Issued', default=0)
    issued_date = models.DateTimeField(db_column='IssuedDate', blank=True, null=True)
    customer_code = models.IntegerField(db_column='CustomerCode', default=0)
    cancel = models.IntegerField(db_column='Cancel', default=0)  # 1 = Blocked
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    is_merge = models.BooleanField(db_column='IsMerge', default=False)
    merge_user_id = models.IntegerField(db_column='MergeUserID', default=0)
    merge_card_no = models.CharField(db_column='MergeCardNo', max_length=50, blank=True, null=True)
    merge_entry_date_time = models.DateTimeField(db_column='MergeEntryDateTime', blank=True, null=True)
    reason = models.CharField(db_column='Reason', max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_LoyaltyCard_Det'

    def __str__(self):
        return f"{self.loyalty_card_no} (Issued={self.issued}, Cancel={self.cancel})"


class TransLoyaltyRedemptionMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=30)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    customer_code = models.IntegerField(db_column='CustomerCode', default=0)
    loyalty_card_no = models.CharField(db_column='LoyaltyCardNo', max_length=50, blank=True, null=True)
    redemption_points = models.DecimalField(db_column='RedemptionPoints', max_digits=18, decimal_places=5, default=0)
    balance_points = models.DecimalField(db_column='BalancePoints', max_digits=18, decimal_places=5, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    location_code = models.IntegerField(db_column='LocationCode', default=0)
    user_id = models.IntegerField(db_column='UserID', default=0)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_Loyalty_Redemption_Mas'

    def __str__(self):
        return f"{self.entry_no} - Card: {self.loyalty_card_no} ({self.redemption_points} pts)"


class TransLoyaltyPointsMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15, blank=True, null=True)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    loyality_name = models.CharField(db_column='LoyalityName', max_length=50, blank=True, null=True)
    value_per_points = models.DecimalField(db_column='ValuePerPoints', max_digits=18, decimal_places=5, default=0)
    cancel = models.IntegerField(db_column='Cancel', default=0)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    location_code = models.IntegerField(db_column='LocationCode', default=0)
    user_id = models.IntegerField(db_column='UserID', default=0)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_LoyaltyPoints_Mas'

    def __str__(self):
        return f"{self.entry_no} - {self.loyality_name}"


class TransLoyaltyPointsDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, blank=True, null=True)
    entry_no = models.CharField(db_column='EntryNo', max_length=15, blank=True, null=True)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    customer_code = models.IntegerField(db_column='CustomerCode', default=0)
    loyality_card_no = models.CharField(db_column='LoyalityCardNo', max_length=50, primary_key=True)
    points = models.DecimalField(db_column='Points', max_digits=18, decimal_places=5, default=0)
    cancel = models.IntegerField(db_column='Cancel', default=0)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_LoyaltyPoints_Det'

    def __str__(self):
        return f"{self.loyality_card_no} - {self.points} pts"
