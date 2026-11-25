"""
textile/views/transaction/settlement.py
Views for Settlement transactions:
- SettlementCancelViewSet (Query active settlements & cancel settlement with linked sales bills)
- ManualVoucherCancelViewSet (Query active manual vouchers & cancel manual settlement vouchers)
"""
from django.utils import timezone
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from textile.models.transaction.settlement import (
    TransSettlementMas,
    TransSettlementDet,
    TransSettlementSalesBillDet,
    TransSettlementVoucherMas,
)
from textile.models.master.general import EmployeeMas
from textile.serializers.transaction.settlement import (
    TransSettlementMasSerializer,
    TransSettlementSalesBillDetSerializer,
    TransSettlementVoucherMasSerializer,
    SettlementCancelActionSerializer,
    ManualVoucherCancelActionSerializer,
)


class SettlementCancelViewSet(viewsets.ViewSet):
    """
    Handles Settlement Cancellation:
    - Lists active settlements for a chosen date
    - Fetches bill details and summary discounts/roundoff
    - Cancels settlement and marks sales bills as un-settled
    """

    @action(detail=False, methods=['get'], url_path='active-settlements')
    def active_settlements(self, request):
        date_str = request.query_params.get('date', '').strip()
        qs = TransSettlementMas.objects.using('transaction').filter(cancel=False)

        if date_str:
            try:
                # Filter by date component
                qs = qs.filter(entry_date__date=date_str)
            except Exception:
                pass

        results = []
        for s in qs.order_by('-entry_date', '-entry_no')[:100]:
            results.append({
                'entry_id': s.entry_id,
                'entry_no': s.entry_no,
                'entry_date': s.entry_date.strftime('%d/%m/%Y') if s.entry_date else '',
                'net_amount': float(s.net_amount),
                'disc_amt': float(s.disc_amt),
                'round_off': float(s.round_off),
                'display': f"{s.entry_no} (Net: {float(s.net_amount):.2f})",
            })
        return Response(results)

    @action(detail=False, methods=['get'], url_path='settlement-details')
    def settlement_details(self, request):
        entry_id = request.query_params.get('entry_id', '').strip()
        entry_no = request.query_params.get('entry_no', '').strip()

        if not entry_id and not entry_no:
            return Response({'success': False, 'message': 'entry_id or entry_no required.'}, status=status.HTTP_400_BAD_REQUEST)

        mas = None
        if entry_id:
            mas = TransSettlementMas.objects.using('transaction').filter(entry_id=entry_id).first()
        elif entry_no:
            mas = TransSettlementMas.objects.using('transaction').filter(entry_no=entry_no).first()

        if not mas:
            return Response({'success': False, 'message': 'Settlement not found.'}, status=status.HTTP_404_NOT_FOUND)

        bills = TransSettlementSalesBillDet.objects.using('transaction').filter(
            entry_id=mas.entry_id, cancel=False
        ).order_by('entry_order_id')

        bills_data = []
        for b in bills:
            date_fmt = b.sales_entry_date.strftime('%d/%m/%Y') if b.sales_entry_date else ''
            bills_data.append({
                'bill_no': b.sales_entry_no,
                'entry_date': date_fmt,
                'amount': float(b.bill_amount) if b.bill_amount else 0.0,
            })

        return Response({
            'success': True,
            'header': {
                'entry_id': mas.entry_id,
                'entry_no': mas.entry_no,
                'entry_date': mas.entry_date.strftime('%d/%m/%Y') if mas.entry_date else '',
                'disc_amt': float(mas.disc_amt),
                'round_off': float(mas.round_off),
                'net_amount': float(mas.net_amount),
            },
            'bills': bills_data,
        })

    @action(detail=False, methods=['post'], url_path='cancel-settlement')
    def cancel_settlement(self, request):
        serializer = SettlementCancelActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        entry_id = data['entry_id']
        user_id = data.get('user_id', 1)
        cancel_date = data.get('cancel_date') or timezone.now()

        with transaction.atomic(using='transaction'):
            mas_count = (
                TransSettlementMas.objects.using('transaction')
                .filter(entry_id=entry_id)
                .update(
                    cancel=True,
                    cancel_user_id=user_id,
                    cancel_user_entry_date_time=cancel_date
                )
            )
            if mas_count == 0:
                return Response({'success': False, 'message': f'Settlement {entry_id} not found.'}, status=status.HTTP_404_NOT_FOUND)

            TransSettlementSalesBillDet.objects.using('transaction').filter(entry_id=entry_id).update(cancel=True)

        return Response({
            'success': True,
            'message': f'Settlement {entry_id} cancelled successfully.'
        })


