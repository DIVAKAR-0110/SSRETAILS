from django.contrib import admin
from django.utils import timezone

from .models import *
from django import forms



admin.site.register(AdminLogin)


class CountryMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'Active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'Shortname')
    list_filter = ('Active',)
    ordering = ('Name',)
    list_editable = ('Active',)
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20

admin.site.register(CountryMas, CountryMasAdmin)


class StateMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "CountryCode", "Active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("Active", "CountryCode")

    # Show dropdown for CountryCode
    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == "CountryCode":
            countries = CountryMas.objects.all()
            choices = [(c.Code, c.Name) for c in countries]

            from django.forms import Select
            kwargs["widget"] = Select(choices=choices)

        return super().formfield_for_dbfield(db_field, **kwargs)

admin.site.register(StateMas, StateMasAdmin)


class CityMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "StateCode", "Active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("Active", "StateCode")

    # Dropdown for StateCode
    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == "StateCode":
            states = StateMas.objects.all()
            choices = [(s.Code, s.Name) for s in states]

            from django.forms import Select
            kwargs["widget"] = Select(choices=choices)

        return super().formfield_for_dbfield(db_field, **kwargs)

admin.site.register(CityMas, CityMasAdmin)

class TitleMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "Active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)

admin.site.register(TitleMas, TitleMasAdmin)


class GradeMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'Active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('Active',)

admin.site.register(GradeMas, GradeMasAdmin)


class GroupMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'Active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('Active',)

admin.site.register(GroupMas, GroupMasAdmin)


class CategoryMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'Active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('Active',)

admin.site.register(CategoryMas, CategoryMasAdmin)


class RelationMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'Active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('Active',)

admin.site.register(RelationMas, RelationMasAdmin)



class ReligionMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'ShortName', 'Active', 'UserID', 'CreatedDateTime')
    search_fields = ('Name', 'ShortName')
    list_filter = ('Active',)
    ordering = ('Name',)
    list_editable = ('Active',)
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20

admin.site.register(ReligionMas, ReligionMasAdmin)


class OccupationMasAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'short_name', 'active', 'user_id', 'created_datetime')
    search_fields = ('name', 'short_name')
    list_filter = ('active',)
    ordering = ('name',)
    list_editable = ('active',)
    readonly_fields = ('created_datetime',)
    list_per_page = 20

admin.site.register(OccupationMas, OccupationMasAdmin)


