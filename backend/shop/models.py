from django.db import models
from django.contrib.auth.hashers import make_password
from django.db.models import CASCADE
from django.utils import timezone

class AdminLogin(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

class CountryMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'CountryMas'


class StateMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    CountryCode = models.ForeignKey(CountryMas, on_delete=models.CASCADE, db_column="CountryCode")
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'StateMas'


class CityMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    StateCode = models.ForeignKey(StateMas, on_delete=models.CASCADE, db_column="StateCode")
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'CityMas'


class TitleMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'TitleMas'


class GradeMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'GradeMas'


class GroupMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'GroupMas'



class CategoryMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'CategoryMas'



class RelationMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'RelationMas'



class ReligionMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'ReligionMas'



class OccupationMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'OccupationMas'



class BankMas(models.Model):
    Code = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    CardServiceCharge = models.DecimalField(max_digits=18, decimal_places=2)
    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)
    AlterdDateTime = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'BankMas'



class EmployeeMas(models.Model):
    Code = models.AutoField(primary_key=True)

    LocationCode = models.IntegerField()
    TitleCode = models.IntegerField()
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    Address = models.CharField(max_length=400, null=True, blank=True)
    CityCode = models.IntegerField()
    Pincode = models.CharField(max_length=50, null=True, blank=True)

    DOB = models.DateTimeField(null=True, blank=True)
    DOJ = models.DateTimeField(null=True, blank=True)
    DOL = models.DateTimeField(null=True, blank=True)

    Phoneno = models.CharField(max_length=50, null=True, blank=True)
    Mobile = models.CharField(max_length=50, null=True, blank=True)
    Fax = models.CharField(max_length=50, null=True, blank=True)
    Email = models.CharField(max_length=50, null=True, blank=True)
    Website = models.CharField(max_length=50, null=True, blank=True)
    Panno = models.CharField(max_length=50, null=True, blank=True)

    CommissionAllowed = models.BooleanField(default=False)
    CommissionPercent = models.DecimalField(max_digits=10, decimal_places=5, default=0)

    SalesManIncentive = models.BooleanField(null=True, blank=True)
    IncentiveQtyBased = models.BooleanField(null=True, blank=True)
    IncentivePercentage = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    IncentiveAmount = models.DecimalField(max_digits=18, decimal_places=5, null=True, blank=True)

    LoginUser = models.BooleanField(default=False)
    UserGroupCode = models.IntegerField(null=True, blank=True)
    Password = models.CharField(max_length=50, null=True, blank=True)

    EditingNoofDays = models.IntegerField(null=True, blank=True)
    ProfitFromCost = models.BooleanField(null=True, blank=True)

    AccessTimeFrom = models.DateTimeField(null=True, blank=True)
    AccessTimeTo = models.DateTimeField(null=True, blank=True)

    SystemRestrict = models.BooleanField(null=True, blank=True)
    SalesLessCostInPur = models.BooleanField(null=True, blank=True)
    SalesLessCostInSales = models.BooleanField(null=True, blank=True)
    OldBillCancel = models.BooleanField(null=True, blank=True)

    DefaultPage = models.CharField(max_length=50, null=True, blank=True)
    DescEdit = models.BooleanField(null=True, blank=True)
    ChangeEmpRights = models.BooleanField(null=True, blank=True)

    AllowSalesDiscount = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    SkinName = models.CharField(max_length=25)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    DepartmentCode = models.IntegerField()
    AllowChangeLocation = models.BooleanField(default=False)
    AllowViewActualSales = models.BooleanField(default=False)
    FloorCode = models.IntegerField()

    AllowLockDate = models.BooleanField(default=False)
    StockVerification = models.BooleanField(default=False)
    ReportColumnChange = models.BooleanField(default=False)
    DayBasedIncentive = models.BooleanField(default=False)

    DayBasedIncentiveAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    AllowAllUser = models.BooleanField(default=False)
    PrintName = models.CharField(max_length=50, null=True, blank=True)

    MaxAdvance = models.DecimalField(max_digits=12, decimal_places=5,default=0)
    AllowViewCost = models.BooleanField(default=False)
    ISADMIN = models.BooleanField(default=False)
    Approved = models.BooleanField(default=False)
    AllowMultiSystems = models.BooleanField(default=False)
    NoofSystems = models.IntegerField(null=True, blank=True)

    DisplayCompanyForm = models.BooleanField(default=False)
    TargetAmount = models.DecimalField(max_digits=18, decimal_places=5,default=0)

    class Meta:
        db_table = 'EmployeeMas'



