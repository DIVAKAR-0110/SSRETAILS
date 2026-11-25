# textile/models/transaction/purchaseorder.py
from django.db import models


class TransPurchaseOrderMas(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    company_id = models.IntegerField(db_column='CompanyCode', default=0)
    purchase_type = models.CharField(db_column='PurchaseType', max_length=25, default='0')
    order_no = models.CharField(db_column='OrderNo', max_length=50, blank=True, null=True)
    order_date = models.DateTimeField(db_column='OrderDate', blank=True, null=True)
    supplier_id = models.IntegerField(db_column='SupplierCode', default=0)
    rep_name = models.CharField(db_column='RepName', max_length=50, blank=True, null=True)
    payment_terms = models.CharField(db_column='PaymentTerms', max_length=500, blank=True, null=True)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    remarks = models.CharField(db_column='Remarks', max_length=500, blank=True, null=True)
    system_name = models.CharField(db_column='SystemName', max_length=50, blank=True, null=True)
    user_id = models.IntegerField(db_column='UserID', default=0)
    user_entry_datetime = models.DateTimeField(db_column='UserEntryDateTime', auto_now_add=True)
    update_user_id = models.IntegerField(db_column='UpdateUserID', default=0, null=True)
    update_user_entry_datetime = models.DateTimeField(db_column='UpdateUserEntryDateTime', blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    cancel_user_id = models.IntegerField(db_column='CancelUserID', default=0, null=True)
    cancel_user_entry_datetime = models.DateTimeField(db_column='CancelUserEntryDateTime', blank=True, null=True)
    uploaded = models.SmallIntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_PurchaseOrder_Mas'


class TransPurchaseOrderDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=0)
    fixed_code = models.CharField(db_column='FixedCode', max_length=50, blank=True, null=True)
    product_id = models.IntegerField(db_column='ProductCode', default=0)
    item_id = models.IntegerField(db_column='ItemCode', default=0)
    design_no = models.CharField(db_column='Designno', max_length=50, blank=True, null=True)
    qty = models.DecimalField(db_column='Qty', max_digits=18, decimal_places=5, default=0)
    mtrs = models.DecimalField(db_column='Mtrs', max_digits=18, decimal_places=5, default=0)
    total_qty = models.DecimalField(db_column='TotalQty', max_digits=18, decimal_places=5, default=0)
    recvd_qty = models.DecimalField(db_column='RecvdQty', max_digits=18, decimal_places=5, default=0)
    cancel_qty = models.DecimalField(db_column='CancelQty', max_digits=18, decimal_places=5, default=0)
    rate = models.DecimalField(db_column='Rate', max_digits=18, decimal_places=5, default=0)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    mrp = models.DecimalField(db_column='Mrp', max_digits=18, decimal_places=5, default=0)
    purchase_tax1_code = models.IntegerField(db_column='PurchaseTax1Code', default=0)
    purchase_tax2_code = models.IntegerField(db_column='PurchaseTax2Code', default=0)
    purchase_tax3_code = models.IntegerField(db_column='PurchaseTax3Code', default=0)
    group_tax_code = models.IntegerField(db_column='GroupTaxCode', default=0)
    delivery_date = models.DateTimeField(db_column='DeliveryDate', blank=True, null=True)
    item_category_code1 = models.IntegerField(db_column='ItemCategoryCode1', default=0)
    item_category_code2 = models.IntegerField(db_column='ItemCategoryCode2', default=0)
    item_category_code3 = models.IntegerField(db_column='ItemCategoryCode3', default=0)
    item_category_code4 = models.IntegerField(db_column='ItemCategoryCode4', default=0)
    item_category_code5 = models.IntegerField(db_column='ItemCategoryCode5', default=0)
    item_category_code6 = models.IntegerField(db_column='ItemCategoryCode6', default=0)
    item_category_code7 = models.IntegerField(db_column='ItemCategoryCode7', default=0)
    item_category_code8 = models.IntegerField(db_column='ItemCategoryCode8', default=0)
    item_category_code9 = models.IntegerField(db_column='ItemCategoryCode9', default=0)
    image_name = models.CharField(db_column='ImageName', max_length=50, blank=True, null=True)
    size_type = models.CharField(db_column='SizeType', max_length=25, blank=True, null=True)
    from_size_code = models.IntegerField(db_column='FromSizeCode', default=0)
    to_size_code = models.IntegerField(db_column='ToSizeCode', default=0)
    jump_ratio = models.IntegerField(db_column='JumpRatio', default=0)
    order_cancel_id = models.CharField(db_column='OrderCancelID', max_length=30, blank=True, null=True)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    uploaded = models.SmallIntegerField(db_column='Uploaded', default=0)
    remarks = models.CharField(db_column='Remarks', max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Trans_PurchaseOrder_Det'


class TransPurchaseOrderDiscountDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=0)
    days = models.IntegerField(db_column='Days', default=0)
    discount_per = models.DecimalField(db_column='DiscountPer', max_digits=10, decimal_places=5, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    uploaded = models.SmallIntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_PurchaseOrderDiscount_Det'


class TransPurchaseOrderSizeDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    mas_entry_order_id = models.IntegerField(db_column='MasEntryOrderID', default=0)
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=0)
    fixed_code = models.CharField(db_column='FixedCode', max_length=50)
    item_category_code1 = models.IntegerField(db_column='ItemCategoryCode1', default=0)
    item_category_code2 = models.IntegerField(db_column='ItemCategoryCode2', default=0)
    item_category_code3 = models.IntegerField(db_column='ItemCategoryCode3', default=0)
    item_category_code4 = models.IntegerField(db_column='ItemCategoryCode4', default=0)
    item_category_code5 = models.IntegerField(db_column='ItemCategoryCode5', default=0)
    item_category_code6 = models.IntegerField(db_column='ItemCategoryCode6', default=0)
    item_category_code7 = models.IntegerField(db_column='ItemCategoryCode7', default=0)
    item_category_code8 = models.IntegerField(db_column='ItemCategoryCode8', default=0)
    item_category_code9 = models.IntegerField(db_column='ItemCategoryCode9', default=0)
    item_category_code10 = models.IntegerField(db_column='ItemCategoryCode10', default=0)
    qty = models.DecimalField(db_column='Qty', max_digits=18, decimal_places=5, default=0)
    mtrs = models.DecimalField(db_column='Mtrs', max_digits=18, decimal_places=5, default=0)
    recvd_qty = models.DecimalField(db_column='RecvdQty', max_digits=18, decimal_places=5, default=0)
    net_rate = models.DecimalField(db_column='NetRate', max_digits=18, decimal_places=5, default=0)
    mrp = models.DecimalField(db_column='Mrp', max_digits=18, decimal_places=5, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    order_cancel_id = models.CharField(db_column='OrderCancelID', max_length=30, blank=True, null=True)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    uploaded = models.SmallIntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_PurchaseOrderSize_Det'


class TransPurchaseOrderAddLessDet(models.Model):
    entry_id = models.CharField(db_column='EntryID', max_length=30, primary_key=True)
    entry_no = models.CharField(db_column='Entryno', max_length=15)
    entry_date = models.DateTimeField(db_column='EntryDate')
    entry_order_id = models.IntegerField(db_column='EntryOrderID', default=0)
    entry_type = models.CharField(db_column='EntryType', max_length=10)
    tax_type_code = models.IntegerField(db_column='TaxTypeCode', default=0)
    add_or_less_type = models.BooleanField(db_column='AddorLessType', default=False)
    tax_percent = models.DecimalField(db_column='TaxPercent', max_digits=10, decimal_places=5, default=0)
    tax_on_amount = models.DecimalField(db_column='TaxonAmount', max_digits=18, decimal_places=5, default=0)
    amount = models.DecimalField(db_column='Amount', max_digits=18, decimal_places=5, default=0)
    round_off = models.DecimalField(db_column='RoundOff', max_digits=18, decimal_places=5, default=0)
    net_amount = models.DecimalField(db_column='NetAmount', max_digits=18, decimal_places=5, default=0)
    cancel = models.BooleanField(db_column='Cancel', default=False)
    location_id = models.IntegerField(db_column='LocationCode', default=0)
    uploaded = models.SmallIntegerField(db_column='Uploaded', default=0)

    class Meta:
        managed = False
        db_table = 'Trans_PurchaseOrderAddLess_Det'
