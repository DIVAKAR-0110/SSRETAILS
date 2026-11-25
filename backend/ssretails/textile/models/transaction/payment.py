# textile/models/transaction/payment.py
from django.db import models


class TransPaymentMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    company_id = models.IntegerField(db_column='CompanyCode', default=0)
    supplier_id = models.IntegerField(db_column='SupplierCode', default=0)
    advance_amount = models.DecimalField(db_column='AdvanceAmount', max_digits=18, decimal_places=2, default=0)
    add_less_amount = models.DecimalField(db_column='AddLessAmount', max_digits=18, decimal_places=2, default=0)
    tax_amount = models.DecimalField(db_column='TaxAmount', max_digits=18, decimal_places=2, default=0)
    paid_amount = models.DecimalField(db_column='PaidAmount', max_digits=18, decimal_places=2, default=0)
    posted_by = models.IntegerField(db_column='PostedBy', default=0)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=0)
    user_entry_datetime = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=0, null=True)
    update_user_entry_datetime = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0, null=True)
    cancel_user_entry_datetime = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    edited = models.BooleanField(db_column='Edited', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_Payment_Mas'


class TransPaymentDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    ref_entry_id = models.CharField(db_column='RefEntryID', max_length=30)
    ref_entry_no = models.CharField(db_column='RefEntryNo', max_length=15)
    ref_entry_date = models.DateTimeField(db_column='RefEntryDate', blank=True, null=True)
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=0)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    company_id = models.IntegerField(db_column='CompanyCode', default=0)
    supplier_id = models.IntegerField(db_column='SupplierCode', default=0)
    inv_no = models.CharField(db_column='InvNo', max_length=50, blank=True, null=True)
    inv_date = models.DateTimeField(db_column='InvDate', blank=True, null=True)
    inv_amount = models.DecimalField(db_column='InvAmount', max_digits=18, decimal_places=2, default=0)
    entry_type = models.CharField(db_column='EntryType', max_length=5, blank=True, null=True)
    paid_amount = models.DecimalField(db_column='PaidAmount', max_digits=18, decimal_places=2, default=0)
    balance_amount = models.DecimalField(db_column='BalanceAmount', max_digits=18, decimal_places=2, default=0)
    cd_percentage = models.DecimalField(db_column='CDPercentage', max_digits=15, decimal_places=2, default=0)
    cd_amount = models.DecimalField(db_column='CDAmount', max_digits=15, decimal_places=2, default=0)
    agent_id = models.IntegerField(db_column='AgentCode', default=0)
    agent_per = models.DecimalField(db_column='AgentPer', max_digits=15, decimal_places=2, default=0)
    agent_amount = models.DecimalField(db_column='AgentAmount', max_digits=15, decimal_places=2, default=0)
    disc_per = models.DecimalField(db_column='DiscPer', max_digits=15, decimal_places=2, default=0)
    disc_amount = models.DecimalField(db_column='DiscAmount', max_digits=15, decimal_places=2, default=0)
    delay_or_early = models.BooleanField(db_column='DelayOrEarly', default=False)
    interest_per = models.DecimalField(db_column='InterestPer', max_digits=15, decimal_places=2, default=0)
    interest_amount = models.DecimalField(db_column='InterestAmount', max_digits=15, decimal_places=2, default=0)
    net_amount = models.DecimalField(db_column='NetAmount', max_digits=15, decimal_places=2, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_Payment_Det'


class TransPaymentModeDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=0)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    pay_mode_type = models.CharField(db_column='PayModeType', max_length=2, blank=True, null=True)
    bank_id = models.IntegerField(db_column='BankCode', default=0)
    set_no = models.CharField(db_column='SetNo', max_length=50, blank=True, null=True)
    payable_at = models.IntegerField(db_column='PayableAt', default=0)
    dd_favour_of = models.CharField(db_column='DDFavourOf', max_length=100, blank=True, null=True)
    dd_or_cheque_no = models.CharField(db_column='DDorChequeNo', max_length=50, blank=True, null=True)
    dd_or_cheque_date = models.DateTimeField(db_column='DDorChequeDate', blank=True, null=True)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=2, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_PaymentMode_det'


class TransPaymentTaxDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=0)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    entry_type = models.CharField(db_column='EntryType', max_length=10, blank=True, null=True)
    tax_type_code = models.IntegerField(db_column='TaxTypeCode', default=0)
    add_or_less_type = models.BooleanField(db_column='AddorLessType', default=False)
    tax_on_amount = models.DecimalField(db_column='TaxonAmount', max_digits=18, decimal_places=5, default=0)
    tax_percent = models.DecimalField(db_column='TaxPercent', max_digits=10, decimal_places=5, default=0)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    round_off = models.DecimalField(db_column='RoundOff', max_digits=10, decimal_places=5, default=0)
    net_amount = models.DecimalField(db_column='NetAmount', max_digits=18, decimal_places=5, default=0)
    cancel = models.SmallIntegerField(db_column='Cancel', default=0)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_PaymentTax_Det'


class TransBalanceDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    inv_no = models.CharField(db_column='InvNo', max_length=50, blank=True, null=True)
    inv_date = models.DateTimeField(db_column='InvDate', blank=True, null=True)
    company_id = models.IntegerField(db_column='CompanyCode', default=0)
    supplier_id = models.IntegerField(db_column='SupplierCode', default=0)
    remarks = models.CharField(db_column='Remarks', max_length=200, blank=True, null=True)
    debit_amount = models.DecimalField(db_column='DebitAmount', max_digits=18, decimal_places=2, default=0)
    credit_amount = models.DecimalField(db_column='CreditAmount', max_digits=18, decimal_places=2, default=0)
    balance = models.DecimalField(db_column='Balance', max_digits=18, decimal_places=2, default=0)
    entry_type = models.CharField(db_column='EntryType', max_length=5, blank=True, null=True)
    closed = models.BooleanField(db_column='Closed', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_Balance_Det'


class TransSupplierAdvanceMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='EntryNo', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate', blank=True, null=True)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    company_id = models.IntegerField(db_column='CompanyCode', default=0)
    supplier_id = models.IntegerField(db_column='SupplierCode', default=0)
    net_amount = models.DecimalField(db_column='NetAmount', max_digits=18, decimal_places=2, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_SupplierAdvance_Mas'
