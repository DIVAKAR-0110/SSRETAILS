from rest_framework import serializers
from .models import *
from decimal import Decimal, InvalidOperation

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryMas
        fields = "__all__"

class StateSerializer(serializers.ModelSerializer):
    CountryName = serializers.CharField(source='CountryCode.Name', read_only=True)

    class Meta:
        model = StateMas
        fields = [
            'Code',
            'Name',
            'ShortName',
            'CountryCode',
            'CountryName',
            'active',  # Fixed: was 'Active'
            'UserID',
            'CreatedDateTime'
        ]

class CitySerializer(serializers.ModelSerializer):
    StateName = serializers.CharField(source='StateCode.Name', read_only=True)
    CountryCode = serializers.IntegerField(source='StateCode.CountryCode.Code', read_only=True)
    CountryName = serializers.CharField(source='StateCode.CountryCode.Name', read_only=True)

    class Meta:
        model = CityMas
        fields = [
            "Code",
            "Name",
            "ShortName",
            "StateCode",
            "StateName",
            "CountryCode",
            "CountryName",
            "active",  # Fixed: was 'Active'
            "UserID",
            "CreatedDateTime",
        ]

class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TitleMas
        fields = "__all__"

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeMas
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMas
        fields = ['Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime']  # Fixed: 'Active'
        read_only_fields = ['Code', 'CreatedDateTime']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMas
        fields = ['Code','Name','ShortName','active','UserID','CreatedDateTime']  # Fixed: 'Active'
        read_only_fields = ['Code','CreatedDateTime']

class RelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationMas
        fields = ['Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime']  # Added explicit fields + fixed 'active'
        read_only_fields = ['Code', 'CreatedDateTime']

class ReligionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReligionMas
        fields = ['Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime']  # Fixed: 'Active'
        read_only_fields = ['Code', 'CreatedDateTime']

class OccupationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccupationMas
        fields = ['Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime']  # Fixed: lowercase to match model
        read_only_fields = ['Code', 'CreatedDateTime']

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankMas
        fields = [
            "Code", "Name", "ShortName", "CardServiceCharge", "active", "UserID",  # Fixed: Shortname->ShortName, Active->active
            "CreatedDateTime", "AlterdDateTime"
        ]
        read_only_fields = ["Code", "CreatedDateTime"]

# Employee Serializer - Fixed field names + added permanent fields as read-only
class EmployeeSerializer(serializers.ModelSerializer):
    LocationName = serializers.SerializerMethodField()
    CityName = serializers.SerializerMethodField()
    DepartmentName = serializers.SerializerMethodField()
    FloorName = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeMas
        fields = "__all__"
        read_only_fields = [
            "Code",
            "CreatedDateTime",
            "LocationName",
            "CityName",
            "DepartmentName",
            "FloorName",
            # Permanent fields (cannot be changed after creation)
            "LocationCode", "TitleCode", "DepartmentCode", "FloorCode", "UserID"
        ]

    def get_LocationName(self, obj):
        try:
            loc = LocationMas.objects.get(Code=obj.LocationCode)
            return loc.Name
        except LocationMas.DoesNotExist:
            return None

    def get_CityName(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            return city.Name
        except CityMas.DoesNotExist:
            return None

    def get_DepartmentName(self, obj):
        try:
            dep = DepartmentMas.objects.get(Code=obj.DepartmentCode)
            return dep.Name
        except DepartmentMas.DoesNotExist:
            return None

    def get_FloorName(self, obj):
        try:
            fl = FloorMas.objects.get(Code=obj.FloorCode)
            return fl.Name
        except FloorMas.DoesNotExist:
            return None

class TaxTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxTypeMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class SystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounterMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class SystemCounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemCounterMas
        fields = "__all__"
        read_only_fields = ["Code", "UserEntryDateTime"]

class CounterGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounterGroupMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class GiftvoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftvoucherMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class PaymentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentModeMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class DiscountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountTypeMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class IncomeExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeAndExpenseMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]

