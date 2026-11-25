"""
textile/models/transaction/settlement.py
Models for Settlement transactions:
- Trans_Settlement_Mas
- Trans_Settlement_Det
- Trans_SettlementSalesBill_Det
- Trans_SettlementVoucher_Mas
Database: GANESHSSRETAILTRAN
"""
from django.db import models


class TransSettlementMas(models.Model):
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
    disc_per = models.DecimalField(db_column='DiscPer', max_digits=10, decimal_places=5, default=0)
    disc_amt = models.DecimalField(db_column='DiscAmt', max_digits=18, decimal_places=5, default=0)
    round_off = models.DecimalField(db_column='RoundOff', max_digits=10, decimal_places=2, default=0)
    net_amount = models.DecimalField(db_column='NetAmount', max_digits=18, decimal_places=5, default=0)
    refund = models.DecimalField(db_column='Refund', max_digits=18, decimal_places=5, default=0)
    new_set_id = models.CharField(db_column='NewSetID', max_length=30, blank=True, null=True)
    remarks = models.CharField(db_column='Remarks', max_length=500, blank=True, null=True)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=0)
    update_user_entry_date_time = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTme', blank=True, null=True)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    authorisation_code = models.IntegerField(db_column='AuthorisationCode', default=0)
    return_amount = models.DecimalField(db_column='ReturnAmount', max_digits=18, decimal_places=5, default=0)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    loyalty_card_no = models.CharField(db_column='LoyaltyCardNo', max_length=50, blank=True, null=True)
    bill_points = models.DecimalField(db_column='BillPoints', max_digits=18, decimal_places=5, default=0)
    points_amount = models.DecimalField(db_column='PointsAmount', max_digits=18, decimal_places=5, default=0)
    bonus_point = models.DecimalField(db_column='BonusPoint', max_digits=18, decimal_places=2, default=0)

    class Meta:
        managed = False
        db_table = 'Trans_Settlement_Mas'

    def __str__(self):
        return f"{self.entry_no} (NetAmount: {self.net_amount}, Cancel: {self.cancel})"


class TransSettlementDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=1, primary_key=True)
    pay_type = models.CharField(db_column='PayType', max_length=50, blank=True, null=True)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    reference_date = models.DateTimeField(db_column='ReferenceDate', blank=True, null=True)
    reference_no = models.CharField(db_column='ReferenceNo', max_length=50, blank=True, null=True)
    bank_code = models.IntegerField(db_column='BankCode', default=0)
    card_holder_name = models.CharField(db_column='CardHolderName', max_length=50, blank=True, null=True)
    service_charge = models.DecimalField(db_column='ServiceCharge', max_digits=18, decimal_places=5, default=0)
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_Settlement_Det'

    def __str__(self):
        return f"{self.entry_id} - {self.pay_type} ({self.amount})"


class TransSettlementSalesBillDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=1)
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    sales_entry_id = models.CharField(db_column='SalesEntryID', max_length=30)
    sales_entry_no = models.CharField(db_column='SalesEntryNo', max_length=30, primary_key=True)
    sales_entry_date = models.DateTimeField(db_column='SalesEntryDate')
    bill_amount = models.DecimalField(db_column='BillAmount', max_digits=18, decimal_places=5, default=0)
    card_amount = models.DecimalField(db_column='CardAmount', max_digits=18, decimal_places=5, default=0)
    set_disc_per = models.DecimalField(db_column='SetDiscper', max_digits=18, decimal_places=5, default=0)
    set_disc_amt = models.DecimalField(db_column='SetDiscAmt', max_digits=18, decimal_places=5, default=0)
    pay_mode_type = models.IntegerField(db_column='PayModeType', default=0)
    customer_code = models.IntegerField(db_column='CustomerCode', default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    company_code = models.IntegerField(db_column='CompanyCode', default=0)
    total_qty = models.DecimalField(db_column='TotalQty', max_digits=18, decimal_places=5, default=0)
    system_code = models.IntegerField(db_column='SystemCode', default=0)
    counter_code = models.IntegerField(db_column='CounterCode', default=0)
    loyalty_card_no = models.CharField(db_column='LoyaltyCardNo', max_length=50, blank=True, null=True)
    manual_no = models.CharField(db_column='ManualNo', max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_SettlementSalesBill_Det'

    def __str__(self):
        return f"{self.sales_entry_no} (Amt: {self.bill_amount}, Cancel: {self.cancel})"


class TransSettlementVoucherMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='EntryNo', max_length=15, blank=True, null=True)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    voucher_amount = models.DecimalField(db_column='VoucherAmount', max_digits=18, decimal_places=5, default=0)
    issue_cashier_code = models.IntegerField(db_column='IssueCashierCode', default=0)
    issue_settlement_id = models.CharField(db_column='IssueSettlementID', max_length=30, blank=True, null=True)
    issue_settlement_no = models.CharField(db_column='IssueSettlementNo', max_length=15, blank=True, null=True)
    issue_settlement_date = models.DateTimeField(db_column='IssueSettlementDate', blank=True, null=True)
    received_cashier_code = models.IntegerField(db_column='ReceivedCashierCode', default=0)
    received_settlement_id = models.CharField(db_column='ReceivedSettlementID', max_length=30, blank=True, null=True)
    received_settlement_no = models.CharField(db_column='ReceivedSettlementNo', max_length=15, blank=True, null=True)
    received_settlement_date = models.DateTimeField(db_column='ReceivedSettlementDate', blank=True, null=True)
    cancel = models.IntegerField(db_column='Cancel', default=0)  # 1 = Cancelled, 0 = Active
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntrydatetime', blank=True, null=True)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    from_type = models.IntegerField(db_column='FromType', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_SettlementVoucher_Mas'

    def __str__(self):
        return f"{self.entry_no} (Amount: {self.voucher_amount}, Cancel: {self.cancel})"