class TaxTypeMas(models.Model):
    Code = models.AutoField(primary_key=True)

    EntryType = models.CharField(max_length=10, null=True, blank=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)

    TaxPercent = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    TaxOn = models.IntegerField(null=True, blank=True)

    Include = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    UserID = models.IntegerField(null=True, blank=True)
    isDiscount = models.BooleanField(default=False)
    AllowSales = models.BooleanField(default=False)
    AllowPurchase = models.BooleanField(default=False)

    AccHeadName = models.CharField(max_length=100, null=True, blank=True)
    AccountPost = models.BooleanField(default=False)

    AccountHeadCode = models.IntegerField(null=True, blank=True)
    AccountSalesHeadCode = models.IntegerField(null=True, blank=True)
    SSPurAccHeadCode = models.IntegerField(null=True, blank=True)
    SSSalAccHeadCode = models.IntegerField(null=True, blank=True)

    TaxAmtCalType = models.IntegerField(null=True, blank=True)  # tinyint
    AllowTaxAmtCal = models.BooleanField(default=False)

    CommodityCode = models.CharField(max_length=15, null=True, blank=True)
    Section = models.CharField(max_length=15, null=True, blank=True)
    LocalCategory = models.CharField(max_length=15, null=True, blank=True)
    OtherCategory = models.CharField(max_length=15, null=True, blank=True)
    ImportCategory = models.CharField(max_length=15, null=True, blank=True)
    Category = models.CharField(max_length=15, null=True, blank=True)

    class Meta:
        db_table = 'TaxTypeMas'



class SystemMas(models.Model):
    Code = models.AutoField(primary_key=True)  # IDENTITY(1,1)

    LocationCode = models.IntegerField(null=True, blank=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    MACID = models.CharField(max_length=50, null=True, blank=True)

    PrintFunctionCode = models.IntegerField(null=True, blank=True)

    GroupBillPrefix = models.CharField(max_length=10, null=True, blank=True)
    Seperator = models.CharField(max_length=5, null=True, blank=True)  # char(5)

    NoLength = models.IntegerField(null=True, blank=True)  # tinyint → IntegerField
    LastNo = models.IntegerField(null=True, blank=True)

    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    FloorCode = models.IntegerField(null=True, blank=True)
    ReturnSystem = models.IntegerField(null=True, blank=True)  # tinyint
    SettlementPrintFunctionCode = models.IntegerField(null=True, blank=True)

    SysRefNo = models.CharField(max_length=50, null=True, blank=True)

    AllowScheme = models.BooleanField(default=False)
    PRINTERPORTCODE = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'SystemMas'



class CounterMas(models.Model):
    Code = models.AutoField(primary_key=True)

    LocationCode = models.IntegerField(null=True, blank=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)

    CounterGroupCode = models.IntegerField(null=True, blank=True)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    SectionCode = models.IntegerField(null=True, blank=True)
    CounterOrder = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "CounterMas"

    def __str__(self):
        return self.Name



class SystemCounterMas(models.Model):
    Code = models.AutoField(primary_key=True)  # IDENTITY(1,1)

    CounterCode = models.IntegerField(null=True, blank=True)
    CounterType = models.CharField(max_length=25)

    UserID = models.IntegerField(null=True, blank=True)
    UserEntryDateTime = models.DateTimeField(default=timezone.now)

    LocationCode = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "SystemCounterMas"

    def __str__(self):
        return f"{self.CounterType} ({self.Code})"


class CounterGroupMas(models.Model):
    Code = models.AutoField(primary_key=True)  # IDENTITY(1,1)

    LocationCode = models.IntegerField(null=True, blank=True)
    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "CounterGroupMas"

    def __str__(self):
        return self.Name



class GiftvoucherMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "GiftvoucherMas"

    def __str__(self):
        return self.Name



class PaymentModeMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "PaymentModeMas"

    def __str__(self):
        return self.Name



class DiscountTypeMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    DiscPer = models.DecimalField(max_digits=18, decimal_places=2)

    class Meta:
        db_table = "DiscountTypeMas"

    def __str__(self):
        return self.Name


class IncomeAndExpenseMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    HeadType = models.BooleanField(default=False)
    AccountHeadName = models.CharField(max_length=100, null=True, blank=True)
    AccountPost = models.BooleanField(default=False)
    AccountHeadCode = models.IntegerField()

    class Meta:
        db_table = "IncomeAndExpenseMas"

    def __str__(self):
        return self.Name



class DepartmentMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50, null=True, blank=True)
    ShortName = models.CharField(max_length=25, null=True, blank=True)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    PerDayCommission = models.DecimalField(max_digits=18, decimal_places=5)

    class Meta:
        db_table = "DepartmentMas"

    def __str__(self):
        return self.Name if self.Name else f"Department {self.Code}"



