# textile/models/master/general.py
from django.db import models


class CountryMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'CountryMas'

    def __str__(self):
        return self.name


class StateMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    country_id = models.IntegerField(null=True, blank=True, db_column='CountryCode', default=0)
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "StateMas"

    def __str__(self):
        return self.name


class CityMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    state_id = models.IntegerField(null=True, blank=True, db_column='StateCode', default=0)
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "CityMas"

    def __str__(self):
        return self.name


class TitleMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "TitleMas"

    def __str__(self):
        return self.name


class GradeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "GradeMas"

    def __str__(self):
        return self.name


class GroupMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "GroupMas"

    def __str__(self):
        return self.name


class CategoryMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "CategoryMas"

    def __str__(self):
        return self.name


class RelationMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "RelationMas"

    def __str__(self):
        return self.name


class ReligionMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "ReligionMas"

    def __str__(self):
        return self.name


class OccupationMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "OccupationMas"

    def __str__(self):
        return self.name


class BankMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='Shortname')
    cardservicecharge = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='CardServiceCharge')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    altered_at = models.DateTimeField(null=True, blank=True, db_column='AlterdDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "BankMas"

    def __str__(self):
        return self.name


class TaxTypeMas(models.Model):
    TAX_TYPE = "TAX TYPE"
    ADD_LESS = "ADD / LESS"

    ENTRY_TYPE_CHOICES = [
        (TAX_TYPE, "TAX TYPE"),
        (ADD_LESS, "ADD / LESS"),
    ]

    id = models.AutoField(primary_key=True, db_column='Code')
    entry_type = models.CharField(
        max_length=10,
        choices=ENTRY_TYPE_CHOICES,
        null=True,
        blank=True,
        db_column='EntryType'
    )
    name = models.CharField(max_length=50, db_column='Name')
    short_name = models.CharField(max_length=25, db_column='ShortName')
    tax_percent = models.DecimalField(max_digits=10, decimal_places=5, default=0.00000, db_column='TaxPercent')
    tax_on = models.PositiveSmallIntegerField(null=True, blank=True, default=0, db_column='TaxOn')
    include = models.BooleanField(default=False, db_column='Include')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    is_discount = models.BooleanField(default=False, db_column='isDiscount')
    allow_sales = models.BooleanField(default=False, db_column='AllowSales')
    allow_purchase = models.BooleanField(default=False, db_column='AllowPurchase')
    acc_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccHeadName')
    account_post = models.BooleanField(default=False, db_column='AccountPost')

    account_head_id = models.IntegerField(null=True, blank=True, default=0, db_column='AccountHeadCode')
    account_sales_head_id = models.IntegerField(null=True, blank=True, default=0, db_column='AccountSalesHeadCode')
    ss_pur_acc_head_id = models.IntegerField(null=True, blank=True, default=0, db_column='SSPurAccHeadCode')
    ss_sal_acc_head_id = models.IntegerField(null=True, blank=True, default=0, db_column='SSSalAccHeadCode')

    tax_amt_cal_type = models.PositiveSmallIntegerField(null=True, blank=True, default=1, db_column='TaxAmtCalType')
    allow_tax_amt_cal = models.BooleanField(default=False, db_column='AllowTaxAmtCal')
    commodity_code = models.CharField(max_length=15, null=True, blank=True, default='', db_column='CommodityCode')
    section = models.CharField(max_length=15, null=True, blank=True, default='', db_column='Section')
    local_category = models.CharField(max_length=15, null=True, blank=True, default='', db_column='LocalCategory')
    other_category = models.CharField(max_length=15, null=True, blank=True, default='', db_column='OtherCategory')
    import_category = models.CharField(max_length=15, null=True, blank=True, default='', db_column='ImportCategory')
    category = models.CharField(max_length=15, null=True, blank=True, default='', db_column='Category')

    class Meta:
        app_label = 'textile'
        db_table = "TaxTypeMas"

    def __str__(self):
        return f"{self.name} ({self.tax_percent}%)"


class SystemMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    floor_id = models.IntegerField(default=0, db_column='FloorCode')
    name = models.CharField(max_length=50, db_column='Name')
    short_name = models.CharField(max_length=25, db_column='ShortName')
    mac_id = models.CharField(max_length=50, null=True, blank=True, db_column='MACID')
    print_function_code = models.IntegerField(default=0, db_column='PrintFunctionCode')
    group_bill_prefix = models.CharField(max_length=10, null=True, blank=True, db_column='GroupBillPrefix')
    seperator = models.CharField(max_length=5, default='/', null=True, blank=True, db_column='Seperator')
    no_length = models.PositiveSmallIntegerField(default=6, db_column='NoLength')
    last_no = models.IntegerField(default=0, db_column='LastNo')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    return_system = models.PositiveSmallIntegerField(default=0, db_column='ReturnSystem')
    settlement_print_function_code = models.IntegerField(default=0, db_column='SettlementPrintFunctionCode')
    sys_ref_no = models.CharField(max_length=50, null=True, blank=True, db_column='SysRefNo')
    allow_scheme = models.BooleanField(default=False, db_column='AllowScheme')
    printer_port_code = models.IntegerField(default=0, db_column='PRINTERPORTCODE')

    class Meta:
        app_label = 'textile'
        db_table = 'SystemMas'
        managed = False

    def __str__(self):
        return self.name


class CounterMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    name = models.CharField(max_length=50, db_column='Name')
    short_name = models.CharField(max_length=25, db_column='ShortName')
    counter_group_id = models.IntegerField(default=0, db_column='CounterGroupCode')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    section_code = models.IntegerField(default=0, db_column='SectionCode')
    counter_order = models.IntegerField(default=0, db_column='CounterOrder')

    class Meta:
        app_label = 'textile'
        db_table = "CounterMas"
        managed = False

    def __str__(self):
        return self.name


class SystemCounterMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    counter_id = models.IntegerField(default=0, db_column='CounterCode')
    counter_type = models.CharField(max_length=25, db_column='CounterType')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='UserEntryDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'SystemCounterMas'
        managed = False

    def __str__(self):
        return f"Counter {self.counter_id} ({self.counter_type})"


# Alias for backward compatibility
SystemCounterIntegrationMas = SystemCounterMas


class SystemCounterDet(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    counter_id = models.IntegerField(default=0, db_column='CounterCode')
    system_id = models.IntegerField(default=0, db_column='SystemCode')
    counter_type = models.CharField(max_length=15, db_column='CounterType')

    class Meta:
        app_label = 'textile'
        db_table = 'SystemCounterDet'
        managed = False

    def __str__(self):
        return f"Counter {self.counter_id} System {self.system_id} ({self.counter_type})"


class CounterGroupMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "CounterGroupMas"
        managed = False

    def __str__(self):
        return self.name


class PrintFunctionMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    short_name = models.CharField(max_length=50, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    cashier_print = models.BooleanField(default=False, db_column='CashierPrint')

    class Meta:
        app_label = 'textile'
        db_table = "PrintFunctionMas"
        managed = False

    def __str__(self):
        return self.name


class IncomeAndExpenseMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='Shortname')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    head_type = models.BooleanField(default=False, db_column='HeadType')  # Advance Checkbox
    account_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccountHeadName')
    account_post = models.BooleanField(default=False, db_column='AccountPost')
    account_head_code = models.IntegerField(default=0, db_column='AccountHeadCode')

    class Meta:
        app_label = 'textile'
        db_table = "IncomeAndExpenseMas"
        managed = False

    def __str__(self):
        return self.name


class GiftvoucherMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "GiftvoucherMas"

    def __str__(self):
        return self.name


class PaymentModeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "PaymentModeMas"

    def __str__(self):
        return self.name


class DiscountTypeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    discper = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='DiscPer')

    class Meta:
        app_label = 'textile'
        db_table = "DiscountTypeMas"

    def __str__(self):
        return self.name


class DepartmentMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    name = models.CharField(max_length=50, null=True, blank=True, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='Shortname')
    perdaycommission = models.DecimalField(
        max_digits=18,
        decimal_places=5,
        default=0.00000,
        db_column='PerDayCommission'
    )
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "DepartmentMas"

    def __str__(self):
        return self.name or f"Department {self.id}"


class FloorMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    location_id = models.IntegerField(null=True, blank=True, db_column='LocationCode', default=0)
    name = models.CharField(max_length=50, null=True, blank=True, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='Shortname')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "FloorMas"

    def __str__(self):
        return self.name or f"Floor {self.id}"


class TransferModeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='ShortName')
    numgeneration = models.BooleanField(default=False, db_column='NumGeneration')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "TransferModeMas"

    def __str__(self):
        return self.name


class StarMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    starname = models.CharField(max_length=10, unique=True, db_column='Starname')
    starvalue = models.DecimalField(max_digits=9, decimal_places=2, db_column='Starvalue')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID', default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "StarMas"

    def __str__(self):
        return self.starname


class EmployeeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')

    location_code = models.IntegerField(default=0, db_column='LocationCode')
    title_code = models.IntegerField(default=0, db_column='TitleCode')
    name = models.CharField(max_length=50, db_column='Name')
    short_name = models.CharField(max_length=25, default="", db_column='ShortName')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    city_code = models.IntegerField(default=0, db_column='CityCode')
    pincode = models.CharField(max_length=50, null=True, blank=True, db_column='Pincode')

    dob = models.DateTimeField(null=True, blank=True, db_column='DOB')
    doj = models.DateTimeField(null=True, blank=True, db_column='DOJ')
    dol = models.DateTimeField(null=True, blank=True, db_column='DOL')

    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    website = models.CharField(max_length=50, null=True, blank=True, db_column='Website')
    panno = models.CharField(max_length=50, null=True, blank=True, db_column='Panno')

    commission_allowed = models.BooleanField(default=False, db_column='CommissionAllowed')
    commission_percent = models.DecimalField(
        max_digits=10, decimal_places=5, default=0, db_column='CommissionPercent'
    )

    salesman_incentive = models.BooleanField(default=False, db_column='SalesManIncentive')
    incentive_qty_based = models.BooleanField(default=False, db_column='IncentiveQtyBased')
    incentive_percentage = models.DecimalField(
        max_digits=10, decimal_places=5, default=0, db_column='IncentivePercentage'
    )
    incentive_amount = models.DecimalField(
        max_digits=18, decimal_places=5, default=0, db_column='IncentiveAmount'
    )

    login_user = models.BooleanField(default=False, db_column='LoginUser')
    user_group_code = models.IntegerField(null=True, blank=True, db_column='UserGroupCode')
    password = models.CharField(max_length=50, null=True, blank=True, db_column='Password')

    editing_no_of_days = models.IntegerField(default=0, db_column='EditingNoofDays')
    profit_from_cost = models.BooleanField(default=False, db_column='ProfitFromCost')

    access_time_from = models.DateTimeField(null=True, blank=True, db_column='AccessTimeFrom')
    access_time_to = models.DateTimeField(null=True, blank=True, db_column='AccessTimeTo')

    system_restrict = models.BooleanField(default=False, db_column='SystemRestrict')
    sales_less_cost_in_pur = models.BooleanField(default=False, db_column='SalesLessCostInPur')
    sales_less_cost_in_sales = models.BooleanField(default=False, db_column='SalesLessCostInSales')
    old_bill_cancel = models.BooleanField(default=False, db_column='OldBillCancel')

    default_page = models.CharField(max_length=50, null=True, blank=True, db_column='DefaultPage')
    desc_edit = models.BooleanField(default=False, db_column='DescEdit')
    change_emp_rights = models.BooleanField(default=False, db_column='ChangeEmpRights')

    allow_sales_discount = models.BooleanField(default=False, db_column='AllowSalesDiscount')
    active = models.BooleanField(default=True, db_column='Active')
    skin_name = models.CharField(max_length=25, default="Default", db_column='SkinName')

    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    department_code = models.IntegerField(default=0, db_column='DepartmentCode')
    allow_change_location = models.BooleanField(default=False, db_column='AllowChangeLocation')
    allow_view_actual_sales = models.BooleanField(default=False, db_column='AllowViewActualSales')
    floor_code = models.IntegerField(default=0, db_column='FloorCode')
    allow_lock_date = models.BooleanField(default=False, db_column='AllowLockDate')
    stock_verification = models.BooleanField(default=False, db_column='StockVerification')
    report_column_change = models.BooleanField(default=False, db_column='ReportColumnChange')

    day_based_incentive = models.BooleanField(default=False, db_column='DayBasedIncentive')
    day_based_incentive_amount = models.DecimalField(
        max_digits=18, decimal_places=5, default=0, db_column='DayBasedIncentiveAmount'
    )

    allow_all_user = models.BooleanField(default=False, db_column='AllowAllUser')
    print_name = models.CharField(max_length=50, null=True, blank=True, db_column='PrintName')

    max_advance = models.DecimalField(
        max_digits=12, decimal_places=5, default=0, db_column='MaxAdvance'
    )

    allow_view_cost = models.BooleanField(default=False, db_column='AllowViewCost')
    is_admin = models.BooleanField(default=False, db_column='ISADMIN')
    approved = models.BooleanField(default=False, db_column='Approved')

    allow_multi_systems = models.BooleanField(default=False, db_column='AllowMultiSystems')
    no_of_systems = models.IntegerField(default=1, db_column='NoofSystems')

    display_company_form = models.BooleanField(default=False, db_column='DisplayCompanyForm')
    target_amount = models.DecimalField(
        max_digits=18, decimal_places=5, default=0, db_column='TargetAmount'
    )

    class Meta:
        app_label = 'textile'
        db_table = "EmployeeMas"
        managed = False

    def __str__(self):
        return self.name


class UserGroup(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, null=True, blank=True, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='ShortName')
    active = models.BooleanField(default=True, db_column='Active')

    class Meta:
        app_label = 'textile'
        db_table = "UserGroup"
        managed = False

    def __str__(self):
        return self.name or f"UserGroup {self.id}"


class EmployeeIncentiveMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    employee_code = models.IntegerField(db_column='EmployeeCode')
    range_from = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column='RangeFrom')
    range_to = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column='RangeTo')
    incentive_percentage = models.DecimalField(max_digits=10, decimal_places=5, default=0, db_column='IncentivePercentage')
    incentive_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column='IncentiveAmount')

    class Meta:
        app_label = 'textile'
        db_table = "EmployeeIncentiveMas"
        managed = False

    def __str__(self):
        return f"Incentive Emp {self.employee_code} ({self.range_from} - {self.range_to})"

