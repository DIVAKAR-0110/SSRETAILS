from django.contrib import admin
from django.utils import timezone

from .models import *
from django import forms



admin.site.register(AdminLogin)


class CountryMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)
    ordering = ('Name',)
    list_editable = ('active',)
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20

admin.site.register(CountryMas, CountryMasAdmin)


class StateMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "CountryCode", "active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("active", "CountryCode")

admin.site.register(StateMas, StateMasAdmin)


class CityMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "StateCode", "active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("active", "StateCode")

admin.site.register(CityMas, CityMasAdmin)


class TitleMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("active",)

admin.site.register(TitleMas, TitleMasAdmin)


class GradeMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)

admin.site.register(GradeMas, GradeMasAdmin)


class GroupMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)

admin.site.register(GroupMas, GroupMasAdmin)


class CategoryMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)

admin.site.register(CategoryMas, CategoryMasAdmin)


class RelationMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)

admin.site.register(RelationMas, RelationMasAdmin)



class ReligionMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)
    ordering = ('Name',)
    list_editable = ('active',)
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20

admin.site.register(ReligionMas, ReligionMasAdmin)


class OccupationMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)
    ordering = ('Name',)
    list_editable = ('active',)
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20

admin.site.register(OccupationMas, OccupationMasAdmin)



class BankMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'CardServiceCharge', 'active', 'UserID', 'CreatedDateTime', 'AlterdDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)
    ordering = ('Name',)
    list_editable = ('active',)
    readonly_fields = ('CreatedDateTime', 'AlterdDateTime')
    list_per_page = 20

    def save_model(self, request, obj, form, change):
        if change:  # Only when editing
            obj.AlterdDateTime = timezone.now()
        super().save_model(request, obj, form, change)

admin.site.register(BankMas, BankMasAdmin)



class EmployeeMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")
    FloorCode = forms.ChoiceField(label="Floor")
    CityCode = forms.ChoiceField(label="City")
    DepartmentCode = forms.ChoiceField(label="Department")
    UserGroupCode = forms.ChoiceField(label="User Group")

    class Meta:
        model = EmployeeMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['LocationCode'].choices = [(l.Code, l.Name) for l in LocationMas.objects.all()]
        self.fields['FloorCode'].choices = [(f.Code, f.Name) for f in FloorMas.objects.all()]
        self.fields['CityCode'].choices = [(c.Code, c.Name) for c in CityMas.objects.all()]
        self.fields['DepartmentCode'].choices = [(d.Code, d.Name) for d in DepartmentMas.objects.all()]
        self.fields['UserGroupCode'].choices = [(g.Code, g.Name) for g in GroupMas.objects.all()]

