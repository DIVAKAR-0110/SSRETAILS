from datetime import timezone

from django.db import models
from django.contrib.auth.hashers import make_password
from spacy import blank
from textile.secondmodels import *



class Administrator(models.Model):
    username = models.CharField(max_length=120, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    class Meta:
        db_table = "administrator"
        ordering = ["-created_at"]

    def __str__(self):
        return self.username


class CountryMas(models.Model):
    id = models.AutoField(primary_key=True)
    admin_id = models.IntegerField(null=True, blank=True)
    name=models.CharField(max_length=200,unique=True)
    shortname=models.CharField(max_length=20,unique=True)
    active=models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'CountryMas'

    def __str__(self):
        return self.name



class StateMas(models.Model):
    id = models.AutoField(primary_key=True)
    admin_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=200, unique=True)
    shortname = models.CharField(max_length=20, unique=True)
    country_id=models.IntegerField(null=True,blank=True)
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "StateMas"

    def __str__(self):
        return self.name


class CityMas(models.Model):
    id = models.AutoField(primary_key=True)
    admin_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=200, unique=True)
    shortname = models.CharField(max_length=20, unique=True)
    state_id = models.IntegerField(null=True, blank=True)
    country_id=models.IntegerField(null=True, blank=True)
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "CityMas"

    def __str__(self):
        return self.name



class TitleMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "TitleMas"

    def __str__(self):
        return self.name



class GradeMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "GradeMas"

    def __str__(self):
        return self.name


class GroupMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "GroupMas"

    def __str__(self):
        return self.name


class CategoryMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "CategoryMas"

    def __str__(self):
        return self.name


class RelationMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "RelationMas"

    def __str__(self):
        return self.name


class ReligionMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ReligionMas"

    def __str__(self):
        return self.name


class OccupationMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "OccupationMas"

    def __str__(self):
        return self.name


class BankMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    cardservicecharge = models.DecimalField(max_digits=18, decimal_places=3)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    altered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
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

    # IMPORTANT: use *_id to match existing DB columns
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
        db_table = 'SystemMas'

    def __str__(self):
        return self.name



class SystemCounterIntegrationMas(models.Model):
    id = models.AutoField(primary_key=True)
    counter_id = models.IntegerField(null=True,blank=True)
    system_id = models.CharField(max_length=25)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    location_id = models.IntegerField(null=True,blank=True)

    class Meta:
        db_table = 'SystemCounterIntegrationMas'

    def __str__(self):
        return f"{self.system_id} / {self.counter_id}"


