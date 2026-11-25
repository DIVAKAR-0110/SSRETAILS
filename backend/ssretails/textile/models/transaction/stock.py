# backend/ssretails/textile/models/transaction/stock.py
"""
Models Layer: Stock Suite
Maps MS SQL Server tables for Stock Adjustment Note (SAN), Stock Transfer (STN),
Manual Stock Transfer, Stock Inward, and Export.
"""
from django.db import models


class TransSanMas(models.Model):
    """
    Stock Adjustment Note - Master
    Maps directly to Trans_San_Mas in GANESHSSRETAILTRAN.
    """
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    location_code = models.IntegerField(db_column='LocationCode')
    company_code = models.IntegerField(db_column='CompanyCode', default=1)
    total_add_qty = models.DecimalField(db_column='TotalAddQty', max_digits=18, decimal_places=5, default=0)
    total_less_qty = models.DecimalField(db_column='TotalLessQty', max_digits=18, decimal_places=5, default=0)
    remarks = models.CharField(db_column='Remarks', max_length=500, blank=True, null=True)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=1)
    update_user_entry_date_time = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    entry_type = models.CharField(db_column='EntryType', max_length=25, default='NORMAL')

    class Meta:
        managed = False
        db_table = 'Trans_San_Mas'

    def __str__(self):
        return f"SAN {self.entry_no} ({self.entry_id})"


class TransSanDet(models.Model):
    """
    Stock Adjustment Note - Detail
    Maps to Trans_San_Det in GANESHSSRETAILTRAN.
    """
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID')
    barcode = models.CharField(db_column='BarCode', max_length=50, blank=True, null=True)
    stock_qty = models.DecimalField(db_column='StockQty', max_digits=18, decimal_places=5, default=0)
    add_qty = models.DecimalField(db_column='AddQty', max_digits=18, decimal_places=5, default=0)
    less_qty = models.DecimalField(db_column='LessQty', max_digits=18, decimal_places=5, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    location_code = models.IntegerField(db_column='LocationCode')
    uploaded = models.IntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_San_Det'
        unique_together = (('entry_id', 'entry_order_id'),)

    def __str__(self):
        return f"SAN Line {self.entry_id} - {self.barcode}"


class TransStnMas(models.Model):
    """
    Stock Transfer Note - Master (Outward Transfer)
    Maps to Trans_Stn_Mas in GANESHSSRETAILTRAN.
    """
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    location_code = models.IntegerField(db_column='LocationCode')
    from_location_code = models.IntegerField(db_column='FromLocationCode')
    to_location_code = models.IntegerField(db_column='ToLocationCode')
    selection_type = models.CharField(db_column='SelectionType', max_length=10, blank=True, null=True)
    entry_type = models.CharField(db_column='EntryType', max_length=10, default='OUTWARD')
    remarks = models.CharField(db_column='Remarks', max_length=500, blank=True, null=True)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=1)
    update_user_entry_date_time = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.IntegerField(db_column='Cancel', default=0)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    export_cnt = models.IntegerField(db_column='ExportCnt', default=0)
    change_property = models.BooleanField(db_column='ChangeProperty', default=False)

    class Meta:
        managed = False
        db_table = 'Trans_Stn_Mas'

    def __str__(self):
        return f"STN {self.entry_no} ({self.from_location_code} -> {self.to_location_code})"


