"""
textile/views/transaction/others.py
Views for Transaction -> Others Suite:
- DayBookViewSet (Cash Balance / Daily Expenses)
- CourierInwardViewSet (Courier Inward Header & Details)
- CashDrawerDenominationViewSet (Counter Denomination)
- SalesManEditViewSet (Lookup Sales Bill and update Salesman on line items)
- TemplateClearOffViewSet (Clear temporary draft templates)
"""
from django.utils import timezone
from django.db import connections, transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

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
from textile.serializers.transaction.others import (
    DailyExpensesSerializer,
    CourierInwardSaveSerializer,
    CashDrawerDenominationSerializer,
    SalesManUpdateSerializer,
    TemplateClearOffActionSerializer,
)


class DayBookViewSet(viewsets.ViewSet):
    """
    Day Book / Cash Balance
    Queries and logs daily expenses and cash balance in GANESHSSRETAILTRAN.dbo.DailyExpenses.
    """

    @action(detail=False, methods=['get'], url_path='query-daybook')
    def query_daybook(self, request):
        date_str = request.query_params.get('date', '').strip()
        location_code = request.query_params.get('location_code')
        company_code = request.query_params.get('company_code')
        counter_code = request.query_params.get('counter_code')

        qs = DailyExpenses.objects.using('transaction').all()
        if date_str:
            try:
                qs = qs.filter(entry_date__date=date_str)
            except Exception:
                pass
        if location_code and int(location_code) > 0:
            qs = qs.filter(location_code=int(location_code))
        if company_code and int(company_code) > 0:
            qs = qs.filter(company_code=int(company_code))
        if counter_code and int(counter_code) > 0:
            qs = qs.filter(counter_code=int(counter_code))

        items = []
        total_debit = 0.0
        total_credit = 0.0

        for row in qs[:200]:
            exp_name = ""
            if row.expense_code:
                h = IncomeAndExpenseMas.objects.using('default').filter(code=row.expense_code).first()
                if h:
                    exp_name = h.name

            emp_name = ""
            if row.employee_code:
                emp = EmployeeMas.objects.using('default').filter(id=row.employee_code).first()
                if emp:
                    emp_name = emp.name

            dr = float(row.debit)
            cr = float(row.credit)
            total_debit += dr
            total_credit += cr

            items.append({
                'expense_code': row.expense_code,
                'expense_name': exp_name or f"Head #{row.expense_code}",
                'particulars': row.particulars or '',
                'employee_code': row.employee_code,
                'employee_name': emp_name or '',
                'debit': dr,
                'credit': cr,
                'printed': bool(row.printed),
            })

        closing_balance = total_credit - total_debit

        return Response({
            'success': True,
            'items': items,
            'total_debit': total_debit,
            'total_credit': total_credit,
            'closing_balance': closing_balance,
        })

    @action(detail=False, methods=['post'], url_path='save-entry')
    def save_entry(self, request):
        data = request.data
        entry_date = data.get('entry_date') or timezone.now()
        location_code = int(data.get('location_code', 1))
        company_code = int(data.get('company_code', 1))
        counter_code = int(data.get('counter_code', 0))
        expense_code = int(data.get('expense_code', 0))
        particulars = data.get('particulars', '').strip()
        debit = float(data.get('debit', 0))
        credit = float(data.get('credit', 0))
        employee_code = int(data.get('employee_code', 0))
        printed = 1 if data.get('printed') else 0
        user_id = int(data.get('user_id', 1))

        DailyExpenses.objects.using('transaction').create(
            location_code=location_code,
            entry_date=entry_date,
            company_code=company_code,
            counter_code=counter_code,
            expense_code=expense_code,
            particulars=particulars,
            debit=debit,
            credit=credit,
            employee_code=employee_code,
            printed=printed,
            user_id=user_id,
            uploaded=0
        )

        return Response({'success': True, 'message': 'Cash entry saved successfully.'})