class ManualVoucherCancelViewSet(viewsets.ViewSet):
    """
    Handles Manual Settlement Voucher Cancellation:
    - Lists active non-cancelled vouchers for chosen date
    - Fetches cashier and issue settlement details
    - Cancels manual settlement voucher
    """

    @action(detail=False, methods=['get'], url_path='active-vouchers')
    def active_vouchers(self, request):
        date_str = request.query_params.get('date', '').strip()
        qs = TransSettlementVoucherMas.objects.using('transaction').filter(cancel=0)

        if date_str:
            try:
                qs = qs.filter(entry_date__date=date_str)
            except Exception:
                pass

        results = []
        for v in qs.order_by('-entry_date', '-entry_no')[:100]:
            results.append({
                'entry_id': v.entry_id,
                'entry_no': v.entry_no or v.entry_id,
                'entry_date': v.entry_date.strftime('%d/%m/%Y') if v.entry_date else '',
                'voucher_amount': float(v.voucher_amount),
                'display': f"{v.entry_no or v.entry_id} (Amt: {float(v.voucher_amount):.2f})",
            })
        return Response(results)

    @action(detail=False, methods=['get'], url_path='voucher-details')
    def voucher_details(self, request):
        entry_id = request.query_params.get('entry_id', '').strip()
        entry_no = request.query_params.get('entry_no', '').strip()

        if not entry_id and not entry_no:
            return Response({'success': False, 'message': 'entry_id or entry_no required.'}, status=status.HTTP_400_BAD_REQUEST)

        v = None
        if entry_id:
            v = TransSettlementVoucherMas.objects.using('transaction').filter(entry_id=entry_id).first()
        elif entry_no:
            v = TransSettlementVoucherMas.objects.using('transaction').filter(entry_no=entry_no).first()

        if not v:
            return Response({'success': False, 'message': 'Manual voucher not found.'}, status=status.HTTP_404_NOT_FOUND)

        cashier_name = ""
        if v.issue_cashier_code:
            emp = EmployeeMas.objects.using('default').filter(id=v.issue_cashier_code).first()
            if emp:
                cashier_name = emp.name

        date_fmt = v.issue_settlement_date.strftime('%d/%m/%Y') if v.issue_settlement_date else ''

        return Response({
            'success': True,
            'voucher': {
                'entry_id': v.entry_id,
                'entry_no': v.entry_no,
                'entry_date': v.entry_date.strftime('%d/%m/%Y') if v.entry_date else '',
                'cashier_name': cashier_name,
                'issue_settlement_no': v.issue_settlement_no or '',
                'issue_settlement_date': date_fmt,
                'voucher_amount': float(v.voucher_amount),
            }
        })

    @action(detail=False, methods=['post'], url_path='cancel-voucher')
    def cancel_voucher(self, request):
        serializer = ManualVoucherCancelActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        entry_id = data['entry_id']
        user_id = data.get('user_id', 1)
        cancel_date = data.get('cancel_date') or timezone.now()

        count = (
            TransSettlementVoucherMas.objects.using('transaction')
            .filter(entry_id=entry_id)
            .update(
                cancel=1,
                cancel_user_id=user_id,
                cancel_user_entry_date_time=cancel_date
            )
        )
        if count == 0:
            return Response({'success': False, 'message': f'Manual voucher {entry_id} not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'success': True,
            'message': f'Manual voucher {entry_id} cancelled successfully.'
        })
