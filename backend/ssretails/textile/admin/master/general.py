# textile/admin/master/general.py
from django.contrib import admin
from django import forms

from textile.models import (
    CountryMas, StateMas, CityMas, TitleMas, GradeMas, GroupMas, CategoryMas,
    RelationMas, ReligionMas, OccupationMas, BankMas, TaxTypeMas, SystemMas,
    SystemCounterMas, SystemCounterDet, CounterMas, CounterGroupMas, IncomeAndExpenseMas,
    GiftvoucherMas, PaymentModeMas, DiscountTypeMas, DepartmentMas, FloorMas,
    TransferModeMas, StarMas, EmployeeMas
)


@admin.register(CountryMas)
class CountryMasAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "admin_id", "active", "created_at")
    list_display_links = ("id", "name")
    list_filter = ("active", "created_at")
    search_fields = ("name", "shortname", "admin_id")
    ordering = ("-created_at",)
    list_editable = ("active", "shortname")
    readonly_fields = ("created_at",)
    list_per_page = 25

    fieldsets = (
        ("Admin Info", {"fields": ("admin_id",)}),
        ("Country Details", {"fields": ("name", "shortname")}),
        ("Status", {"fields": ("active", "created_at")}),
    )

    prepopulated_fields = {"shortname": ("name",)}
    actions = ["make_active", "make_inactive"]

    def make_active(self, request, queryset):
        updated = queryset.update(active=True)
        self.message_user(request, f"{updated} countries marked as active.")
    make_active.short_description = "Mark selected countries as active"

    def make_inactive(self, request, queryset):
        updated = queryset.update(active=False)
        self.message_user(request, f"{updated} countries marked as inactive.")
    make_inactive.short_description = "Mark selected countries as inactive"


class StateAdminForm(forms.ModelForm):
    country = forms.ModelChoiceField(
        queryset=CountryMas.objects.all(),
        required=True,
        label="Country"
    )

    class Meta:
        model = StateMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk and self.instance.country_id:
            country_obj = CountryMas.objects.filter(id=self.instance.country_id).first()
            if country_obj:
                self.fields["country"].initial = country_obj

    def save(self, commit=True):
        instance = super().save(commit=False)
        if self.cleaned_data.get("country"):
            instance.country_id = self.cleaned_data["country"].id
        if commit:
            instance.save()
        return instance


@admin.register(StateMas)
class StateAdmin(admin.ModelAdmin):
    form = StateAdminForm
    list_display = ("id", "name", "shortname", "country_id", "active", "created_at")
    list_filter = ("active", "country_id")
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


class CityAdminForm(forms.ModelForm):
    state = forms.ModelChoiceField(
        queryset=StateMas.objects.all(),
        required=True,
        label="State"
    )

    class Meta:
        model = CityMas
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk and self.instance.state_id:
            state_obj = StateMas.objects.filter(id=self.instance.state_id).first()
            if state_obj:
                self.fields["state"].initial = state_obj

    def save(self, commit=True):
        instance = super().save(commit=False)
        if self.cleaned_data.get("state"):
            instance.state_id = self.cleaned_data["state"].id
        if commit:
            instance.save()
        return instance


@admin.register(CityMas)
class CityAdmin(admin.ModelAdmin):
    form = CityAdminForm
    list_display = ("id", "name", "shortname", "state_id", "active", "created_at")
    list_filter = ("active", "state_id")
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(TitleMas)
class TitleAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(GradeMas)
class GradeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(GroupMas)
class GroupAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(CategoryMas)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(ReligionMas)
class ReligionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(RelationMas)
class RelationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(OccupationMas)
class OccupationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(BankMas)
class BankAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "shortname", "cardservicecharge", "active",
        "admin_id", "created_at", "altered_at",
    )
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(SystemCounterMas)
class SystemCounterAdmin(admin.ModelAdmin):
    list_display = (
        "id", "location_id", "counter_id", "counter_type", "admin_id", "created_at",
    )
    list_filter = ("location_id", "counter_type")
    search_fields = ("counter_type",)
    ordering = ("-created_at",)


@admin.register(SystemCounterDet)
class SystemCounterDetAdmin(admin.ModelAdmin):
    list_display = (
        "id", "location_id", "counter_id", "system_id", "counter_type",
    )
    list_filter = ("location_id", "counter_type")
    search_fields = ("counter_id", "system_id")


@admin.register(SystemMas)
class SystemMasAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "short_name", "location_id", "floor_id", "mac_id",
        "active", "allow_scheme", "admin_id", "created_at",
    )
    list_filter = ("active", "allow_scheme")
    search_fields = ("name", "short_name", "mac_id")
    ordering = ("-created_at",)


@admin.register(TaxTypeMas)
class TaxTypeAdmin(admin.ModelAdmin):
    list_display = (
        "id", "entry_type", "name", "short_name", "tax_percent", "include",
        "is_discount", "allow_purchase", "allow_sales", "active", "admin_id", "created_at",
    )
    list_filter = (
        "entry_type", "active", "include", "is_discount", "allow_purchase", "allow_sales",
    )
    search_fields = ("name", "short_name", "commodity_code", "acc_head_name")
    ordering = ("-created_at",)


@admin.register(CounterMas)
class CounterAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "short_name", "location_id", "counter_group_id",
        "section_code", "counter_order", "active", "admin_id", "created_at",
    )
    list_filter = ("active", "location_id", "counter_group_id")
    search_fields = ("name", "short_name")
    ordering = ("-created_at",)


@admin.register(CounterGroupMas)
class CounterGroupAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "shortname", "location_id", "active", "admin_id", "created_at",
    )
    list_filter = ("active", "location_id")
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(IncomeAndExpenseMas)
class IncomeAndExpenseAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "shortname", "account_head_name", "account_head_code",
        "active", "head_type", "account_post", "admin_id", "created_at",
    )
    list_filter = ("active", "head_type", "account_post")
    search_fields = ("name", "shortname", "account_head_name")
    ordering = ("name",)


@admin.register(GiftvoucherMas)
class GiftvoucherAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(PaymentModeMas)
class PaymentModeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(DiscountTypeMas)
class DiscountTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "shortname", "discper", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(DepartmentMas)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "shortname", "perdaycommission", "active", "admin_id", "created_at",
    )
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(FloorMas)
class FloorAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "shortname", "get_location_id", "active", "admin_id", "created_at",
    )
    list_filter = ("active",)
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)

    def get_location_id(self, obj):
        return obj.location_id
    get_location_id.short_description = "Location ID"


@admin.register(TransferModeMas)
class TransferModeAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "shortname", "active", "numgeneration", "admin_id", "created_at",
    )
    list_filter = ("active", "numgeneration")
    search_fields = ("name", "shortname")
    ordering = ("-created_at",)


@admin.register(StarMas)
class StarAdmin(admin.ModelAdmin):
    list_display = ("id", "starname", "starvalue", "active", "admin_id", "created_at")
    list_filter = ("active",)
    search_fields = ("starname",)
    ordering = ("-created_at",)


@admin.register(EmployeeMas)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "short_name", "location_code", "department_code",
        "floor_code", "active", "created_at",
    )
    search_fields = ("name", "short_name", "mobile", "email")
    list_filter = ("active", "location_code", "department_code")
    ordering = ("-created_at",)