class CourierInwardViewSet(viewsets.ViewSet):
    """
    Courier Inward Entry
    Logs incoming courier parcels into Trans_CourierInward_Mas and Det.
    """

    @action(detail=False, methods=['get'], url_path='next-entry-no')
    def next_entry_no(self, request):
        location_code = int(request.query_params.get('location_code', 1))
        count = TransCourierInwardMas.objects.using('transaction').filter(location_code=location_code).count()
        next_no = f"CI-{count + 1:05d}"
        return Response({'next_entry_no': next_no})

    @action(detail=False, methods=['post'], url_path='save-inward')
    def save_inward(self, request):
        serializer = CourierInwardSaveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        location_code = data['location_code']
        entry_date = data.get('entry_date') or timezone.now()
        items = data['items']

        with transaction.atomic(using='transaction'):
            count = TransCourierInwardMas.objects.using('transaction').filter(location_code=location_code).count()
            entry_no = f"CI-{count + 1:05d}"
            entry_id = f"CI-{location_code}-{count + 1:05d}"

            TransCourierInwardMas.objects.using('transaction').create(
                entry_id=entry_id,
                entry_no=entry_no,
                entry_date=entry_date,
                location_code=location_code,
                user_id=1,
                cancel=0
            )

            for idx, it in enumerate(items, 1):
                pod_dt = it.get('pod_date') or entry_date
                TransCourierInwardDet.objects.using('transaction').create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    entry_order_id=idx,
                    courier_code=it.get('courier_code', 0),
                    courier_type=it.get('courier_type', ''),
                    courier_from=it.get('courier_from', ''),
                    from_name=it.get('from_name', ''),
                    pod_no=it.get('pod_no', ''),
                    pod_date=pod_dt,
                    employee_code=it.get('employee_code', 0),
                    remarks=it.get('remarks', ''),
                    location_code=location_code,
                    cancel=False
                )

        return Response({
            'success': True,
            'message': f'Courier Inward {entry_no} saved successfully.',
            'entry_no': entry_no,
            'entry_id': entry_id,
        })


class CashDrawerDenominationViewSet(viewsets.ViewSet):
    """
    Cash Drawer Denomination
    Handles counter-wise and system-wise cash drawer totals and denomination records.
    """

    @action(detail=False, methods=['get'], url_path='load-counter-details')
    def load_counter_details(self, request):
        location_code = int(request.query_params.get('location_code', 1))
        date_str = request.query_params.get('date', '').strip()

        # Query counter denominations
        qs = TransDenomination.objects.using('transaction').filter(location_code=location_code)
        if date_str:
            try:
                qs = qs.filter(entry_date__date=date_str)
            except Exception:
                pass

        counters = {}
        for row in qs:
            c_name = row.particulars or f"Counter #{row.code}"
            if c_name not in counters:
                counters[c_name] = {'net_total': 0.0, 'expenses': 0.0}
            if row.denomination_type:
                counters[c_name]['expenses'] += float(row.amount)
            else:
                counters[c_name]['net_total'] += float(row.amount)

        # Standard default grid if no recorded counts yet
        details = [
            {'particulars': 'Net Total', 'ground': counters.get('GROUND', {}).get('net_total', 0.0), 'total': sum(c['net_total'] for c in counters.values())},
            {'particulars': 'Expenses', 'ground': counters.get('GROUND', {}).get('expenses', 0.0), 'total': sum(c['expenses'] for c in counters.values())},
        ]

        return Response({'success': True, 'details': details})

    @action(detail=False, methods=['post'], url_path='save-denomination')
    def save_denomination(self, request):
        data = request.data
        location_code = int(data.get('location_code', 1))
        entry_date = data.get('entry_date') or timezone.now()
        code = int(data.get('code', 1))
        entry_type = data.get('entry_type', 'Counter')
        amount = float(data.get('amount', 0))
        amt_count = int(data.get('amt_count', 0))
        particulars = data.get('particulars', '')
        income_or_expense_code = int(data.get('income_or_expense_code', 0))

        TransDenomination.objects.using('transaction').create(
            code=code,
            entry_date=entry_date,
            entry_type=entry_type,
            amount=amount,
            amt_count=amt_count,
            particulars=particulars,
            location_code=location_code,
            income_or_expense_code=income_or_expense_code,
            user_id=1,
            confirmed=True
        )

        return Response({'success': True, 'message': 'Denomination saved successfully.'})