class BankMasAdmin(admin.ModelAdmin):
    list_display = ('Code', 'Name', 'Shortname', 'CardServiceCharge', 'Active', 'UserID', 'CreatedDateTime', 'AlterdDateTime')
    search_fields = ('Name', 'Shortname')
    list_filter = ('Active',)
    ordering = ('Name',)
    list_editable = ('Active',)
    readonly_fields = ('CreatedDateTime', 'AlterdDateTime')
    list_per_page = 20

    def save_model(self, request, obj, form, change):
        if change:  # When editing an existing record
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
    form = EmployeeMasForm

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
        "Active",
        "CreatedDateTime"
    )

    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

    # --------------------------
    # Display State name in admin
    # --------------------------
    def get_state(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            state = StateMas.objects.get(Code=city.StateCode)
            return state.Name
        except:
            return "-"
    get_state.short_description = "State"

    # --------------------------
    # Display Country name in admin
    # --------------------------
    def get_country(self, obj):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            state = StateMas.objects.get(Code=city.StateCode)
            country = CountryMas.objects.get(Code=state.CountryCode)
            return country.Name
        except:
            return "-"
    get_country.short_description = "Country"

    # --------------------------
    # Auto-fill StateCode and CountryCode on save
    # --------------------------
    def save_model(self, request, obj, form, change):
        try:
            city = CityMas.objects.get(Code=obj.CityCode)
            obj.StateCode = city.StateCode
            state = StateMas.objects.get(Code=city.StateCode)
            obj.CountryCode = state.CountryCode
        except:
            obj.StateCode = None
            obj.CountryCode = None
        super().save_model(request, obj, form, change)

admin.site.register(EmployeeMas, EmployeeMasAdmin)


class TaxTypeMasForm(forms.ModelForm):
    Category = forms.ChoiceField(label="Category", required=False)

    class Meta:
        model = TaxTypeMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Populate Category dropdown with active categories
        self.fields['Category'].choices = [(c.Code, c.Name) for c in CategoryMas.objects.filter(Active=True)]

        # Pre-fill the dropdown if instance exists
        if self.instance and self.instance.CommodityCode:
            self.fields['Category'].initial = self.instance.CommodityCode

    def clean(self):
        cleaned_data = super().clean()
        # Save selected Category Code in CommodityCode field
        cleaned_data['CommodityCode'] = self.cleaned_data.get('Category')
        return cleaned_data

# --------------------------
# TaxTypeMas Admin
# --------------------------
class TaxTypeMasAdmin(admin.ModelAdmin):
    form = TaxTypeMasForm

    list_display = (
        "Code",
        "Name",
        "ShortName",
        "TaxPercent",
        "TaxOn",
        "Include",
        "Active",
        "CommodityCode",
        "CreatedDateTime",
    )

    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

admin.site.register(TaxTypeMas, TaxTypeMasAdmin)


class SystemMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")
    FloorCode = forms.ChoiceField(label="Floor")

    class Meta:
        model = SystemMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Populate dropdowns
        self.fields['LocationCode'].choices = [(l.Code, l.Name) for l in LocationMas.objects.filter(Active=True)]
        self.fields['FloorCode'].choices = [(f.Code, f.Name) for f in FloorMas.objects.filter(Active=True)]

        # Pre-fill dropdowns if editing an instance
        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode
            self.fields['FloorCode'].initial = self.instance.FloorCode

# --------------------------
# SystemMas Admin
# --------------------------
class SystemMasAdmin(admin.ModelAdmin):
    form = SystemMasForm

    list_display = (
        "Code",
        "Name",
        "ShortName",
        "LocationCode",
        "FloorCode",
        "MACID",
        "Active",
        "CreatedDateTime"
    )

    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

    # Optional: display Location and Floor names instead of codes in list view
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


class CounterMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")

    # Uncomment if you want CounterGroup dropdown
    # CounterGroupCode = forms.ChoiceField(label="Counter Group")

    class Meta:
        model = CounterMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Populate Location dropdown with active locations
        self.fields['LocationCode'].choices = [(l.Code, l.Name) for l in LocationMas.objects.filter(Active=True)]

        # Uncomment if you have CounterGroupMas
        # self.fields['CounterGroupCode'].choices = [(c.Code, c.Name) for c in CounterGroupMas.objects.filter(Active=True)]

        # Pre-fill dropdowns if editing an instance
        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode
            # self.fields['CounterGroupCode'].initial = self.instance.CounterGroupCode


# --------------------------
# CounterMas Admin
# --------------------------
class CounterMasAdmin(admin.ModelAdmin):
    form = CounterMasForm

    list_display = (
        "Code",
        "Name",
        "ShortName",
        "LocationCode",
        "CounterGroupCode",
        "Active",
        "CreatedDateTime"
    )

    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

    # Optional: display Location name instead of code
    def get_location_name(self, obj):
        try:
            return LocationMas.objects.get(Code=obj.LocationCode).Name
        except:
            return "-"

    get_location_name.short_description = "Location"

    # Optional: display CounterGroup name if needed
    # def get_countergroup_name(self, obj):
    #     try:
    #         return CounterGroupMas.objects.get(Code=obj.CounterGroupCode).Name
    #     except:
    #         return "-"
    # get_countergroup_name.short_description = "Counter Group"


admin.site.register(CounterMas, CounterMasAdmin)


class SystemCounterMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")
    CounterCode = forms.ChoiceField(label="Counter")

    class Meta:
        model = SystemCounterMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Populate Location dropdown with active locations
        self.fields['LocationCode'].choices = [(l.Code, l.Name) for l in LocationMas.objects.filter(Active=True)]
        # Populate Counter dropdown with active counters
        self.fields['CounterCode'].choices = [(c.Code, c.Name) for c in CounterMas.objects.filter(Active=True)]

        # Pre-fill dropdowns if editing an instance
        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode
            self.fields['CounterCode'].initial = self.instance.CounterCode

# --------------------------
# SystemCounterMas Admin
# --------------------------
class SystemCounterMasAdmin(admin.ModelAdmin):
    form = SystemCounterMasForm

    list_display = (
        "Code",
        "CounterCode",
        "CounterType",
        "LocationCode",
        "UserID",
        "UserEntryDateTime"
    )

    search_fields = ("CounterType",)
    ordering = ("CounterType",)
    list_per_page = 20

    # Optional: display names instead of codes in list view
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


class CounterGroupMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location")

    class Meta:
        model = CounterGroupMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Populate dropdown with active locations
        self.fields['LocationCode'].choices = [(l.Code, l.Name) for l in LocationMas.objects.filter(Active=True)]

        # Pre-fill dropdown if editing an instance
        if self.instance:
            self.fields['LocationCode'].initial = self.instance.LocationCode


# --------------------------
# CounterGroupMas Admin
# --------------------------
class CounterGroupMasAdmin(admin.ModelAdmin):
    form = CounterGroupMasForm

    list_display = ("Code", "Name", "ShortName", "LocationCode", "Active", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

    # Optional: display Location name instead of code
    def get_location_name(self, obj):
        try:
            return LocationMas.objects.get(Code=obj.LocationCode).Name
        except:
            return "-"
    get_location_name.short_description = "Location"

admin.site.register(CounterGroupMas, CounterGroupMasAdmin)


class GiftvoucherMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "Active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

admin.site.register(GiftvoucherMas, GiftvoucherMasAdmin)


class PaymentModeMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "Active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

admin.site.register(PaymentModeMas, PaymentModeMasAdmin)


class DiscountTypeMasAdmin(admin.ModelAdmin):
    list_display = ("Code", "Name", "ShortName", "DiscPer", "Active", "UserID", "CreatedDateTime")
    search_fields = ("Name", "ShortName")
    list_filter = ("Active",)
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

admin.site.register(DiscountTypeMas, DiscountTypeMasAdmin)


class IncomeAndExpenseMasAdmin(admin.ModelAdmin):
    list_display = (
        "Code",
        "Name",
        "Shortname",
        "HeadType",
        "AccountHeadName",
        "AccountPost",
        "Active",
        "UserID",
        "CreatedDateTime",
    )
    search_fields = ("Name", "Shortname", "AccountHeadName")
    list_filter = ("Active", "HeadType", "AccountPost")
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

admin.site.register(IncomeAndExpenseMas, IncomeAndExpenseMasAdmin)


class DepartmentMasAdmin(admin.ModelAdmin):
    list_display = (
        'Code',
        'Name',
        'Shortname',
        'PerDayCommission',
        'Active',
        'UserID',
        'CreatedDateTime'
    )
    search_fields = ('Name', 'Shortname')
    list_filter = ('Active',)
    ordering = ('Name',)
    list_editable = ('Active', 'PerDayCommission')
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20

admin.site.register(DepartmentMas, DepartmentMasAdmin)


class FloorMasForm(forms.ModelForm):
    LocationCode = forms.ChoiceField(label="Location Name")
    class Meta:
        model = FloorMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Populate dropdown with LocationMas (code → name)
        self.fields['LocationCode'].choices = [
            (loc.Code, loc.Name) for loc in LocationMas.objects.all()
        ]


class FloorMasAdmin(admin.ModelAdmin):
    form = FloorMasForm

    list_display = (
        'Code',
        'LocationCode',
        'Name',
        'Shortname',
        'Active',
        'UserID',
        'CreatedDateTime'
    )
    search_fields = ('Name', 'Shortname')
    list_filter = ('Active',)
    ordering = ('Name',)
    list_editable = ('Active',)
    readonly_fields = ('CreatedDateTime',)
    list_per_page = 20

admin.site.register(FloorMas, FloorMasAdmin)



class TransferModeMasAdmin(admin.ModelAdmin):
    list_display = (
        "Code",
        "Name",
        "ShortName",
        "NumGeneration",
        "Active",
        "UserID",
        "CreatedDateTime",
    )
    search_fields = ("Name", "ShortName")
    list_filter = ("Active", "NumGeneration")
    ordering = ("Name",)
    list_editable = ("Active",)
    readonly_fields = ("CreatedDateTime",)
    list_per_page = 20

admin.site.register(TransferModeMas, TransferModeMasAdmin)


class StarmasAdmin(admin.ModelAdmin):
    list_display = ("code", "starname", "starvalue", "user_id", "active")

    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == "user":
            users = AdminLogin.objects.all()
            choices = [(u.id, u.username) for u in users]  # show username in dropdown

            from django.forms import Select
            kwargs["widget"] = Select(choices=choices)

        return super().formfield_for_dbfield(db_field, **kwargs)

admin.site.register(Starmas, StarmasAdmin)


class SupplierMasForm(forms.ModelForm):
    # Use ChoiceField with manual integer values and display labels
    title_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in TitleMas.objects.filter(Active=True)],
        label="Title",
        required=True
    )

    city_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in CityMas.objects.filter(Active=True)],
        label="City",
        required=True
    )

    agent_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in AgentMas.objects.filter(active=True)],
        label="Agent",
        required=True
    )

    category_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in CategoryMas.objects.filter(Active=True)],
        label="Category",
        required=True
    )

    group_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in GroupMas.objects.filter(Active=True)],
        label="Group",
        required=True
    )

    grade_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in GradeMas.objects.filter(Active=True)],
        label="Grade",
        required=False
    )

    bank_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in BankMas.objects.filter(Active=True)],
        label="Bank",
        required=True
    )

    location_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in FloorMas.objects.filter(Active=True)],
        label="Location",
        required=True
    )

    representative_code = forms.ChoiceField(
        choices=[(obj.pk, str(obj)) for obj in AgentMas.objects.filter(active=True)],
        label="Representative",
        required=True
    )

    class Meta:
        model = SupplierMas
        fields = '__all__'
        exclude = ['created_datetime', 'code']
        widgets = {
            # Hide original integer fields completely
            'title_code': forms.HiddenInput(),
            'city_code': forms.HiddenInput(),
            'agent_code': forms.HiddenInput(),
            'category_code': forms.HiddenInput(),
            'group_code': forms.HiddenInput(),
            'grade_code': forms.HiddenInput(),
            'bank_code': forms.HiddenInput(),
            'location_code': forms.HiddenInput(),
            'representative_code': forms.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Dynamically populate choices
        self.fields['title_code'].choices = [('', 'Select Title')] + [(obj.pk, str(obj)) for obj in
                                                                      TitleMas.objects.filter(Active=True)]
        self.fields['city_code'].choices = [('', 'Select City')] + [(obj.pk, str(obj)) for obj in
                                                                    CityMas.objects.filter(Active=True)]
        self.fields['agent_code'].choices = [('', 'Select Agent')] + [(obj.pk, str(obj)) for obj in
                                                                      AgentMas.objects.filter(active=True)]
        self.fields['category_code'].choices = [('', 'Select Category')] + [(obj.pk, str(obj)) for obj in
                                                                            CategoryMas.objects.filter(Active=True)]
        self.fields['group_code'].choices = [('', 'Select Group')] + [(obj.pk, str(obj)) for obj in
                                                                      GroupMas.objects.filter(Active=True)]
        self.fields['grade_code'].choices = [('', 'Select Grade')] + [(obj.pk, str(obj)) for obj in
                                                                      GradeMas.objects.filter(Active=True)]
        self.fields['bank_code'].choices = [('', 'Select Bank')] + [(obj.pk, str(obj)) for obj in
                                                                    BankMas.objects.filter(Active=True)]
        self.fields['location_code'].choices = [('', 'Select Location')] + [(obj.pk, str(obj)) for obj in
                                                                            FloorMas.objects.filter(Active=True)]
        self.fields['representative_code'].choices = [('', 'Select Representative')] + [(obj.pk, str(obj)) for obj in
                                                                                        AgentMas.objects.filter(
                                                                                            active=True)]


@admin.register(SupplierMas)
class SupplierMasAdmin(admin.ModelAdmin):
    form = SupplierMasForm

    list_display = (
        'name', 'short_name', 'get_title_display', 'get_city_display',
        'get_agent_display', 'get_bank_display', 'get_location_display', 'active'
    )

    def get_title_display(self, obj):
        try:
            return TitleMas.objects.get(pk=obj.title_code).__str__()
        except:
            return '-'

    get_title_display.short_description = 'Title'

    def get_city_display(self, obj):
        try:
            return CityMas.objects.get(pk=obj.city_code).__str__()
        except:
            return '-'

    get_city_display.short_description = 'City'

    def get_agent_display(self, obj):
        try:
            return AgentMas.objects.get(pk=obj.agent_code).__str__()
        except:
            return '-'

    get_agent_display.short_description = 'Agent'

    def get_bank_display(self, obj):
        try:
            return BankMas.objects.get(pk=obj.bank_code).__str__()
        except:
            return '-'

    get_bank_display.short_description = 'Bank'

    def get_location_display(self, obj):
        try:
            return FloorMas.objects.get(pk=obj.location_code).__str__()
        except:
            return '-'

    get_location_display.short_description = 'Location'

    list_filter = ('active',)
    search_fields = ('name', 'short_name')

    # Keep your existing fieldsets - they'll use the custom form fields
    fieldsets = (
        ('Basic Info', {
            'fields': (
                'title_code', 'name', 'print_name', 'short_name', 'address',
                'city_code', 'pincode', 'phoneno', 'mobile', 'fax', 'email', 'website'
            )
        }),
        ('Tax & Financial', {
            'fields': (
                'cst_no', 'cst_date', 'tin_no', 'tin_date', 'panno', 'tanno',
                'credit_days', 'credit_limit', 'standard_discount_on_bill',
                'agent_code', 'agent_commission', 'cash_discount_days',
                'cash_discount_percent', 'debit_dd_commission', 'dd_commission_percent',
                'profit', 'interest_on_delay', 'interest_on_early',
                'category_code', 'group_code', 'grade_code'
            )
        }),
        ('Bank & Account', {
            'fields': (
                'company_depend', 'ecs_transfer', 'bank_code', 'branch', 'account_no',
                'ifpn_no', 'micr_code', 'cheque_name', 'acc_head_name',
                'representative_code', 'due_days', 'account_head_code', 'ss_account_head_code',
                'gst_no'
            )
        }),
        ('Discounts', {
            'fields': ('bill_discount', 'manual_cash_disc_per', 'manual_cash_days')
        }),
        ('Other', {
            'fields': ('active', 'user', 'location_code', 'area_code')
        }),
    )


class AgentMasAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "name",
        "short_name",
        "location_name",
        "city_name",
        "bank_name",
        "commission_percent",
        "active",
        "user_id",
        "created_datetime",
    )
    search_fields = ("name", "short_name", "acc_head_name")
    list_filter = ("active",)
    ordering = ("name",)
    list_editable = ("active",)
    readonly_fields = ("created_datetime",)
    list_per_page = 20

    # Dropdowns for Location, City, Bank
    def formfield_for_dbfield(self, db_field, **kwargs):
        from django import forms
        if db_field.name == "location_code":
            kwargs["widget"] = forms.Select(
                choices=[(loc.Code, loc.Name) for loc in LocationMas.objects.filter(Active=True)]
            )
        if db_field.name == "city_code":
            kwargs["widget"] = forms.Select(
                choices=[(c.Code, c.Name) for c in CityMas.objects.filter(Active=True)]
            )
        if db_field.name == "bank_code":
            kwargs["widget"] = forms.Select(
                choices=[(b.Code, b.Name) for b in BankMas.objects.filter(Active=True)]
            )
        return super().formfield_for_dbfield(db_field, **kwargs)

    # Display Location Name in list_display
    def location_name(self, obj):
        loc = LocationMas.objects.filter(Code=obj.location_code).first()
        return loc.Name if loc else ""
    location_name.short_description = "Location"

    # Display City Name in list_display
    def city_name(self, obj):
        city = CityMas.objects.filter(Code=obj.city_code).first()
        return city.Name if city else ""
    city_name.short_description = "City"

    # Display Bank Name in list_display
    def bank_name(self, obj):
        bank = BankMas.objects.filter(Code=obj.bank_code).first()
        return bank.Name if bank else ""
    bank_name.short_description = "Bank"

admin.site.register(AgentMas, AgentMasAdmin)



class LocationMasForm(forms.ModelForm):
    CityCode = forms.ChoiceField(label="City", choices=[])

    class Meta:
        model = LocationMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Build dropdown: (city_code, city_name)
        city_choices = [(city.Code, city.Name) for city in CityMas.objects.all()]
        self.fields['CityCode'].choices = city_choices

        # Pre-fill selected city in edit mode
        if self.instance and self.instance.CityCode:
            self.fields['CityCode'].initial = self.instance.CityCode

class LocationMasAdmin(admin.ModelAdmin):
    form = LocationMasForm
    readonly_fields = ('get_state', 'get_country')

    list_display = ('Code', 'Name', 'CityCode', 'get_state', 'get_country', 'Active')

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

















class CommodityCodeMasAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'active', 'user', 'created_datetime')
    search_fields = ('name',)
    list_filter = ('active',)
    ordering = ('name',)
    list_editable = ('active',)
    readonly_fields = ('created_datetime',)
    list_per_page = 20

admin.site.register(CommodityCodeMas, CommodityCodeMasAdmin)