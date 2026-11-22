# textile/models/master/job_work.py
from django.db import models


class JobWorkChargeHeadMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'JobWorkChargeHeadMas'
        managed = False

    def __str__(self):
        return self.name


class TailorMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    city_id = models.IntegerField(default=0, db_column='CityCode')
    pincode = models.CharField(max_length=50, null=True, blank=True, db_column='Pincode')
    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    website = models.CharField(max_length=50, null=True, blank=True, db_column='Website')
    tinno = models.CharField(max_length=50, null=True, blank=True, db_column='Tinno')
    tindate = models.DateTimeField(null=True, blank=True, db_column='TinDate')
    area_code = models.CharField(max_length=50, null=True, blank=True, db_column='AreaCode')
    cstno = models.CharField(max_length=50, null=True, blank=True, db_column='CstNo')
    cstdate = models.DateTimeField(null=True, blank=True, db_column='CstDate')
    tanno = models.CharField(max_length=50, null=True, blank=True, db_column='Tanno')
    panno = models.CharField(max_length=50, null=True, blank=True, db_column='Panno')
    service_tax_no = models.CharField(max_length=50, null=True, blank=True, db_column='ServiceTaxno')
    commission_percent = models.DecimalField(max_digits=10, decimal_places=5, default=0, db_column='CommissionPercent')
    ecs_transfer = models.BooleanField(default=False, db_column='ECSTransfer')
    cheque_name = models.CharField(max_length=50, null=True, blank=True, db_column='ChequeName')
    bank_id = models.IntegerField(default=0, db_column='BankCode')
    branch = models.CharField(max_length=50, null=True, blank=True, db_column='Branch')
    account_no = models.CharField(max_length=50, null=True, blank=True, db_column='AccountNo')
    ifpn_no = models.CharField(max_length=50, null=True, blank=True, db_column='IFPNNo')
    micr_code = models.CharField(max_length=50, null=True, blank=True, db_column='MICRCode')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    acc_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccHeadName')
    sales = models.BooleanField(default=False, db_column='Sales')

    class Meta:
        app_label = 'textile'
        db_table = 'TailorMas'
        managed = False

    def __str__(self):
        return self.name


class ContactDetailsMas(models.Model):
    mas_code = models.IntegerField(db_column='MasCode')
    mas_from = models.CharField(max_length=25, db_column='MasFrom')
    entry_order_id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    gender = models.CharField(max_length=10, null=True, blank=True, db_column='Gender')
    designation = models.CharField(max_length=50, null=True, blank=True, db_column='Designation')
    dob = models.DateTimeField(null=True, blank=True, db_column='DOB')
    doa = models.DateTimeField(null=True, blank=True, db_column='DOA')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    city_id = models.IntegerField(default=0, db_column='CityCode')
    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    extension_no = models.CharField(max_length=50, null=True, blank=True, db_column='ExtensionNo')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    relation_code = models.IntegerField(default=0, db_column='Relationcode')
    religion_code = models.IntegerField(default=0, db_column='ReligionCode')

    class Meta:
        app_label = 'textile'
        db_table = 'ContactDetailsMas'
        managed = False


class TailorChargeMas(models.Model):
    tailor_id = models.IntegerField(db_column='TailorCode')
    entry_order_id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    charge_head_id = models.IntegerField(db_column='ChargeHeadCode')
    charge = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column='Charge')

    class Meta:
        app_label = 'textile'
        db_table = 'TailorChargeMas'
        managed = False


class TailorConsumptionMas(models.Model):
    tailor_id = models.IntegerField(db_column='TailorCode')
    entry_order_id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    product_id = models.IntegerField(default=0, db_column='ProductCode')
    item_id = models.IntegerField(default=0, db_column='ItemCode')
    design_no = models.CharField(max_length=50, null=True, blank=True, db_column='Designno')
    cons_pcs = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column='ConsPcs')
    item_category_1 = models.IntegerField(default=0, db_column='ItemCategoryCode1')
    item_category_2 = models.IntegerField(default=0, db_column='ItemCategoryCode2')
    item_category_3 = models.IntegerField(default=0, db_column='ItemCategoryCode3')
    item_category_4 = models.IntegerField(default=0, db_column='ItemCategoryCode4')
    item_category_5 = models.IntegerField(default=0, db_column='ItemCategoryCode5')
    item_category_6 = models.IntegerField(default=0, db_column='ItemCategoryCode6')
    item_category_7 = models.IntegerField(default=0, db_column='ItemCategoryCode7')
    item_category_8 = models.IntegerField(default=0, db_column='ItemCategoryCode8')
    item_category_9 = models.IntegerField(default=0, db_column='ItemCategoryCode9')
    item_category_10 = models.IntegerField(default=0, db_column='ItemCategoryCode10')

    class Meta:
        app_label = 'textile'
        db_table = 'TailorConsumptionMas'
        managed = False


class SupplierChargeMas(models.Model):
    supplier_id = models.IntegerField(db_column='SupplierCode')
    entry_order_id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    charge_head_id = models.IntegerField(default=0, db_column='ChargeHeadCode')
    charge = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column='Charge')

    class Meta:
        app_label = 'textile'
        db_table = 'SupplierChargeMas'
        managed = False


class SupplierConsumptionMas(models.Model):
    supplier_id = models.IntegerField(db_column='SupplierCode')
    entry_order_id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    product_id = models.IntegerField(default=0, db_column='ProductCode')
    item_id = models.IntegerField(default=0, db_column='ItemCode')
    design_no = models.CharField(max_length=50, null=True, blank=True, db_column='Designno')
    cons_pcs = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column='ConsPcs')
    item_category_1 = models.IntegerField(default=0, db_column='ItemCategoryCode1')
    item_category_2 = models.IntegerField(default=0, db_column='ItemCategoryCode2')
    item_category_3 = models.IntegerField(default=0, db_column='ItemCategoryCode3')
    item_category_4 = models.IntegerField(default=0, db_column='ItemCategoryCode4')
    item_category_5 = models.IntegerField(default=0, db_column='ItemCategoryCode5')
    item_category_6 = models.IntegerField(default=0, db_column='ItemCategoryCode6')
    item_category_7 = models.IntegerField(default=0, db_column='ItemCategoryCode7')
    item_category_8 = models.IntegerField(default=0, db_column='ItemCategoryCode8')
    item_category_9 = models.IntegerField(default=0, db_column='ItemCategoryCode9')
    item_category_10 = models.IntegerField(default=0, db_column='ItemCategoryCode10')

    class Meta:
        app_label = 'textile'
        db_table = 'SupplierConsumptionMas'
        managed = False