class FloorSerializer(serializers.ModelSerializer):
    LocationName = serializers.SerializerMethodField()

    class Meta:
        model = FloorMas
        fields = [
            "Code",
            "LocationCode",
            "LocationName",
            "Name",
            "ShortName",  # Fixed: Shortname->ShortName
            "active",     # Fixed: Active->active
            "UserID",
            "CreatedDateTime",
        ]
        read_only_fields = ["Code", "CreatedDateTime", "LocationName"]

    def get_LocationName(self, obj):
        try:
            loc = LocationMas.objects.get(Code=obj.LocationCode)
            return loc.Name
        except LocationMas.DoesNotExist:
            return None

class TransferModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferModeMas
        fields = "__all__"
        read_only_fields = ["Code", "CreatedDateTime"]


class StarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Starmas
        fields = ["Code", "Starname", "Starvalue", "active", "UserID", "CreatedDateTime"]
        read_only_fields = ["Code", "CreatedDateTime"]

class SupplierSerializer(serializers.ModelSerializer):
    title_name = serializers.SerializerMethodField()
    group_name = serializers.SerializerMethodField()
    grade_name = serializers.SerializerMethodField()
    city_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()
    bank_name = serializers.SerializerMethodField()

    class Meta:
        model = SupplierMas
        fields = "__all__"
        read_only_fields = [
            "Code",  # Fixed: lowercase 'code'
            "CreatedDateTime",
            "title_name",
            "group_name",
            "grade_name",
            "city_name",
            "category_name",
            "location_name",
            "bank_name",
            # Permanent fields (cannot be changed after creation)
            "TitleCode", "CategoryCode", "GroupCode", "GradeCode",
            "BankCode", "LocationCode", "AccountHeadCode", "SSAccHeadCode", "GSTNO"
        ]

    def get_title_name(self, obj):
        try:
            return TitleMas.objects.get(Code=obj.TitleCode).Name  # Fixed: title_code -> TitleCode
        except TitleMas.DoesNotExist:
            return None

    def get_group_name(self, obj):
        try:
            return GroupMas.objects.get(Code=obj.GroupCode).Name  # Fixed: group_code -> GroupCode
        except GroupMas.DoesNotExist:
            return None

    def get_grade_name(self, obj):
        try:
            return GradeMas.objects.get(Code=obj.GradeCode).Name  # Fixed: grade_code -> GradeCode
        except GradeMas.DoesNotExist:
            return None

    def get_city_name(self, obj):
        try:
            return CityMas.objects.get(Code=obj.CityCode).Name  # Fixed: city_code -> CityCode
        except CityMas.DoesNotExist:
            return None

    def get_category_name(self, obj):
        try:
            return CategoryMas.objects.get(Code=obj.CategoryCode).Name  # Fixed: category_code -> CategoryCode
        except CategoryMas.DoesNotExist:
            return None

    def get_location_name(self, obj):
        try:
            return LocationMas.objects.get(Code=obj.LocationCode).Name
        except LocationMas.DoesNotExist:
            return None

    def get_bank_name(self, obj):
        try:
            return BankMas.objects.get(Code=obj.BankCode).Name
        except BankMas.DoesNotExist:
            return None

class LocationSerializer(serializers.ModelSerializer):
    City = serializers.SerializerMethodField()
    StateName = serializers.SerializerMethodField()
    CountryName = serializers.SerializerMethodField()

    class Meta:
        model = LocationMas
        fields = [
            "Code",
            "Name",
            "ShortName",
            "Address",
            "CityCode",
            "City",
            "Phoneno",
            "Mobile",
            "Fax",
            "Email",
            "WebSite",
            "TinNo",
            "TinDate",
            "AreaCode",
            "CstNo",
            "CstDate",
            "active",  # Fixed: Active->active
            "CreatedDateTime",
            "UserID",
            "Pincode",
            "ServerName",
            "ServerUID",
            "DbName",
            "ServerPwd",
            "ServerMode",
            "Protocol",
            "MainServer",
            "AccDbName",
            "IPAddress",
            "UploadData",
            "StateName",
            "CountryName",
        ]
        read_only_fields = ["Code", "CreatedDateTime", "City", "StateName", "CountryName"]

    def get_City(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            return CitySerializer(city).data
        except CityMas.DoesNotExist:
            return None

    def get_StateName(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            return city.StateCode.Name
        except Exception:
            return ""

    def get_CountryName(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            return city.StateCode.CountryCode.Name
        except Exception:
            return ""
