# textile/models/master/general.py
from django.db import models


class CountryMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    name = models.CharField(max_length=200, unique=True, db_column='Name')
    shortname = models.CharField(max_length=20, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'CountryMas'

    def __str__(self):
        return self.name


class StateMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    name = models.CharField(max_length=200, unique=True, db_column='Name')
    shortname = models.CharField(max_length=20, unique=True, db_column='ShortName')
    country_id = models.IntegerField(null=True, blank=True, db_column='CountryCode')
    active = models.BooleanField(default=False, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "StateMas"

    def __str__(self):
        return self.name


class CityMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    name = models.CharField(max_length=200, unique=True, db_column='Name')
    shortname = models.CharField(max_length=20, unique=True, db_column='ShortName')
    state_id = models.IntegerField(null=True, blank=True, db_column='StateCode')
    active = models.BooleanField(default=False, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "CityMas"

    def __str__(self):
        return self.name


class TitleMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "TitleMas"

    def __str__(self):
        return self.name


class GradeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=150, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "GradeMas"

    def __str__(self):
        return self.name


class GroupMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "GroupMas"

    def __str__(self):
        return self.name


class CategoryMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "CategoryMas"

    def __str__(self):
        return self.name


class RelationMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "RelationMas"

    def __str__(self):
        return self.name


class ReligionMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "ReligionMas"

    def __str__(self):
        return self.name


class OccupationMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(null=True, blank=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "OccupationMas"

    def __str__(self):
        return self.name


class BankMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='Shortname')
    cardservicecharge = models.DecimalField(max_digits=18, decimal_places=3, db_column='CardServiceCharge')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    altered_at = models.DateTimeField(auto_now_add=True, db_column='AlterdDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "BankMas"

    def __str__(self):
        return self.name


class TaxTypeMas(models.Model):
    TAX_TYPE = "TAX_TYPE"
    ADD_LESS = "ADD_LESS"

    ENTRY_TYPE_CHOICES = [
        (TAX_TYPE, "Tax Type"),
        (ADD_LESS, "ADD/LESS"),
    ]

    id = models.AutoField(primary_key=True)
    entry_type = models.CharField(
        max_length=10,
        choices=ENTRY_TYPE_CHOICES,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    tax_percent = models.DecimalField(max_digits=10, decimal_places=5)
    tax_on = models.PositiveSmallIntegerField(null=True, blank=True)
    include = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    admin_id = models.IntegerField(null=True, blank=True)
    is_discount = models.BooleanField(default=False)
    allow_sales = models.BooleanField(default=False)
    allow_purchase = models.BooleanField(default=False)
    acc_head_name = models.CharField(max_length=100, null=True, blank=True)
    account_post = models.BooleanField(default=False)

    account_head_id = models.IntegerField(null=True, blank=True)
    account_sales_head_id = models.IntegerField(null=True, blank=True)
    ss_pur_acc_head_id = models.IntegerField(null=True, blank=True)
    ss_sal_acc_head_id = models.IntegerField(null=True, blank=True)

    tax_amt_cal_type = models.PositiveSmallIntegerField(null=True, blank=True)
    allow_tax_amt_cal = models.BooleanField(default=False)
    commodity_code = models.CharField(max_length=15, null=True, blank=True)
    section = models.CharField(max_length=15, null=True, blank=True)
    local_category = models.CharField(max_length=15, null=True, blank=True)
    other_category = models.CharField(max_length=15, null=True, blank=True)
    import_category = models.CharField(max_length=15, null=True, blank=True)
    category = models.CharField(max_length=15, null=True, blank=True)

    class Meta:
        app_label = 'textile'
        db_table = "TaxTypeMas"

    def __str__(self):
        return f"{self.name} ({self.tax_percent}%)"


class SystemMas(models.Model):
    id = models.AutoField(primary_key=True)
    location_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    mac_id = models.CharField(max_length=50, null=True, blank=True)
    print_function_code = models.IntegerField(null=True, blank=True)
    group_bill_prefix = models.CharField(max_length=10, null=True, blank=True)
    seperator = models.CharField(max_length=35, null=True, blank=True)
    no_length = models.PositiveSmallIntegerField(null=True, blank=True)
    last_no = models.IntegerField(null=True, blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    floor_code = models.IntegerField(null=True, blank=True)
    return_system = models.PositiveSmallIntegerField(null=True, blank=True)
    settlement_print_function_code = models.IntegerField(null=True, blank=True)
    sys_ref_no = models.CharField(max_length=50, null=True, blank=True)
    allow_scheme = models.BooleanField(default=False)
    printer_port_code = models.IntegerField(null=True, blank=True)

    class Meta:
        app_label = 'textile'
        db_table = 'SystemMas'

    def __str__(self):
        return self.name


class SystemCounterIntegrationMas(models.Model):
    id = models.AutoField(primary_key=True)
    counter_id = models.IntegerField(null=True, blank=True)
    system_id = models.CharField(max_length=25)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    location_id = models.IntegerField(null=True, blank=True)

    class Meta:
        app_label = 'textile'
        db_table = 'SystemCounterIntegrationMas'

    def __str__(self):
        return f"{self.system_id} / {self.counter_id}"


class CounterMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    location_id = models.IntegerField(null=True, blank=True, db_column='LocationCode')
    name = models.CharField(max_length=50, db_column='Name')
    short_name = models.CharField(max_length=25, db_column='ShortName')
    counter_group_id = models.IntegerField(null=True, blank=True, db_column='CounterGroupCode')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    section_code = models.IntegerField(null=True, blank=True, db_column='SectionCode')
    counter_order = models.IntegerField(null=True, blank=True, db_column='CounterOrder')

    class Meta:
        app_label = 'textile'
        db_table = "CounterMas"

    def __str__(self):
        return self.name


class CounterGroupMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    location_code = models.IntegerField(null=True, blank=True, db_column='LocationCode')
    name = models.CharField(max_length=50, db_column='Name')
    short_name = models.CharField(max_length=25, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "CounterGroupMas"

    def __str__(self):
        return self.name


class IncomeAndExpenseMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    head_type = models.BooleanField(default=False)
    account_head_name = models.CharField(max_length=100, null=True, blank=True)
    account_post = models.BooleanField(default=False)
    account_head_code = models.IntegerField(null=True, blank=True)

    class Meta:
        app_label = 'textile'
        db_table = "IncomeAndExpenseMas"

    def __str__(self):
        return self.name


class GiftvoucherMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=150, unique=True, db_column='Name')
    shortname = models.CharField(max_length=35, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
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
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
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
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    discper = models.DecimalField(max_digits=18, decimal_places=2, db_column='DiscPer')

    class Meta:
        app_label = 'textile'
        db_table = "DiscountTypeMas"

    def __str__(self):
        return self.name


class DepartmentMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, null=True, blank=True, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='Shortname')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    perdaycommission = models.DecimalField(
        max_digits=18,
        decimal_places=5,
        db_column='PerDayCommission'
    )

    class Meta:
        app_label = 'textile'
        db_table = "DepartmentMas"

    def __str__(self):
        return self.name or f"Department {self.id}"


class FloorMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    location_id = models.IntegerField(null=True, blank=True, db_column='LocationCode')
    name = models.CharField(max_length=50, null=True, blank=True, db_column='Name')
    short_name = models.CharField(max_length=25, null=True, blank=True, db_column='Shortname')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "FloorMas"

    def __str__(self):
        return self.name or f"Floor {self.id}"


class TransferModeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=150, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    numgeneration = models.BooleanField(db_column='NumGeneration')

    class Meta:
        app_label = 'textile'
        db_table = "TransferModeMas"

    def __str__(self):
        return self.name


class StarMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    starname = models.CharField(max_length=10, unique=True, db_column='Starname')
    starvalue = models.DecimalField(max_digits=9, decimal_places=2, db_column='Starvalue')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
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
        managed = True

    def __str__(self):
        return self.name