class TransStnDet(models.Model):
    """
    Stock Transfer Note - Detail
    Maps to Trans_Stn_Det in GANESHSSRETAILTRAN.
    """
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID')
    from_location_code = models.IntegerField(db_column='FromLocationCode')
    to_location_code = models.IntegerField(db_column='ToLocationCode')
    entry_type = models.CharField(db_column='EntryType', max_length=10, blank=True, null=True)
    purchase_code = models.CharField(db_column='PurchaseCode', max_length=30, blank=True, null=True)
    company_code = models.IntegerField(db_column='CompanyCode', default=1)
    supplier_code = models.IntegerField(db_column='SupplierCode', default=0)
    inv_no = models.CharField(db_column='Invno', max_length=50, blank=True, null=True)
    inv_date = models.DateTimeField(db_column='InvDate', blank=True, null=True)
    pb_rate = models.DecimalField(db_column='PBRate', max_digits=18, decimal_places=5, default=0)
    barcode = models.CharField(db_column='Barcode', max_length=50, blank=True, null=True)
    particulars = models.CharField(db_column='Particulars', max_length=250, blank=True, null=True)
    barcode_type = models.CharField(db_column='BarcodeType', max_length=25, blank=True, null=True)
    product_code = models.IntegerField(db_column='ProductCode', default=0)
    item_code = models.IntegerField(db_column='ItemCode', default=0)
    design_no = models.CharField(db_column='Designno', max_length=50, blank=True, null=True)
    mtrs = models.DecimalField(db_column='Mtrs', max_digits=18, decimal_places=5, default=0)
    qty = models.DecimalField(db_column='Qty', max_digits=18, decimal_places=5, default=1)
    pur_rate = models.DecimalField(db_column='PurRate', max_digits=18, decimal_places=5, default=0)
    landed_cost = models.DecimalField(db_column='LandedCost', max_digits=18, decimal_places=5, default=0)
    sale_rate = models.DecimalField(db_column='SaleRate', max_digits=18, decimal_places=5, default=0)
    whole_sale_rate = models.DecimalField(db_column='WholeSaleRate', max_digits=18, decimal_places=5, default=0)
    mrp = models.DecimalField(db_column='MRP', max_digits=18, decimal_places=5, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_Stn_Det'
        unique_together = (('entry_id', 'entry_order_id'),)

    def __str__(self):
        return f"STN Det {self.entry_id} - {self.barcode}"


class TransManualStnDet(models.Model):
    """
    Manual Stock Transfer
    Maps to Trans_ManualSTN_Det in GANESHSSRETAILTRAN.
    """
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    from_location_code = models.IntegerField(db_column='FromLocationCode')
    to_location_code = models.IntegerField(db_column='ToLocationCode')
    product_code = models.IntegerField(db_column='ProductCode')
    qty = models.DecimalField(db_column='Qty', max_digits=18, decimal_places=5)
    rate = models.DecimalField(db_column='Rate', max_digits=18, decimal_places=5, default=0)
    remarks = models.CharField(db_column='Remarks', max_length=100, blank=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    user_id = models.IntegerField(db_column='Userid', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserentryDatetime', auto_now_add=True)
    system_name = models.CharField(db_column='SystemName', max_length=30, blank=True, null=True)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.CharField(db_column='CanceluserEntryDateTime', max_length=30, blank=True, null=True)
    mtrs = models.DecimalField(db_column='Mtrs', max_digits=18, decimal_places=2, default=0)

    class Meta:
        managed = False
        db_table = 'Trans_ManualSTN_Det'
        unique_together = (('entry_id', 'product_code'),)

    def __str__(self):
        return f"Manual STN {self.entry_no} Product {self.product_code}"


class StnInwardMas(models.Model):
    """
    Stock Inward - Master
    Maps to StnInwardMas in GANESHSSRETAILTRAN.
    """
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    location_code = models.IntegerField(db_column='LocationCode')
    from_location_code = models.IntegerField(db_column='FromLocationCode')
    to_location_code = models.IntegerField(db_column='ToLocationCode')
    selection_type = models.CharField(db_column='SelectionType', max_length=10, blank=True, null=True)
    entry_type = models.CharField(db_column='EntryType', max_length=10, default='INWARD')
    remarks = models.CharField(db_column='Remarks', max_length=500, blank=True, null=True)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=1)
    user_entry_date_time = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=1)
    update_user_entry_date_time = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.IntegerField(db_column='Cancel', default=0)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0)
    cancel_user_entry_date_time = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)
    change_property = models.BooleanField(db_column='ChangeProperty', default=False)

    class Meta:
        managed = False
        db_table = 'StnInwardMas'

    def __str__(self):
        return f"Inward STN {self.entry_no} ({self.entry_id})"


class StnInwardDet(models.Model):
    """
    Stock Inward - Detail
    Maps to StnInwardDet in GANESHSSRETAILTRAN.
    """
    entry_id = models.CharField(db_column='EntryID', max_length=30)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID')
    from_location_code = models.IntegerField(db_column='FromLocationCode')
    to_location_code = models.IntegerField(db_column='ToLocationCode')
    entry_type = models.CharField(db_column='EntryType', max_length=10, blank=True, null=True)
    purchase_code = models.CharField(db_column='PurchaseCode', max_length=30, blank=True, null=True)
    company_code = models.IntegerField(db_column='CompanyCode', default=1)
    supplier_code = models.IntegerField(db_column='SupplierCode', default=0)
    inv_no = models.CharField(db_column='Invno', max_length=50, blank=True, null=True)
    inv_date = models.DateTimeField(db_column='InvDate', blank=True, null=True)
    barcode = models.CharField(db_column='Barcode', max_length=50, blank=True, null=True)
    particulars = models.CharField(db_column='Particulars', max_length=250, blank=True, null=True)
    mtrs = models.DecimalField(db_column='Mtrs', max_digits=18, decimal_places=5, default=0)
    qty = models.DecimalField(db_column='Qty', max_digits=18, decimal_places=5, default=1)
    pur_rate = models.DecimalField(db_column='PurRate', max_digits=18, decimal_places=5, default=0)
    landed_cost = models.DecimalField(db_column='LandedCost', max_digits=18, decimal_places=5, default=0)
    sale_rate = models.DecimalField(db_column='SaleRate', max_digits=18, decimal_places=5, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    verified = models.BooleanField(db_column='Verified', default=False)
    edited = models.BooleanField(db_column='Edited', default=False)
    uploaded = models.IntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'StnInwardDet'
        unique_together = (('entry_id', 'entry_order_id'),)

    def __str__(self):
        return f"Inward Line {self.entry_id} - {self.barcode}"


class ExportSetupMas(models.Model):
    """
    Branch Export Setup
    Maps to ExportSetupMas in GANESHSSRETAIL (default DB).
    """
    code = models.IntegerField(db_column='Code', primary_key=True)
    location_code = models.IntegerField(db_column='LocationCode')
    purchase = models.BooleanField(db_column='Purchase', default=False)
    purchase_return = models.BooleanField(db_column='PurchaseReturn', default=False)
    cr_dr_purchase = models.BooleanField(db_column='CRDRPurchase', default=False)
    cr_dr_sales = models.BooleanField(db_column='CRDRSales', default=False)
    sales = models.BooleanField(db_column='Sales', default=False)
    sales_return = models.BooleanField(db_column='SalesReturn', default=False)
    sales_invoice = models.BooleanField(db_column='SalesInvoice', default=False)
    sales_invoice_return = models.BooleanField(db_column='SalesInvoiceReturn', default=False)
    export_to = models.CharField(db_column='ExportTo', max_length=1, default='A')
    export_file_path = models.CharField(db_column='ExportFilePath', max_length=300, blank=True, null=True)
    export_file_type = models.CharField(db_column='ExportFileType', max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ExportSetupMas'

    def __str__(self):
        return f"ExportSetup Code {self.code}"