class CounterMas(models.Model):
    id = models.AutoField(primary_key=True)
    location_id = models.IntegerField(null=True,blank=True)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    counter_group_id = models.IntegerField(null=True,blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    section_code = models.IntegerField(null=True,blank=True)
    counter_order = models.IntegerField(null=True,blank=True)

    class Meta:
        db_table = "CounterMas"

    def __str__(self):
        return self.name



class CounterGroupMas(models.Model):
    id = models.AutoField(primary_key=True)
    location_code = models.IntegerField(null=True,blank=True)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
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
        db_table = "IncomeAndExpenseMas"

    def __str__(self):
        return self.name

class GiftvoucherMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150,unique=True)
    shortname = models.CharField(max_length=35,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table = "GiftvoucherMas"

    def __str__(self):
        return self.name

class PaymentModeMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "PaymentModeMas"

    def __str__(self):
        return self.name


class DiscountTypeMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    active = models.BooleanField(default=True)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    discper = models.DecimalField(max_digits=18, decimal_places=2)

    class Meta:
        db_table = "DiscountTypeMas"

    def __str__(self):
        return self.name

class DepartmentMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    shortname = models.CharField(max_length=25, null=True, blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    perdaycommission = models.DecimalField(
        max_digits=18,
        decimal_places=5
    )

    class Meta:
        db_table = "DepartmentMas"

    def __str__(self):
        return self.name or f"Department {self.id}"


class FloorMas(models.Model):
    id = models.AutoField(primary_key=True)
    location_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    short_name = models.CharField(max_length=25, null=True, blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "FloorMas"

    def __str__(self):
        return self.name or f"Floor {self.id}"


class TransferModeMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    shortname = models.CharField(max_length=25, null=True, blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    numgeneration = models.BooleanField()

    class Meta:
        db_table = "TransferModeMas"

    def __str__(self):
        return self.name

class StarMas(models.Model):
    id = models.AutoField(primary_key=True)
    starname = models.CharField(max_length=10,unique=True)
    starvalue = models.DecimalField(max_digits=9, decimal_places=2)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "StarMas"

    def __str__(self):
        return self.starname


class LocationMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True)
    shortname = models.CharField(max_length=25,unique=True)
    address = models.CharField(max_length=400, blank=True, null=True)
    city_id = models.IntegerField(null=True,blank=True)
    phoneno = models.CharField(max_length=50, blank=True, null=True)
    mobile = models.CharField(max_length=50, blank=True, null=True)
    fax = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    website = models.CharField(max_length=50, blank=True, null=True)
    tinno = models.CharField(max_length=50, blank=True, null=True)
    tindate = models.DateTimeField(blank=True, null=True)
    areaid = models.CharField(max_length=50, blank=True, null=True)
    cstno = models.CharField(max_length=50, blank=True, null=True)
    cstdate = models.DateTimeField(blank=True, null=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    admin_id = models.IntegerField(null=True,blank=True)
    pinid = models.CharField(max_length=50, blank=True, null=True)
    servername = models.CharField(max_length=50, blank=True, null=True)
    serveruid = models.CharField(max_length=25, blank=True, null=True)
    dbname = models.CharField(max_length=50, blank=True, null=True)
    serverpwd = models.CharField(max_length=25, blank=True, null=True)
    servermode = models.CharField(max_length=25, blank=True, null=True)
    protocol = models.CharField(max_length=25, blank=True, null=True)
    mainserver = models.BooleanField(default=False)
    accdbname = models.CharField(max_length=50, blank=True, null=True)
    ipaddress = models.CharField(max_length=25, blank=True, null=True)
    uploaddata = models.BooleanField(default=False)

    class Meta:
        db_table = "LocationMas"

    def __str__(self):
        return self.name



class GroupHeadMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    group_head_code = models.IntegerField(null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    type = models.CharField(max_length=1, null=True, blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "GroupHeadMas"

    def __str__(self):
        return self.name



class AccountHeadMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    head_type = models.IntegerField(null=True, blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at= models.DateTimeField(auto_now_add=True)
    group_head_id = models.IntegerField(null=True, blank=True)
    classification_name = models.CharField(max_length=50, null=True, blank=True)
    accessible_value = models.BooleanField(default=False)

    class Meta:
        db_table = "AccountHeadMas"

    def __str__(self):
        return self.name


class EmployeeMas(models.Model):
    id = models.AutoField(primary_key=True)

    location_code = models.IntegerField(default=0)
    title_code = models.IntegerField(default=0)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25, default="")
    address = models.CharField(max_length=400, null=True, blank=True)
    city_code = models.IntegerField(default=0)
    pincode = models.CharField(max_length=50, null=True, blank=True)

    dob = models.DateTimeField(null=True, blank=True)
    doj = models.DateTimeField(null=True, blank=True)
    dol = models.DateTimeField(null=True, blank=True)

    phoneno = models.CharField(max_length=50, null=True, blank=True)
    mobile = models.CharField(max_length=50, null=True, blank=True)
    fax = models.CharField(max_length=50, null=True, blank=True)
    email = models.CharField(max_length=50, null=True, blank=True)
    website = models.CharField(max_length=50, null=True, blank=True)
    panno = models.CharField(max_length=50, null=True, blank=True)

    commission_allowed = models.BooleanField(default=False)
    commission_percent = models.DecimalField(
        max_digits=10, decimal_places=5, default=0
    )

    salesman_incentive = models.BooleanField(default=False)
    incentive_qty_based = models.BooleanField(default=False)
    incentive_percentage = models.DecimalField(
        max_digits=10, decimal_places=5, default=0
    )
    incentive_amount = models.DecimalField(
        max_digits=18, decimal_places=5, default=0
    )

    login_user = models.BooleanField(default=False)
    user_group_code = models.IntegerField(null=True, blank=True)
    password = models.CharField(max_length=50, null=True, blank=True)

    editing_no_of_days = models.IntegerField(default=0)
    profit_from_cost = models.BooleanField(default=False)

    access_time_from = models.DateTimeField(null=True, blank=True)
    access_time_to = models.DateTimeField(null=True, blank=True)

    system_restrict = models.BooleanField(default=False)
    sales_less_cost_in_pur = models.BooleanField(default=False)
    sales_less_cost_in_sales = models.BooleanField(default=False)
    old_bill_cancel = models.BooleanField(default=False)

    default_page = models.CharField(max_length=50, null=True, blank=True)
    desc_edit = models.BooleanField(default=False)
    change_emp_rights = models.BooleanField(default=False)

    allow_sales_discount = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    skin_name = models.CharField(max_length=25, default="Default")

    admin_id = models.IntegerField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    department_code = models.IntegerField(default=0)
    allow_change_location = models.BooleanField(default=False)
    allow_view_actual_sales = models.BooleanField(default=False)
    floor_code = models.IntegerField(default=0)
    allow_lock_date = models.BooleanField(default=False)
    stock_verification = models.BooleanField(default=False)
    report_column_change = models.BooleanField(default=False)

    day_based_incentive = models.BooleanField(default=False)
    day_based_incentive_amount = models.DecimalField(
        max_digits=18, decimal_places=5, default=0
    )

    allow_all_user = models.BooleanField(default=False)
    print_name = models.CharField(max_length=50, null=True, blank=True)

    max_advance = models.DecimalField(
        max_digits=12, decimal_places=5, default=0
    )

    allow_view_cost = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    approved = models.BooleanField(default=False)

    allow_multi_systems = models.BooleanField(default=False)
    no_of_systems = models.IntegerField(default=1)

    display_company_form = models.BooleanField(default=False)
    target_amount = models.DecimalField(
        max_digits=18, decimal_places=5, default=0
    )

    class Meta:
        db_table = "EmployeeMas"
        managed = True

    def __str__(self):
        return self.name