# --------------------------
# EmployeeMas Admin
# --------------------------
class EmployeeMasAdmin(admin.ModelAdmin):

    list_display = (
        "Code",
        "Name",
        "ShortName",
        "LocationCode",
        "FloorCode",
        "CityCode",
        "get_state",
        "get_country",
        "DepartmentCode",
        "UserGroupCode",
        "active",
        "CreatedDateTime"
    )

    search_fields = ("Name", "ShortName")
    list_filter = ("active",)
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

    # Display State
    def get_state(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            state = StateMas.objects.get(Code=city.StateCode)
            return state.Name
        except:
            return "-"
    get_state.short_description = "State"

    # Display Country
    def get_country(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            state = StateMas.objects.get(Code=city.StateCode)
            country = CountryMas.objects.get(Code=state.CountryCode)
            return country.Name
        except:
            return "-"
    get_country.short_description = "Country"


admin.site.register(EmployeeMas, EmployeeMasAdmin)


class TaxTypeMasForm(forms.ModelForm):
    Category = forms.ChoiceField(label="Category", required=False)

    class Meta:
        model = TaxTypeMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Active Category List
        self.fields['Category'].choices = [
            (c.Code, c.Name) for c in CategoryMas.objects.filter(active=True)
        ]

        # Pre-fill when editing
        if self.instance and self.instance.CommodityCode:
            self.fields['Category'].initial = self.instance.CommodityCode

    def clean(self):
        cleaned_data = super().clean()

        # Store selected Category Code into CommodityCode
        cleaned_data['CommodityCode'] = self.cleaned_data.get('Category')

        return cleaned_data

class TaxTypeMasAdmin(admin.ModelAdmin):
    form = TaxTypeMasForm

    list_display = (
        "Code",
        "Name",
        "ShortName",
        "TaxPercent",
        "TaxOn",
        "Include",
        "active",
        "CommodityCode",
        "CreatedDateTime",
    )

    search_fields = ("Name", "ShortName")
    list_filter = ("active",)
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20


admin.site.register(TaxTypeMas, TaxTypeMasAdmin)



from django.contrib import admin
from django import forms

# ---------------------------------------------------
# SystemMas Form
# ---------------------------------------------------
class SystemMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")
    FloorCode = forms.ChoiceField(label="Floor")

    class Meta:
        model = SystemMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['LocationCode'].choices = [
            (l.Code, l.Name) for l in LocationMas.objects.filter(active=True)
        ]
        self.fields['FloorCode'].choices = [
            (f.Code, f.Name) for f in FloorMas.objects.filter(active=True)
        ]

        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode
            self.fields['FloorCode'].initial = self.instance.FloorCode


# ---------------------------------------------------
# SystemMas Admin
# ---------------------------------------------------
class SystemMasAdmin(admin.ModelAdmin):
    form = SystemMasForm

    list_display = (
        "Code",
        "Name",
        "ShortName",
        "get_location_name",
        "get_floor_name",
        "MACID",
        "active",
        "CreatedDateTime"
    )
    search_fields = ("Name", "ShortName")
    list_filter = ("active",)
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)

    def get_location_name(self, obj):
        try:
            return LocationMas.objects.get(Code=obj.LocationCode).Name
        except:
            return "-"
    get_location_name.short_description = "Location"

    def get_floor_name(self, obj):
        try:
            return FloorMas.objects.get(Code=obj.FloorCode).Name
        except:
            return "-"
    get_floor_name.short_description = "Floor"

admin.site.register(SystemMas, SystemMasAdmin)


# ---------------------------------------------------
# CounterMas Form
# ---------------------------------------------------
class CounterMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")

    class Meta:
        model = CounterMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['LocationCode'].choices = [
            (l.Code, l.Name) for l in LocationMas.objects.filter(active=True)
        ]

        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode


# ---------------------------------------------------
# CounterMas Admin
# ---------------------------------------------------
class CounterMasAdmin(admin.ModelAdmin):
    form = CounterMasForm

    list_display = (
        "Code",
        "Name",
        "ShortName",
        "get_location_name",
        "CounterGroupCode",
        "active",
        "CreatedDateTime",
    )
    search_fields = ("Name", "ShortName")
    list_filter = ("active",)
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)

    def get_location_name(self, obj):
        try:
            return LocationMas.objects.get(Code=obj.LocationCode).Name
        except:
            return "-"
    get_location_name.short_description = "Location"

admin.site.register(CounterMas, CounterMasAdmin)


# ---------------------------------------------------
# SystemCounterMas Form
# ---------------------------------------------------
class SystemCounterMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")
    CounterCode = forms.ChoiceField(label="Counter")

    class Meta:
        model = SystemCounterMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['LocationCode'].choices = [
            (l.Code, l.Name) for l in LocationMas.objects.filter(active=True)
        ]
        self.fields['CounterCode'].choices = [
            (c.Code, c.Name) for c in CounterMas.objects.filter(active=True)
        ]

        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode
            self.fields['CounterCode'].initial = self.instance.CounterCode


# ---------------------------------------------------
# SystemCounterMas Admin
# ---------------------------------------------------
class SystemCounterMasAdmin(admin.ModelAdmin):
    form = SystemCounterMasForm

    list_display = (
        "Code",
        "get_counter_name",
        "CounterType",
        "get_location_name",
        "UserID",
        "UserEntryDateTime",
    )
    search_fields = ("CounterType",)
    ordering = ("CounterType",)

    def get_location_name(self, obj):
        try:
            return LocationMas.objects.get(Code=obj.LocationCode).Name
        except:
            return "-"
    get_location_name.short_description = "Location"

    def get_counter_name(self, obj):
        try:
            return CounterMas.objects.get(Code=obj.CounterCode).Name
        except:
            return "-"
    get_counter_name.short_description = "Counter"