class FloorMas(models.Model):
    Code = models.AutoField(primary_key=True)  # IDENTITY(1,1)

    LocationCode = models.IntegerField(null=True, blank=True)
    Name = models.CharField(max_length=50, null=True, blank=True)
    ShortName = models.CharField(max_length=25, null=True, blank=True)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "FloorMas"

    def __str__(self):
        return self.Name if self.Name else f"Floor {self.Code}"



class TransferModeMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25, null=True, blank=True)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    NumGeneration = models.BooleanField(default=False)

    class Meta:
        db_table = "TransferModeMas"

    def __str__(self):
        return self.Name




class Starmas(models.Model):
    Code = models.AutoField(primary_key=True)

    Starname = models.CharField(max_length=10)
    Starvalue = models.DecimalField(max_digits=9, decimal_places=2)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "Starmas"

    def __str__(self):
        return self.Starname


class SupplierMas(models.Model):
    Code = models.AutoField(primary_key=True)

    TitleCode = models.IntegerField()
    Name = models.CharField(max_length=50)
    PrintName = models.CharField(max_length=50, null=True, blank=True)
    ShortName = models.CharField(max_length=25)
    Address = models.CharField(max_length=400, null=True, blank=True)
    CityCode = models.IntegerField(null=True, blank=True)
    Pincode = models.CharField(max_length=50, null=True, blank=True)
    Phoneno = models.CharField(max_length=50, null=True, blank=True)
    Mobile = models.CharField(max_length=50, null=True, blank=True)
    Fax = models.CharField(max_length=50, null=True, blank=True)
    Email = models.CharField(max_length=50, null=True, blank=True)
    Website = models.CharField(max_length=50, null=True, blank=True)
    CstNo = models.CharField(max_length=50, null=True, blank=True)
    CstDate = models.DateTimeField(null=True, blank=True)
    TinNo = models.CharField(max_length=50, null=True, blank=True)
    TinDate = models.DateTimeField(null=True, blank=True)
    Panno = models.CharField(max_length=50, null=True, blank=True)
    Tanno = models.CharField(max_length=50, null=True, blank=True)

    CreditDays = models.IntegerField(null=True, blank=True)
    CreditLimit = models.DecimalField(max_digits=18, decimal_places=5)
    StandardDiscountOnBill = models.DecimalField(max_digits=18, decimal_places=5)

    AgentCode = models.IntegerField(null=True, blank=True)
    AgentCommission = models.DecimalField(max_digits=10, decimal_places=5)
    CashDiscountDays = models.IntegerField()
    CashDiscountPercent = models.DecimalField(max_digits=10, decimal_places=5)

    DebitDDCommission = models.BooleanField(default=False)
    DDCommissionPercent = models.DecimalField(max_digits=10, decimal_places=5)
    Profit = models.DecimalField(max_digits=10, decimal_places=5)
    InterestonDelay = models.DecimalField(max_digits=10, decimal_places=5)
    InterestonEarly = models.DecimalField(max_digits=10, decimal_places=5)

    CategoryCode = models.IntegerField(null=True, blank=True)
    GroupCode = models.IntegerField(null=True, blank=True)
    GradeCode = models.IntegerField(null=True, blank=True)
    CompanyDepend = models.BooleanField(default=False)
    ECSTransfer = models.BooleanField(default=False)
    BankCode = models.IntegerField()

    Branch = models.CharField(max_length=50, null=True, blank=True)
    AccountNo = models.CharField(max_length=50, null=True, blank=True)
    IFPNNo = models.CharField(max_length=50, null=True, blank=True)
    MICRCode = models.CharField(max_length=50, null=True, blank=True)
    ChequeName = models.CharField(max_length=50, null=True, blank=True)

    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    AreaCode = models.CharField(max_length=50, null=True, blank=True)
    LocationCode = models.IntegerField(null=True, blank=True)
    AccHeadName = models.CharField(max_length=100, null=True, blank=True)
    RepresendativeCode = models.IntegerField(null=True, blank=True)
    DUEDAYS = models.IntegerField(null=True, blank=True)
    AccountHeadCode = models.IntegerField(null=True, blank=True)
    SSAccHeadCode = models.IntegerField(null=True, blank=True)
    GSTNO = models.CharField(max_length=50, null=True, blank=True)

    BillDiscount = models.DecimalField(max_digits=10, decimal_places=5)
    ManualCashDiscPer = models.DecimalField(max_digits=10, decimal_places=5)
    ManualCashDays = models.DecimalField(max_digits=10, decimal_places=5)

    class Meta:
        db_table = "SupplierMas"

    def __str__(self):
        return self.Name




class LocationMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    Address = models.CharField(max_length=400, null=True, blank=True)
    CityCode = models.IntegerField(null=True, blank=True)
    Phoneno = models.CharField(max_length=50, null=True, blank=True)
    Mobile = models.CharField(max_length=50, null=True, blank=True)
    Fax = models.CharField(max_length=50, null=True, blank=True)
    Email = models.CharField(max_length=50, null=True, blank=True)
    WebSite = models.CharField(max_length=50, null=True, blank=True)
    TinNo = models.CharField(max_length=50, null=True, blank=True)
    TinDate = models.DateTimeField(null=True, blank=True)
    AreaCode = models.CharField(max_length=50, null=True, blank=True)
    CstNo = models.CharField(max_length=50, null=True, blank=True)
    CstDate = models.DateTimeField(null=True, blank=True)

    active = models.BooleanField(default=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)
    UserID = models.IntegerField(null=True, blank=True)
    Pincode = models.CharField(max_length=50, null=True, blank=True)

    ServerName = models.CharField(max_length=50, null=True, blank=True)
    ServerUID = models.CharField(max_length=25, null=True, blank=True)
    DbName = models.CharField(max_length=50, null=True, blank=True)
    ServerPwd = models.CharField(max_length=25, null=True, blank=True)
    ServerMode = models.CharField(max_length=25, null=True, blank=True)
    Protocol = models.CharField(max_length=25, null=True, blank=True)

    MainServer = models.BooleanField(default=False)
    AccDbName = models.CharField(max_length=50, null=True, blank=True)
    IPAddress = models.CharField(max_length=25, null=True, blank=True)
    UploadData = models.BooleanField(default=False)

    class Meta:
        db_table = "LocationMas"

    def __str__(self):
        return self.Name


class AgentMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50)
    ShortName = models.CharField(max_length=25)
    CommissionPercent = models.DecimalField(max_digits=10, decimal_places=5)
    Address = models.CharField(max_length=400, null=True, blank=True)
    CityCode = models.IntegerField(null=True, blank=True)
    Pincode = models.CharField(max_length=50, null=True, blank=True)
    Phoneno = models.CharField(max_length=50, null=True, blank=True)
    Mobile = models.CharField(max_length=50, null=True, blank=True)
    Fax = models.CharField(max_length=50, null=True, blank=True)
    Email = models.CharField(max_length=50, null=True, blank=True)
    Website = models.CharField(max_length=50, null=True, blank=True)
    Tinno = models.CharField(max_length=50, null=True, blank=True)
    TinDate = models.DateTimeField(null=True, blank=True)
    AreaCode = models.CharField(max_length=50, null=True, blank=True)
    CstNo = models.CharField(max_length=50, null=True, blank=True)
    CstDate = models.DateTimeField(null=True, blank=True)
    Tanno = models.CharField(max_length=50, null=True, blank=True)
    Panno = models.CharField(max_length=50, null=True, blank=True)
    ServiceTaxno = models.CharField(max_length=50, null=True, blank=True)

    ECSTransfer = models.BooleanField(default=False)
    BankCode = models.IntegerField(null=True, blank=True)
    Branch = models.CharField(max_length=50, null=True, blank=True)
    AccountNo = models.CharField(max_length=50, null=True, blank=True)
    IFPNNo = models.CharField(max_length=50, null=True, blank=True)
    MICRCode = models.CharField(max_length=50, null=True, blank=True)
    ChequeName = models.CharField(max_length=50, null=True, blank=True)

    active = models.BooleanField(default=True)
    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)
    LocationCode = models.IntegerField(null=True, blank=True)
    AccHeadName = models.CharField(max_length=100, null=True, blank=True)
    Sales = models.BooleanField(default=False)
    AccountHeadCode = models.IntegerField(null=True,blank=True)

    class Meta:
        db_table = "AgentMas"

    def __str__(self):
        return self.Name


class CommodityCodeMas(models.Model):
    Code = models.AutoField(primary_key=True)

    Name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)

    UserID = models.IntegerField(null=True, blank=True)
    CreatedDateTime = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "CommodityCodeMas"

    def __str__(self):
        return self.Name


class Itemcategorymass1(models.Model):  # brand
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


class Itemcategorymass2(models.Model):  # type
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Itemcategorymass3(models.Model):  # material
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Itemcategorymass4(models.Model):  # style
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Itemcategorymass5(models.Model):   # color
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Itemcategorymass6(models.Model):  # hsa code
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Itemcategorymass7(models.Model): # size
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Itemcategorymass8(models.Model):  # section
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Itemcategorymass9(models.Model):  # 
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    user_id = models.IntegerField(null=True, blank=True)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name
