# textile/models/master/item_definition.py
from django.db import models


class ItemCategoryBase(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class ItemCategoryMas1(ItemCategoryBase):
    allow_fixed_disc_amt = models.DecimalField(
        max_digits=18, decimal_places=2, default=0.00, db_column='AllowFixedDiscAmt'
    )

    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas1"


class ItemCategoryMas2(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas2"


class ItemCategoryMas3(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas3"


class ItemCategoryMas4(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas4"


class ItemCategoryMas5(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas5"


class ItemCategoryMas6(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas6"


class ItemCategoryMas7(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas7"


class ItemCategoryMas8(ItemCategoryBase):
    square_feet = models.DecimalField(
        max_digits=18, decimal_places=2, default=0.00, db_column='SquareFeet'
    )

    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas8"


class ItemCategoryMas9(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas9"


class ItemCategoryMas10(ItemCategoryBase):
    size_order = models.IntegerField(default=0, db_column='SizeOrder')

    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas10"


class ItemMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'ItemMas'
        managed = False

    def __str__(self):
        return self.name


class UomMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'UomMas'
        managed = False

    def __str__(self):
        return self.name


class ItemTypeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    allow_grocery_purchase = models.BooleanField(default=False, db_column='AllowGroceryPurchase')

    class Meta:
        app_label = 'textile'
        db_table = 'ItemTypeMas'
        managed = False

    def __str__(self):
        return self.name


class ProductMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    print_name = models.CharField(max_length=50, null=True, blank=True, db_column='PrintName')
    item_code = models.IntegerField(default=0, db_column='ItemCode')
    item_type_code = models.IntegerField(default=0, db_column='ItemTypeCode')
    multiple_size = models.BooleanField(default=False, db_column='MultipleSize')
    jump_ratio = models.IntegerField(default=0, db_column='JumpRatio')
    secondary_qty = models.BooleanField(default=False, db_column='SecondaryQty')
    barcode_type = models.CharField(max_length=25, default='Unique', db_column='BarcodeType')
    barcode_count = models.IntegerField(default=0, db_column='BarcodeCount')
    last_bit_length = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='LastBitLength')
    decimal_length_in_rate = models.IntegerField(default=2, db_column='DecimalLengthInRate')
    stock_maintain = models.BooleanField(default=True, db_column='StockMaintain')
    batch_no = models.BooleanField(default=False, db_column='Batchno')
    manufacture_details = models.BooleanField(default=False, db_column='ManufactureDetails')
    expiry_date = models.BooleanField(default=False, db_column='ExpiryDate')
    expiry_days = models.BigIntegerField(default=0, db_column='Expirydays')
    packing_date = models.BooleanField(default=False, db_column='PackingDate')
    allow_sales = models.BooleanField(default=True, db_column='AllowSales')
    allow_sales_rate_edit = models.BooleanField(default=False, db_column='AllowSalesRateEdit')
    round_off = models.BooleanField(default=False, db_column='RoundOff')
    round_off_type = models.IntegerField(default=0, db_column='RoundOffType')
    round_calc_type = models.IntegerField(default=0, db_column='RoundCalcType')
    rupee_or_paise = models.BooleanField(default=False, db_column='RupeeorPaise')
    round_rupee = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='RoundRupee')
    round_paise = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='RoundPaise')
    sales_disc_per = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='SalesDiscPer')
    add_sales_disc_per = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='AddSalesDiscPer')
    add_sales_disc_per_include = models.BooleanField(default=False, db_column='AddSalesDiscPerInclude')
    loyalty_card_disc = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='LoyaltyCardDisc')
    loyalty_card_disc_include = models.BooleanField(default=False, db_column='LoyaltyCardDiscInclude')
    allow_lock_sales_discount = models.IntegerField(default=0, db_column='AllowLockSalesDiscount')
    image_display = models.BooleanField(default=False, db_column='ImageDisplay')
    image_name = models.CharField(max_length=50, null=True, blank=True, db_column='ImageName')
    product_sale_rate = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='ProductSaleRate')
    fixed_or_variable_sal_rate = models.BooleanField(default=False, db_column='FixedOrVariableSalRate')
    repackable = models.BooleanField(default=False, db_column='RePackable')
    core_item = models.BooleanField(default=False, db_column='CoreItem')
    hsn_code = models.CharField(max_length=15, null=True, blank=True, db_column='HsnCode')
    star_item = models.CharField(max_length=10, null=True, blank=True, db_column='StarItem')
    salesman_incentive = models.BooleanField(default=False, db_column='SalesManIncentive')
    incentive_qty_based = models.BooleanField(default=False, db_column='IncentiveQtyBased')
    incentive_percentage = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='IncentivePercentage')
    incentive_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='IncentiveAmount')
    margin_setup_reqd = models.BooleanField(default=False, db_column='MarginSetupReqd')
    unit_conversion = models.BooleanField(default=False, db_column='UnitConversion')
    purchase_uom_code = models.IntegerField(default=0, db_column='PurchaseUomCode')
    sales_uom_code = models.IntegerField(default=0, db_column='SalesUomCode')
    base_uom_code = models.IntegerField(default=0, db_column='BaseUomCode')
    company_depend = models.BooleanField(default=False, db_column='CompanyDepend')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'ProductMas'
        managed = False

    def __str__(self):
        return self.name


class ProductCategoryValuesMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    product_code = models.IntegerField(db_column='ProductCode')
    item_category_code = models.IntegerField(db_column='ItemCategoryCode')
    item_category_value_code = models.IntegerField(db_column='ItemCategoryValueCode')
    is_default = models.BooleanField(default=False, db_column='isDefault')

    class Meta:
        app_label = 'textile'
        db_table = 'ProductCategoryValuesMas'
        managed = False

    def __str__(self):
        return f"Prod {self.product_code} - Cat {self.item_category_code} - Val {self.item_category_value_code}"


class CommodityCodeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'CommodityCodeMas'
        managed = False

    def __str__(self):
        return self.name


class ProductRolMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    product_code = models.IntegerField(default=0, db_column='ProductCode')
    location_code = models.IntegerField(default=0, db_column='LocationCode')
    supplier_code = models.IntegerField(default=0, db_column='SupplierCode')
    item_code = models.IntegerField(default=0, db_column='ItemCode')
    item_category1_code = models.IntegerField(default=0, db_column='ItemCategory1Code')
    item_category2_code = models.IntegerField(default=0, db_column='ItemCategory2Code')
    item_category3_code = models.IntegerField(default=0, db_column='ItemCategory3Code')
    item_category4_code = models.IntegerField(default=0, db_column='ItemCategory4Code')
    item_category5_code = models.IntegerField(default=0, db_column='ItemCategory5Code')
    item_category6_code = models.IntegerField(default=0, db_column='ItemCategory6Code')
    item_category7_code = models.IntegerField(default=0, db_column='ItemCategory7Code')
    item_category8_code = models.IntegerField(default=0, db_column='ItemCategory8Code')
    item_category9_code = models.IntegerField(default=0, db_column='ItemCategory9Code')
    item_category10_code = models.IntegerField(default=0, db_column='ItemCategory10Code')
    rate_from = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='RateFrom')
    rate_to = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='RateTo')
    min_stk = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='MinStk')
    max_stk = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='MaxStk')
    rol_qty = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='RolQty')

    class Meta:
        app_label = 'textile'
        db_table = 'ProductRolMas'
        managed = False

    def __str__(self):
        return f"ROL Product {self.product_code} Loc {self.location_code}"

