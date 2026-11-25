"""
textile/models/transaction/giftvoucher.py
Models for Gift Voucher transactions:
- Trans_GiftVoucherIssue_Mas
- Trans_GiftVoucherIssue_Det
- Trans_GiftVoucherIssueDetail_Det
- Trans_GiftVoucher_Mas
- Trans_GiftVoucher_Det
- Trans_Advance_Mas
- Trans_Advance_Det
Database: GANESHSSRETAILTRAN
"""
from django.db import models


class TransGiftVoucherIssueMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    customer_code = models.IntegerField(db_column='CustomerCode', default=0)
    auto_or_manual = models.BooleanField(db_column='AutoOrManual', default=False)  # 0 = Fixed, 1 = Variable
    disc_per = models.DecimalField(db_column='Discper', max_digits=18, decimal_places=5, default=0)
    disc_amount = models.DecimalField(db_column='DiscAmount', max_digits=18, decimal_places=5, default=0)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    remarks = models.CharField(db_column='Remarks', max_length=200, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=0)
    update_user_entry_date_time = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    verified = models.IntegerField(db_column='Verified', default=0)
    edited = models.IntegerField(db_column='Edited', default=0)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_GiftVoucherIssue_Mas'

    def __str__(self):
        return f"{self.entry_no} (Cust: {self.customer_code}, Amount: {self.amount})"


class TransGiftVoucherIssueDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    prefix = models.CharField(db_column='Prefix', max_length=15, primary_key=True)  # Composite PK in DB
    from_voucher_no = models.CharField(db_column='FromVoucherNo', max_length=15)
    to_voucher_no = models.CharField(db_column='ToVoucherNo', max_length=15)
    days = models.IntegerField(db_column='Days', default=30)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    verified = models.IntegerField(db_column='Verified', default=0)
    edited = models.IntegerField(db_column='Edited', default=0)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_GiftVoucherIssue_Det'

    def __str__(self):
        return f"{self.entry_no} ({self.prefix}: {self.from_voucher_no} - {self.to_voucher_no})"


class TransGiftVoucherIssueDetailDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=1)
    voucher_no = models.CharField(db_column='VoucherNo', max_length=20, primary_key=True)
    days = models.IntegerField(db_column='Days', default=30)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    verified = models.IntegerField(db_column='Verified', default=0)
    edited = models.IntegerField(db_column='Edited', default=0)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_GiftVoucherIssueDetail_Det'

    def __str__(self):
        return f"{self.voucher_no} (Amt: {self.amount})"


class TransGiftVoucherMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    gift_voucher_code = models.IntegerField(db_column='GiftVoucherCode', default=0)
    auto_or_manual = models.BooleanField(db_column='AutoOrManual', default=False)
    prefix = models.CharField(db_column='Prefix', max_length=10, blank=True, null=True)
    from_no = models.DecimalField(db_column='FromNo', max_digits=18, decimal_places=5, default=0)
    to_no = models.DecimalField(db_column='ToNo', max_digits=18, decimal_places=5, default=0)
    digits = models.IntegerField(db_column='Digits', default=0)
    fixed_length = models.BooleanField(db_column='FixedLength', default=False)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    days = models.DecimalField(db_column='Days', max_digits=18, decimal_places=5, default=0)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=0)
    update_user_entry_date_time = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTme', blank=True, null=True)
    verified = models.IntegerField(db_column='Verified', default=0)
    edited = models.IntegerField(db_column='Edited', default=0)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_GiftVoucher_Mas'

    def __str__(self):
        return f"{self.entry_no} (Prefix: {self.prefix})"


class TransGiftVoucherDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    voucher_no = models.CharField(db_column='VoucherNo', primary_key=True, max_length=15)
    customer_code = models.IntegerField(db_column='CustomerCode', default=0)
    agent_code = models.IntegerField(db_column='AgentCode', default=0)
    issued = models.IntegerField(db_column='Issued', default=0)  # 1 = Issued, 0 = In Inventory
    issued_user_id = models.IntegerField(db_column='IssuedUserId', default=0)
    issued_date = models.DateTimeField(db_column='IssuedDate', blank=True, null=True)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    sales_id = models.CharField(db_column='SalesID', max_length=30, blank=True, null=True)
    sales_no = models.CharField(db_column='SalesNo', max_length=15, blank=True, null=True)
    sales_date = models.DateTimeField(db_column='SalesDate', blank=True, null=True)
    settlement_id = models.CharField(db_column='SettlementID', max_length=30, blank=True, null=True)
    settlement_no = models.CharField(db_column='SettlementNo', max_length=15, blank=True, null=True)
    settlement_date = models.DateTimeField(db_column='SettlementDate', blank=True, null=True)
    verified = models.IntegerField(db_column='Verified', default=0)
    edited = models.IntegerField(db_column='Edited', default=0)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    days = models.IntegerField(db_column='DAYS', default=30)
    issue_entry_id = models.CharField(db_column='IssueEntryID', max_length=50, blank=True, null=True)
    reference = models.CharField(db_column='Reference', max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_GiftVoucher_Det'

    def __str__(self):
        return f"{self.voucher_no} (Issued: {self.issued})"


class TransAdvanceMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_type = models.CharField(db_column='EntryType', max_length=50, blank=True, null=True)
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    counter_code = models.IntegerField(db_column='CounterCode', default=0)
    system_code = models.IntegerField(db_column='SystemCode', default=0)
    customer_code = models.IntegerField(db_column='CustomerCode', default=0)
    cash = models.DecimalField(db_column='Cash', max_digits=18, decimal_places=5, default=0)
    card = models.DecimalField(db_column='Card', max_digits=18, decimal_places=5, default=0)
    cheque = models.DecimalField(db_column='Cheque', max_digits=18, decimal_places=5, default=0)
    others = models.DecimalField(db_column='Others', max_digits=18, decimal_places=5, default=0)
    balance = models.DecimalField(db_column='Balance', max_digits=18, decimal_places=5, default=0)
    total_amount = models.DecimalField(db_column='TotalAmount', max_digits=18, decimal_places=5, default=0)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    ref_entry_id = models.CharField(db_column='RefEntryID', max_length=30, blank=True, null=True)
    ref_entry_no = models.CharField(db_column='RefEntryNo', max_length=15, blank=True, null=True)
    ref_entry_date = models.DateTimeField(db_column='RefEntryDate', blank=True, null=True)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=0)
    update_user_entry_date_time = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTme', blank=True, null=True)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_Advance_Mas'


class TransAdvanceDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=1, primary_key=True)
    pay_type = models.CharField(db_column='PayType', max_length=50, blank=True, null=True)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    reference_date = models.DateTimeField(db_column='ReferenceDate', blank=True, null=True)
    reference_no = models.CharField(db_column='ReferenceNo', max_length=50, blank=True, null=True)
    bank_code = models.IntegerField(db_column='BankCode', default=0)
    card_holder_name = models.CharField(db_column='CardHolderName', max_length=50, blank=True, null=True)
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_Advance_Det'