class SalesManEditViewSet(viewsets.ViewSet):
    """
    Sales Man Edit
    Queries sales bill lines and reassigns salesman.
    """

    @action(detail=False, methods=['get'], url_path='lookup-bill')
    def lookup_bill(self, request):
        location_code = request.query_params.get('location_code', 1)
        entry_no = request.query_params.get('entry_no', '').strip()
        date_str = request.query_params.get('date', '').strip()

        if not entry_no:
            return Response({'success': False, 'message': 'EntryNo is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Query Trans_Sales_Det directly using SQL
        query = """
            SELECT 
                ISNULL(d.Barcode, '') AS Barcode,
                ISNULL(d.Description, 'Sales Item') AS Particulars,
                ISNULL(d.SalesMan1Code, 0) AS SalesManCode,
                ISNULL(emp.Name, '') AS SalesManName,
                ISNULL(d.Qty, 1) AS Qty,
                ISNULL(d.NetAmount, ISNULL(d.Amount, 0)) AS Amount
            FROM Trans_Sales_Det d WITH (NOLOCK)
            LEFT JOIN GANESHSSRETAIL.dbo.EmployeeMas emp WITH (NOLOCK) ON emp.Code = d.SalesMan1Code
            WHERE d.Entryno = %s
        """
        items = []
        with connections['transaction'].cursor() as cursor:
            cursor.execute(query, [entry_no])
            rows = cursor.fetchall()
            for r in rows:
                items.append({
                    'barcode': r[0],
                    'particulars': r[1],
                    'salesman_code': r[2],
                    'salesman_name': r[3] or f"Salesman #{r[2]}",
                    'qty': int(r[4]),
                    'amount': float(r[5]),
                    'new_salesman_code': r[2],
                })

        return Response({
            'success': True,
            'entry_no': entry_no,
            'items': items,
        })

    @action(detail=False, methods=['post'], url_path='update-salesman')
    def update_salesman(self, request):
        serializer = SalesManUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        entry_no = serializer.validated_data['entry_no']
        items = serializer.validated_data['items']

        with connections['transaction'].cursor() as cursor:
            for it in items:
                bcode = it.get('barcode')
                new_sm = int(it.get('new_salesman_code', 0))
                if bcode and new_sm > 0:
                    cursor.execute(
                        "UPDATE Trans_Sales_Det SET SalesMan1Code = %s WHERE Entryno = %s AND Barcode = %s",
                        [new_sm, entry_no, bcode]
                    )

        return Response({
            'success': True,
            'message': f'Salesman updated for bill {entry_no}.'
        })


class TemplateClearOffViewSet(viewsets.ViewSet):
    """
    Template Clear Off
    Clears temporary / draft sales and purchase templates in selected date window.
    """

    @action(detail=False, methods=['post'], url_path='clear-templates')
    def clear_templates(self, request):
        serializer = TemplateClearOffActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        from_date = serializer.validated_data['from_date']
        to_date = serializer.validated_data['to_date']
        include_uncancelled = serializer.validated_data['include_uncancelled']
        sales_invoice_cancel = serializer.validated_data['sales_invoice_cancel']

        sales_qs = TransSalesTemplateDet.objects.using('transaction').filter(
            entry_date__date__range=[from_date, to_date]
        )
        if not include_uncancelled:
            sales_qs = sales_qs.filter(cancel=True)

        pur_qs = TransPurchaseTemplateMas.objects.using('transaction').filter(
            entry_date__date__range=[from_date, to_date]
        )
        if not include_uncancelled:
            pur_qs = pur_qs.filter(cancel=1)

        deleted_sales, _ = sales_qs.delete()
        deleted_pur, _ = pur_qs.delete()

        return Response({
            'success': True,
            'message': f'Cleared {deleted_sales} sales templates and {deleted_pur} purchase templates between {from_date} and {to_date}.',
            'cleared_sales': deleted_sales,
            'cleared_purchase': deleted_pur,
        })