admin.site.register(SystemCounterMas, SystemCounterMasAdmin)


# ---------------------------------------------------
# CounterGroupMas Form
# ---------------------------------------------------
class CounterGroupMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")

    class Meta:
        model = CounterGroupMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['LocationCode'].choices = [
            (l.Code, l.Name) for l in LocationMas.objects.filter(active=True)
        ]

        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode


# ---------------------------------------------------
# CounterGroupMas Admin
# ---------------------------------------------------
class CounterGroupMasAdmin(admin.ModelAdmin):
    form = CounterGroupMasForm

    list_display = ("Code", "Name", "ShortName", "get_location_name", "active", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("active",)
    ordering = ("Name",)
    readonly_fields = ("CreatedDateTime",)
    list_editable = ("active",)

    def get_location_name(self, obj):
        try:
            return LocationMas.objects.get(Code=obj.LocationCode).Name
        except:
            return "-"
    get_location_name.short_description = "Location"

admin.site.register(CounterGroupMas, CounterGroupMasAdmin)


# ---------------------------------------------------
# GiftvoucherMas Admin
# ---------------------------------------------------
class GiftvoucherMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("active",)
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)

admin.site.register(GiftvoucherMas, GiftvoucherMasAdmin)


from django.contrib import admin
from django import forms
from .models import (
    PaymentModeMas,
    DiscountTypeMas,
    IncomeAndExpenseMas,
    DepartmentMas,
    FloorMas,
    LocationMas   # ← Make sure this is imported
)

# =====================================================
# PaymentModeMas Admin
# =====================================================

class PaymentModeMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("active",)
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20


admin.site.register(PaymentModeMas, PaymentModeMasAdmin)


# =====================================================
# DiscountTypeMas Admin
# =====================================================

class DiscountTypeMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "DiscPer", "active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("active",)
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20


admin.site.register(DiscountTypeMas, DiscountTypeMasAdmin)


# =====================================================
# IncomeAndExpenseMas Admin
# =====================================================

class IncomeAndExpenseMasAdmin(admin.ModelAdmin):
    list_display = (
        "Code",
        "Name",
        "ShortName",
        "HeadType",
        "AccountHeadName",
        "AccountPost",
        "active",
        "UserID",
        "CreatedDateTime",
    )
    search_fields = ("Name", "ShortName", "AccountHeadName")
    list_filter = ("active", "HeadType", "AccountPost")
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20


admin.site.register(IncomeAndExpenseMas, IncomeAndExpenseMasAdmin)


# =====================================================
# DepartmentMas Admin
# =====================================================

class DepartmentMasAdmin(admin.ModelAdmin):
    list_display = (
        'Code',
        'Name',
        'ShortName',
        'PerDayCommission',
        'active',
        'UserID',
        'CreatedDateTime'
    )
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)
    ordering = ('Name',)
    list_editable = ('active', 'PerDayCommission')
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20


admin.site.register(DepartmentMas, DepartmentMasAdmin)


# =====================================================
# FloorMas Admin + Dropdown for LocationMas
# =====================================================

class FloorMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")

    class Meta:
        model = FloorMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Load active locations
        self.fields['LocationCode'].choices = [
            (loc.Code, loc.Name) for loc in LocationMas.objects.filter(active=True)
        ]

        # Fill selected value while editing
        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode


class FloorMasAdmin(admin.ModelAdmin):
    form = FloorMasForm

    list_display = (
        'Code',
        'LocationCode',
        'Name',
        'ShortName',
        'active',
        'UserID',
        'CreatedDateTime'
    )
    search_fields = ('Name', 'ShortName')
    list_filter = ('active',)
    ordering = ('Name',)
    list_editable = ('active',)
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20


admin.site.register(FloorMas, FloorMasAdmin)




# ---------------------------------------------------------
# 1. TransferModeMas Admin
# ---------------------------------------------------------
class TransferModeMasAdmin(admin.ModelAdmin):
    list_display = (
        "Code", "Name", "ShortName", "NumGeneration",
        "active", "UserID", "CreatedDateTime"
    )
    search_fields = ("Name", "ShortName")
    list_filter = ("active", "NumGeneration")
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20


