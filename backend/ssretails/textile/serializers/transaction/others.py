"""
textile/serializers/transaction/others.py
Serializers for Transaction -> Others Suite:
- DayBook / Cash Balance
- Courier Inward
- Cash Drawer Denomination
- Sales Man Edit
- Template Clear Off
"""
from rest_framework import serializers
from textile.models.transaction.others import (
    DailyExpenses,
    TransCourierInwardMas,
    TransCourierInwardDet,
    TransDenomination,
    TransSalesTemplateDet,
    TransPurchaseTemplateMas,
)
from textile.models.master.general import IncomeAndExpenseMas, EmployeeMas
from textile.models.master.intractors import CourierMas


class DailyExpensesSerializer(serializers.ModelSerializer):
    expense_name = serializers.SerializerMethodField()
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = DailyExpenses
        fields = [
            'expense_code',
            'expense_name',
            'location_code',
            'entry_date',
            'company_code',
            'counter_code',
            'particulars',
            'credit',
            'debit',
            'employee_code',
            'employee_name',
            'printed',
            'user_id',
        ]

    def get_expense_name(self, obj):
        if obj.expense_code:
            h = IncomeAndExpenseMas.objects.using('default').filter(code=obj.expense_code).first()
            if h:
                return h.name
        return ""

    def get_employee_name(self, obj):
        if obj.employee_code:
            emp = EmployeeMas.objects.using('default').filter(id=obj.employee_code).first()
            if emp:
                return emp.name
        return ""


class CourierInwardItemSerializer(serializers.Serializer):
    courier_code = serializers.IntegerField(default=0)
    courier_name = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    courier_type = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    courier_from = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    from_name = serializers.CharField(max_length=200, required=False, allow_blank=True, default='')
    pod_no = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    pod_date = serializers.DateTimeField(required=False, allow_null=True)
    employee_code = serializers.IntegerField(default=0)
    hand_over_to = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    remarks = serializers.CharField(max_length=200, required=False, allow_blank=True, default='')


class CourierInwardSaveSerializer(serializers.Serializer):
    location_code = serializers.IntegerField(default=1)
    entry_date = serializers.DateTimeField(required=False, allow_null=True)
    items = CourierInwardItemSerializer(many=True)


class CashDrawerDenominationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransDenomination
        fields = [
            'code',
            'entry_date',
            'entry_type',
            'amount',
            'amt_count',
            'user_id',
            'confirmed',
            'location_code',
            'particulars',
            'denomination_type',
            'income_or_expense_code',
        ]


class SalesManLineItemSerializer(serializers.Serializer):
    barcode = serializers.CharField(max_length=50)
    particulars = serializers.CharField(max_length=200, required=False, allow_blank=True, default='')
    salesman_code = serializers.IntegerField(default=0)
    salesman_name = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    qty = serializers.IntegerField(default=1)
    amount = serializers.DecimalField(max_digits=18, decimal_places=5, default=0)
    new_salesman_code = serializers.IntegerField(required=False, default=0)


class SalesManUpdateSerializer(serializers.Serializer):
    entry_no = serializers.CharField(max_length=30)
    items = serializers.ListField(child=serializers.DictField())


class TemplateClearOffActionSerializer(serializers.Serializer):
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    include_uncancelled = serializers.BooleanField(default=False)
    sales_invoice_cancel = serializers.BooleanField(default=False)
