"""
textile/models/transaction/others.py
Models for Transaction -> Others Suite:
- DailyExpenses (Day Book / Cash Balance)
- Trans_CourierInward_Mas (Courier Inward Header)
- Trans_CourierInward_Det (Courier Inward Detail)
- Denomination (Cash Drawer Denomination)
- Trans_SalesTemplate_Det (Sales Template Clear Off)
- Trans_PurchaseTemplate_Mas (Purchase Template Clear Off)
Database: GANESHSSRETAILTRAN
"""
from django.db import models


class DailyExpenses(models.Model):
    expense_code = models.IntegerField(db_column='ExpenseCode', primary_key=True)
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    entry_date = models.DateTimeField(db_column='EntryDate')
    company_code = models.IntegerField(db_column='CompanyCode', default=1)
    counter_code = models.IntegerField(db_column='CounterCode', default=0)
    particulars = models.CharField(db_column='Particulars', max_length=50, blank=True, null=True)
    credit = models.DecimalField(db_column='Credit', max_digits=18, decimal_places=5, default=0)
    debit = models.DecimalField(db_column='Debit', max_digits=18, decimal_places=5, default=0)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    printed = models.IntegerField(db_column='Printed', default=0)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=1)
    employee_code = models.IntegerField(db_column='EmployeeCode', default=0)

    class Meta:
        managed = False
        db_table = 'DailyExpenses'

    def __str__(self):
        return f"{self.particulars} (Dr: {self.debit}, Cr: {self.credit})"


class TransCourierInwardMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=0)
    update_user_entry_date_time = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.IntegerField(db_column='Cancel', default=0)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_CourierInward_Mas'

    def __str__(self):
        return f"{self.entry_no} (Loc: {self.location_code})"


class TransCourierInwardDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID', primary_key=True)
    courier_code = models.IntegerField(db_column='CourierCode', default=0)
    courier_type = models.CharField(db_column='CourierType', max_length=50, blank=True, null=True)
    courier_from = models.CharField(db_column='CourierFrom', max_length=50, blank=True, null=True)
    from_name = models.CharField(db_column='FromName', max_length=200, blank=True, null=True)
    from_code = models.IntegerField(db_column='FromCode', default=0)
    pod_no = models.CharField(db_column='PodNo', max_length=50, blank=True, null=True)
    pod_date = models.DateTimeField(db_column='PodDate', blank=True, null=True)
    employee_code = models.IntegerField(db_column='EmployeeCode', default=0)
    remarks = models.CharField(db_column='Remarks', max_length=200, blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    location_code = models.IntegerField(db_column='LocationCode', default=1)

    class Meta:
        managed = False
        db_table = 'Trans_CourierInward_Det'

    def __str__(self):
        return f"{self.entry_no} - POD: {self.pod_no} ({self.from_name})"


class TransDenomination(models.Model):
    code = models.IntegerField(db_column='Code', primary_key=True)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_type = models.CharField(db_column='EntryType', max_length=15)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    amt_count = models.IntegerField(db_column='AmtCount', default=0)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    confirmed = models.BooleanField(db_column='Confirmed', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    particulars = models.CharField(db_column='Particulars', max_length=50, blank=True, null=True)
    denomination_type = models.BooleanField(db_column='DenominationType', default=False)
    income_or_expense_code = models.IntegerField(db_column='IncomeOrExpenseCode', default=0)

    class Meta:
        managed = False
        db_table = 'Denomination'

    def __str__(self):
        return f"{self.particulars}: {self.amount}"


class TransSalesTemplateDet(models.Model):
    entry_order_id = models.IntegerField(db_column='EntryOrderID', primary_key=True)
    entry_no = models.CharField(db_column='EntryNo', max_length=30)
    entry_date = models.DateTimeField(db_column='EntryDate')
    barcode = models.CharField(db_column='Barcode', max_length=50, blank=True, null=True)
    description = models.CharField(db_column='Description', max_length=200, blank=True, null=True)
    sales_man_1_code = models.IntegerField(db_column='SalesMan1Code', default=0)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    location_code = models.IntegerField(db_column='LocationCode', default=1)

    class Meta:
        managed = False
        db_table = 'Trans_SalesTemplate_Det'


class TransPurchaseTemplateMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', primary_key=True, max_length=30)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    location_code = models.IntegerField(db_column='LocationCode', default=1)
    company_code = models.IntegerField(db_column='CompanyCode', default=1)
    supplier_code = models.IntegerField(db_column='SupplierCode', default=0)
    cancel = models.IntegerField(db_column='Cancel', default=0)
    user_id = models.IntegerField(db_column='UserID', default=1)

    class Meta:
        managed = False
        db_table = 'Trans_PurchaseTemplate_Mas'
