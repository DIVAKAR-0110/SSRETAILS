# textile/models/master/intractors.py
from django.db import models


class SupplierMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    title_id = models.IntegerField(default=0, db_column='TitleCode')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    print_name = models.CharField(max_length=50, null=True, blank=True, db_column='PrintName')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    city_id = models.IntegerField(default=0, db_column='CityCode')
    pincode = models.CharField(max_length=50, null=True, blank=True, db_column='Pincode')
    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    website = models.CharField(max_length=50, null=True, blank=True, db_column='Website')
    cst_no = models.CharField(max_length=50, null=True, blank=True, db_column='CstNo')
    cst_date = models.DateTimeField(null=True, blank=True, db_column='CstDate')
    tin_no = models.CharField(max_length=50, null=True, blank=True, db_column='TinNo')
    tin_date = models.DateTimeField(null=True, blank=True, db_column='TinDate')
    pan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Panno')
    tan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Tanno')
    credit_days = models.IntegerField(default=0, db_column='CreditDays')
    credit_limit = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='CreditLimit')
    standard_discount_on_bill = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='StandardDiscountOnBill')
    agent_id = models.IntegerField(default=0, db_column='AgentCode')
    agent_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='AgentCommission')
    cash_discount_days = models.IntegerField(default=0, db_column='CashDiscountDays')
    cash_discount_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='CashDiscountPercent')
    debit_dd_commission = models.BooleanField(default=False, db_column='DebitDDCommission')
    dd_commission_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='DDCommissionPercent')
    profit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='Profit')
    interest_on_delay = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='InterestonDelay')
    interest_on_early = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='InterestonEarly')
    category_id = models.IntegerField(default=0, db_column='CategoryCode')
    group_id = models.IntegerField(default=0, db_column='GroupCode')
    grade_id = models.IntegerField(default=0, db_column='GradeCode')
    company_depend = models.BooleanField(default=False, db_column='CompanyDepend')
    ecs_transfer = models.BooleanField(default=False, db_column='ECSTransfer')
    bank_id = models.IntegerField(default=0, db_column='BankCode')
    branch = models.CharField(max_length=50, null=True, blank=True, db_column='Branch')
    account_no = models.CharField(max_length=50, null=True, blank=True, db_column='AccountNo')
    ifpn_no = models.CharField(max_length=50, null=True, blank=True, db_column='IFPNNo')
    micr_code = models.CharField(max_length=50, null=True, blank=True, db_column='MICRCode')
    cheque_name = models.CharField(max_length=50, null=True, blank=True, db_column='ChequeName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    area_code = models.CharField(max_length=50, null=True, blank=True, db_column='AreaCode')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    acc_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccHeadName')
    representative_id = models.IntegerField(default=0, db_column='RepresendativeCode')
    due_days = models.IntegerField(default=0, db_column='DUEDAYS')
    account_head_id = models.IntegerField(default=0, db_column='AccountHeadCode')
    ss_acc_head_id = models.IntegerField(default=0, db_column='SSAccHeadCode')
    gst_no = models.CharField(max_length=50, null=True, blank=True, db_column='GSTNO')
    bill_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='BillDiscount')
    manual_cash_disc_per = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='ManualCashDiscPer')
    manual_cash_days = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='ManualCashDays')

    class Meta:
        app_label = 'textile'
        db_table = 'SupplierMas'
        managed = False

    def __str__(self):
        return self.name


class SupplierCompanyMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    supplier_id = models.IntegerField(db_column='SupplierCode')
    company_id = models.IntegerField(db_column='CompanyCode')
    opening_balance = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='OpeningBalance')

    class Meta:
        app_label = 'textile'
        db_table = 'SupplierCompanyMas'
        managed = False

    def __str__(self):
        return f"Supplier {self.supplier_id} Company {self.company_id}"


class SupplierItemTypeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    supplier_id = models.IntegerField(db_column='SupplierCode')
    item_type_id = models.IntegerField(db_column='ItemTypeCode')

    class Meta:
        app_label = 'textile'
        db_table = 'SupplierItemTypeMas'
        managed = False

    def __str__(self):
        return f"Supplier {self.supplier_id} ItemType {self.item_type_id}"


class AgentMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    commission_percent = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='CommissionPercent')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    city_id = models.IntegerField(default=0, db_column='CityCode')
    pincode = models.CharField(max_length=50, null=True, blank=True, db_column='Pincode')
    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    website = models.CharField(max_length=50, null=True, blank=True, db_column='Website')
    tin_no = models.CharField(max_length=50, null=True, blank=True, db_column='Tinno')
    tin_date = models.DateTimeField(null=True, blank=True, db_column='TinDate')
    area_code = models.CharField(max_length=50, null=True, blank=True, db_column='AreaCode')
    cst_no = models.CharField(max_length=50, null=True, blank=True, db_column='CstNo')
    cst_date = models.DateTimeField(null=True, blank=True, db_column='CstDate')
    tan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Tanno')
    pan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Panno')
    service_tax_no = models.CharField(max_length=50, null=True, blank=True, db_column='ServiceTaxno')
    ecs_transfer = models.BooleanField(default=False, db_column='ECSTransfer')
    bank_id = models.IntegerField(default=0, db_column='BankCode')
    branch = models.CharField(max_length=50, null=True, blank=True, db_column='Branch')
    account_no = models.CharField(max_length=50, null=True, blank=True, db_column='AccountNo')
    ifpn_no = models.CharField(max_length=50, null=True, blank=True, db_column='IFPNNo')
    micr_code = models.CharField(max_length=50, null=True, blank=True, db_column='MICRCode')
    cheque_name = models.CharField(max_length=50, null=True, blank=True, db_column='ChequeName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    acc_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccHeadName')
    sales = models.BooleanField(default=False, db_column='Sales')
    account_head_id = models.IntegerField(default=0, db_column='AccountHeadCode')

    class Meta:
        app_label = 'textile'
        db_table = 'AgentMas'
        managed = False

    def __str__(self):
        return self.name


class AgentCompanyMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    agent_id = models.IntegerField(db_column='AgentCode')
    company_id = models.IntegerField(db_column='CompanyCode')
    opening_balance = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='OpeningBalance')

    class Meta:
        app_label = 'textile'
        db_table = 'AgentCompanyMas'
        managed = False

    def __str__(self):
        return f"Agent {self.agent_id} Company {self.company_id}"


class ManufactureMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    city_id = models.IntegerField(default=0, db_column='CityCode')
    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    website = models.CharField(max_length=50, null=True, blank=True, db_column='WebSite')
    tin_no = models.CharField(max_length=50, null=True, blank=True, db_column='TinNo')
    tin_date = models.DateTimeField(null=True, blank=True, db_column='TinDate')
    area_code = models.CharField(max_length=50, null=True, blank=True, db_column='AreaCode')
    cst_no = models.CharField(max_length=50, null=True, blank=True, db_column='CstNo')
    cst_date = models.DateTimeField(null=True, blank=True, db_column='CstDate')
    pincode = models.CharField(max_length=50, null=True, blank=True, db_column='Pincode')
    tan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Tanno')
    pan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Panno')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    acc_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccHeadName')
    account_head_id = models.IntegerField(default=0, db_column='AccountHeadCode')

    class Meta:
        app_label = 'textile'
        db_table = 'ManufactureMas'
        managed = False

    def __str__(self):
        return self.name


class CustomerMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    title_id = models.IntegerField(default=0, db_column='TitleCode')
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
    cst_no = models.CharField(max_length=50, null=True, blank=True, db_column='CstNo')
    cst_date = models.DateTimeField(null=True, blank=True, db_column='CstDate')
    tin_no = models.CharField(max_length=50, null=True, blank=True, db_column='TinNo')
    tin_date = models.DateTimeField(null=True, blank=True, db_column='TinDate')
    pan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Panno')
    tan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Tanno')
    discount_percent = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='DiscountPercent')
    loyalty_card_no = models.CharField(max_length=50, null=True, blank=True, db_column='LoyaltyCardNo')
    credit_allowed = models.BooleanField(default=False, db_column='CreditAllowed')
    cr_limit = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='CrLimit')
    is_company = models.BooleanField(default=False, db_column='IsCompany')
    due_days = models.IntegerField(default=0, db_column='DueDays')
    dob = models.DateTimeField(null=True, blank=True, db_column='DOB')
    doa = models.DateTimeField(null=True, blank=True, db_column='DOA')
    occupation_id = models.IntegerField(default=0, db_column='OccupationCode')
    religion_id = models.IntegerField(default=0, db_column='ReligionCode')
    allow_promotion_mailers = models.BooleanField(default=False, db_column='AllowPromotionMailers')
    allow_promotion_sms = models.BooleanField(default=False, db_column='AllowPromotionSMS')
    allow_promotion_email = models.BooleanField(default=False, db_column='AllowPromotionEmail')
    category_id = models.IntegerField(default=0, db_column='CategoryCode')
    group_id = models.IntegerField(default=0, db_column='GroupCode')
    grade_id = models.IntegerField(default=0, db_column='GradeCode')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    area_code = models.CharField(max_length=50, null=True, blank=True, db_column='AreaCode')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    acc_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccHeadName')
    loyalty_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='LoyaltyAmount')
    avail_points = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='AVailPoints')
    account_head_id = models.IntegerField(default=0, db_column='AccountHeadCode')
    ss_acc_head_id = models.IntegerField(default=0, db_column='SSAccHeadCode')
    gst_no = models.CharField(max_length=50, null=True, blank=True, db_column='GSTNO')

    class Meta:
        app_label = 'textile'
        db_table = 'CustomerMas'
        managed = False

    def __str__(self):
        return self.name


class CustomerCompanyMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    customer_id = models.IntegerField(db_column='CustomerCode')
    company_id = models.IntegerField(db_column='CompanyCode')
    opening_balance = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='OpeningBalance')

    class Meta:
        app_label = 'textile'
        db_table = 'CustomerCompanyMas'
        managed = False

    def __str__(self):
        return f"Customer {self.customer_id} Company {self.company_id}"


class CourierMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    title_id = models.IntegerField(default=0, db_column='TitleCode')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    print_name = models.CharField(max_length=50, null=True, blank=True, db_column='PrintName')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    city_id = models.IntegerField(default=0, db_column='CityCode')
    pincode = models.CharField(max_length=50, null=True, blank=True, db_column='Pincode')
    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    website = models.CharField(max_length=50, null=True, blank=True, db_column='Website')
    pan_no = models.CharField(max_length=50, null=True, blank=True, db_column='PanNo')
    cst_no = models.CharField(max_length=50, null=True, blank=True, db_column='CstNo')
    cst_date = models.DateTimeField(null=True, blank=True, db_column='CstDate')
    tin_no = models.CharField(max_length=50, null=True, blank=True, db_column='TinNo')
    tin_date = models.DateTimeField(null=True, blank=True, db_column='TinDate')
    area_code = models.CharField(max_length=50, null=True, blank=True, db_column='AreaCode')
    tan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Tanno')
    charge_type = models.PositiveSmallIntegerField(default=0, db_column='ChargeType')
    pay_type = models.PositiveSmallIntegerField(default=0, db_column='PayType')
    service_tax_no = models.CharField(max_length=50, null=True, blank=True, db_column='ServiceTaxNo')
    discount_percent = models.DecimalField(max_digits=10, decimal_places=5, default=0.00000, db_column='DiscountPer')
    discount_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0.00000, db_column='Discount')
    ecs_transfer = models.BooleanField(default=False, db_column='ECSTransfer')
    bank_id = models.IntegerField(default=0, db_column='BankCode')
    branch = models.CharField(max_length=50, null=True, blank=True, db_column='Branch')
    account_no = models.CharField(max_length=50, null=True, blank=True, db_column='AccountNo')
    ifpn_no = models.CharField(max_length=50, null=True, blank=True, db_column='IFPNNo')
    micr_code = models.CharField(max_length=50, null=True, blank=True, db_column='MICRCode')
    cheque_name = models.CharField(max_length=50, null=True, blank=True, db_column='ChequeName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    acc_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccHeadName')
    account_head_id = models.IntegerField(default=0, db_column='AccountHeadCode')

    class Meta:
        app_label = 'textile'
        db_table = 'CourierMas'
        managed = False

    def __str__(self):
        return self.name


class TransportMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    title_id = models.IntegerField(default=0, db_column='TitleCode')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    print_name = models.CharField(max_length=50, null=True, blank=True, db_column='PrintName')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    city_id = models.IntegerField(default=0, db_column='CityCode')
    pincode = models.CharField(max_length=50, null=True, blank=True, db_column='Pincode')
    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    website = models.CharField(max_length=50, null=True, blank=True, db_column='Website')
    pan_no = models.CharField(max_length=50, null=True, blank=True, db_column='PanNo')
    cst_no = models.CharField(max_length=50, null=True, blank=True, db_column='CstNo')
    cst_date = models.DateTimeField(null=True, blank=True, db_column='CstDate')
    tin_no = models.CharField(max_length=50, null=True, blank=True, db_column='TinNo')
    tin_date = models.DateTimeField(null=True, blank=True, db_column='TinDate')
    area_code = models.CharField(max_length=50, null=True, blank=True, db_column='AreaCode')
    tan_no = models.CharField(max_length=50, null=True, blank=True, db_column='Tanno')
    charge_type = models.PositiveSmallIntegerField(default=0, db_column='ChargeType')
    pay_type = models.PositiveSmallIntegerField(default=0, db_column='PayType')
    service_tax_no = models.CharField(max_length=50, null=True, blank=True, db_column='ServiceTaxNo')
    discount_percent = models.DecimalField(max_digits=10, decimal_places=5, default=0.00000, db_column='DiscountPer')
    discount_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0.00000, db_column='Discount')
    ecs_transfer = models.BooleanField(default=False, db_column='ECSTransfer')
    bank_id = models.IntegerField(default=0, db_column='BankCode')
    branch = models.CharField(max_length=50, null=True, blank=True, db_column='Branch')
    account_no = models.CharField(max_length=50, null=True, blank=True, db_column='AccountNo')
    ifpn_no = models.CharField(max_length=50, null=True, blank=True, db_column='IFPNNo')
    micr_code = models.CharField(max_length=50, null=True, blank=True, db_column='MICRCode')
    cheque_name = models.CharField(max_length=50, null=True, blank=True, db_column='ChequeName')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    location_id = models.IntegerField(default=0, db_column='LocationCode')
    acc_head_name = models.CharField(max_length=100, null=True, blank=True, db_column='AccHeadName')
    account_head_id = models.IntegerField(default=0, db_column='AccountHeadCode')

    class Meta:
        app_label = 'textile'
        db_table = 'TransportMas'
        managed = False

    def __str__(self):
        return self.name


class TransportCompanyMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='EntryOrderID')
    transport_id = models.IntegerField(db_column='TransportCode')
    company_id = models.IntegerField(db_column='CompanyCode')
    opening_balance = models.DecimalField(max_digits=18, decimal_places=2, default=0.00, db_column='OpeningBalance')

    class Meta:
        app_label = 'textile'
        db_table = 'TransportCompanyMas'
        managed = False

    def __str__(self):
        return f"Transport {self.transport_id} Company {self.company_id}"