admin.site.register(TransferModeMas, TransferModeMasAdmin)


# ---------------------------------------------------------
# 2. StarMas Admin
# ---------------------------------------------------------
class StarmasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Starname", "Starvalue", "UserID", "active")
    search_fields = ("Starname",)
    list_filter = ("active",)


admin.site.register(Starmas, StarmasAdmin)


# ---------------------------------------------------------
# 3. SupplierMas Form (Dropdown correctly saves PK)
# ---------------------------------------------------------
class SupplierMasForm(forms.ModelForm):

    # Correct field names must match EXACT MODEL fields
    TitleCode = forms.ChoiceField(label="Title", required=True)
    CityCode = forms.ChoiceField(label="City", required=True)
    AgentCode = forms.ChoiceField(label="Agent", required=True)
    CategoryCode = forms.ChoiceField(label="Category", required=True)
    GroupCode = forms.ChoiceField(label="Group", required=True)
    GradeCode = forms.ChoiceField(label="Grade", required=False)
    BankCode = forms.ChoiceField(label="Bank", required=True)
    LocationCode = forms.ChoiceField(label="Location", required=True)
    RepresendativeCode = forms.ChoiceField(label="Representative", required=True)

    class Meta:
        model = SupplierMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["TitleCode"].choices = [(obj.pk, str(obj)) for obj in TitleMas.objects.filter(active=True)]
        self.fields["CityCode"].choices = [(obj.pk, str(obj)) for obj in CityMas.objects.filter(active=True)]
        self.fields["AgentCode"].choices = [(obj.pk, str(obj)) for obj in AgentMas.objects.filter(active=True)]
        self.fields["CategoryCode"].choices = [(obj.pk, str(obj)) for obj in CategoryMas.objects.filter(active=True)]
        self.fields["GroupCode"].choices = [(obj.pk, str(obj)) for obj in GroupMas.objects.filter(active=True)]
        self.fields["GradeCode"].choices = [(obj.pk, str(obj)) for obj in GradeMas.objects.filter(active=True)]
        self.fields["BankCode"].choices = [(obj.pk, str(obj)) for obj in BankMas.objects.filter(active=True)]
        self.fields["LocationCode"].choices = [(obj.pk, str(obj)) for obj in FloorMas.objects.filter(active=True)]
        self.fields["RepresendativeCode"].choices = [(obj.pk, str(obj)) for obj in AgentMas.objects.filter(active=True)]


# ---------------------------------------------------------
# 4. SupplierMas Admin
# ---------------------------------------------------------
@admin.register(SupplierMas)
class SupplierMasAdmin(admin.ModelAdmin):
    form = SupplierMasForm

    list_display = (
        "Name",
        "ShortName",
        "display_title",
        "display_city",
        "display_agent",
        "display_bank",
        "display_location",
        "active",
    )

    list_filter = ("active",)
    search_fields = ("Name", "ShortName")

    # ---------------- Display Methods ----------------
    def display_title(self, obj):
        return self.safe_fk(TitleMas, obj.TitleCode)
    display_title.short_description = "Title"

    def display_city(self, obj):
        return self.safe_fk(CityMas, obj.CityCode)
    display_city.short_description = "City"

    def display_agent(self, obj):
        return self.safe_fk(AgentMas, obj.AgentCode)
    display_agent.short_description = "Agent"

    def display_bank(self, obj):
        return self.safe_fk(BankMas, obj.BankCode)
    display_bank.short_description = "Bank"

    def display_location(self, obj):
        return self.safe_fk(FloorMas, obj.LocationCode)
    display_location.short_description = "Location"

    # Safe Foreign Key Lookup
    def safe_fk(self, model, value):
        try:
            return model.objects.get(pk=value)
        except:
            return "-"


from django.contrib import admin
from django import forms


# =====================================================
#          LOCATION MAS ADMIN + FORM
# =====================================================

class LocationMasForm(forms.ModelForm):
    CityCode = forms.ChoiceField(label="City", choices=[])

    class Meta:
        model = LocationMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Drop-down values
        self.fields["CityCode"].choices = [
            (city.Code, city.Name) for city in CityMas.objects.filter(active=True)
        ]

        # Pre-fill existing value
        if self.instance and self.instance.CityCode:
            self.fields["CityCode"].initial = self.instance.CityCode


class LocationMasAdmin(admin.ModelAdmin):
    form = LocationMasForm

    readonly_fields = ("get_state", "get_country")

    list_display = ("Code", "Name", "get_city", "get_state", "get_country", "active")
    search_fields = ("Name",)
    list_filter = ("active",)

    def get_city(self, obj):
        try:
            return CityMas.objects.get(Code=obj.CityCode).Name
        except:
            return "-"
    get_city.short_description = "City"

    def get_state(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            state = StateMas.objects.get(Code=city.StateCode)
            return state.Name
        except:
            return "-"
    get_state.short_description = "State"

    def get_country(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            state = StateMas.objects.get(Code=city.StateCode)
            country = CountryMas.objects.get(Code=state.CountryCode)
            return country.Name
        except:
            return "-"
    get_country.short_description = "Country"


admin.site.register(LocationMas, LocationMasAdmin)


# =====================================================
#                AGENT MAS ADMIN
# =====================================================

class AgentMasAdmin(admin.ModelAdmin):
    list_display = (
        "Code",
        "Name",
        "ShortName",
        "location_name",
        "city_name",
        "bank_name",
        "CommissionPercent",
        "active",
        "UserID",
        "CreatedDateTime",
    )

    search_fields = ("Name", "ShortName", "AccHeadName")
    list_filter = ("active",)
    ordering = ("Name",)
    list_editable = ("active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

    # Dropdown selection for FK-like fields
    def formfield_for_dbfield(self, db_field, **kwargs):
        from django import forms

        if db_field.name == "LocationCode":
            kwargs["widget"] = forms.Select(
                choices=[(loc.Code, loc.Name) for loc in LocationMas.objects.filter(active=True)]
            )

        if db_field.name == "CityCode":
            kwargs["widget"] = forms.Select(
                choices=[(c.Code, c.Name) for c in CityMas.objects.filter(active=True)]
            )

        if db_field.name == "BankCode":
            kwargs["widget"] = forms.Select(
                choices=[(b.Code, b.Name) for b in BankMas.objects.filter(active=True)]
            )

        return super().formfield_for_dbfield(db_field, **kwargs)

    # Display functions for admin list
    def location_name(self, obj):
        loc = LocationMas.objects.filter(Code=obj.LocationCode).first()
        return loc.Name if loc else "-"
    location_name.short_description = "Location"

    def city_name(self, obj):
        city = CityMas.objects.filter(Code=obj.CityCode).first()
        return city.Name if city else "-"
    city_name.short_description = "City"

    def bank_name(self, obj):
        bank = BankMas.objects.filter(Code=obj.BankCode).first()
        return bank.Name if bank else "-"
    bank_name.short_description = "Bank"


admin.site.register(AgentMas, AgentMasAdmin)










class ItemCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'short_name', 'active', 'user_id', 'datetime')
    search_fields = ('name', 'short_name')
    list_filter = ('active',)
    ordering = ('name',)
    list_editable = ('active',)
    readonly_fields = ('datetime',)
    list_per_page = 20


admin.site.register(Itemcategorymass1, ItemCategoryAdmin)
admin.site.register(Itemcategorymass2, ItemCategoryAdmin)
admin.site.register(Itemcategorymass3, ItemCategoryAdmin)
admin.site.register(Itemcategorymass4, ItemCategoryAdmin)
admin.site.register(Itemcategorymass5, ItemCategoryAdmin)
admin.site.register(Itemcategorymass6, ItemCategoryAdmin)
admin.site.register(Itemcategorymass7, ItemCategoryAdmin)
admin.site.register(Itemcategorymass8, ItemCategoryAdmin)
admin.site.register(Itemcategorymass9, ItemCategoryAdmin)





class CommodityCodeMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name',)
    list_filter = ('active',)
    ordering = ('Name',)
    list_editable = ('active',)
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20


admin.site.register(CommodityCodeMas, CommodityCodeMasAdmin)