"""
textile/views/transaction/loyalitycard.py
Views for Loyalty Card transactions:
- LoyaltyCardUpdateViewSet (Issue, Block, Merge on Trans_LoyaltyCard_Det)
- ManualEntryCancelViewSet (Cancel Redemption or Manual Points entries)
"""
from django.utils import timezone
from django.utils.dateparse import parse_datetime, parse_date
from datetime import datetime
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from textile.models.transaction.loyalitycard import (
    TransLoyaltyCardMas,
    TransLoyaltyCardDet,
    TransLoyaltyRedemptionMas,
    TransLoyaltyPointsMas,
    TransLoyaltyPointsDet,
)
from textile.models.master.intractors import CustomerMas
from textile.models.master.general import EmployeeMas
from textile.serializers.transaction.loyalitycard import (
    TransLoyaltyCardDetSerializer,
    LoyaltyCardUpdateActionSerializer,
    TransLoyaltyRedemptionMasSerializer,
    TransLoyaltyPointsMasSerializer,
    ManualCancelActionSerializer,
)


class LoyaltyCardUpdateViewSet(viewsets.ModelViewSet):
    """
    Handles Loyalty Card Lookup and Status Updates (Issue, Block, Merge).
    Operates on GANESHSSRETAILTRAN.dbo.Trans_LoyaltyCard_Det.
    """
    queryset = TransLoyaltyCardDet.objects.using('transaction').all()
    serializer_class = TransLoyaltyCardDetSerializer

    @action(detail=False, methods=['get'], url_path='lookup')
    def card_lookup(self, request):
        card_no = request.query_params.get('card_no', '').strip()
        if not card_no:
            return Response({'success': False, 'message': 'Card number is required.'}, status=status.HTTP_400_BAD_REQUEST)

        card = TransLoyaltyCardDet.objects.using('transaction').filter(loyalty_card_no=card_no).first()
        if not card:
            return Response({
                'success': True,
                'found': False,
                'message': f'Card {card_no} not found in database.',
                'card': None
            })

        customer_name = ""
        if card.customer_code:
            cust = CustomerMas.objects.using('default').filter(id=card.customer_code).first()
            if cust:
                customer_name = cust.name

        return Response({
            'success': True,
            'found': True,
            'card': {
                'loyalty_card_no': card.loyalty_card_no,
                'issued': card.issued,
                'issued_date': card.issued_date,
                'customer_code': card.customer_code,
                'customer_name': customer_name,
                'cancel': card.cancel,  # 1 = Blocked
                'is_merge': card.is_merge,
                'merge_card_no': card.merge_card_no or '',
                'reason': card.reason or '',
                'valid_days': card.valid_days,
            }
        })

    @action(detail=False, methods=['post'], url_path='update-card')
    def update_card(self, request):
        serializer = LoyaltyCardUpdateActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        option = data['option']
        card_no = data['loyalty_card_no']
        date_val = data.get('date') or timezone.now()
        customer_code = data.get('customer_code', 0)
        customer_name = data.get('customer_name', '').strip()
        merge_card_no = data.get('merge_card_no', '').strip()
        reason = data.get('reason', '').strip()
        user_id = data.get('user_id', 1)

        # If customer_name was typed or searched, resolve customer_code if needed
        if not customer_code and customer_name:
            cust = CustomerMas.objects.using('default').filter(name__iexact=customer_name).first()
            if cust:
                customer_code = cust.id

        card = TransLoyaltyCardDet.objects.using('transaction').filter(loyalty_card_no=card_no).first()
        if not card:
            # If not existing, create a new card entry in Trans_LoyaltyCard_Det
            card = TransLoyaltyCardDet(
                loyalty_card_no=card_no,
                location_code=1,
                entry_order_id=1,
                valid_days=365,
                issued=0,
                cancel=0,
                is_merge=False
            )

        if option == 'Issue':
            card.issued = 1
            card.issued_date = date_val
            card.customer_code = customer_code
            card.reason = reason or "Card Issued"
        elif option == 'Block':
            card.cancel = 1
            card.cancel_user_id = user_id
            card.cancel_user_entry_date_time = date_val
            card.reason = reason or "Card Blocked"
        elif option == 'Merge':
            if not merge_card_no:
                return Response(
                    {'success': False, 'message': 'Destination Merge CardNo is required for Merge option.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            card.is_merge = True
            card.merge_card_no = merge_card_no
            card.merge_user_id = user_id
            card.merge_entry_date_time = date_val
            card.reason = reason or "Card Merged"

        card.save(using='transaction')

        return Response({
            'success': True,
            'message': f'Loyalty Card {card_no} updated successfully with option: {option}.',
            'card': {
                'loyalty_card_no': card.loyalty_card_no,
                'option': option,
                'issued': card.issued,
                'cancel': card.cancel,
                'is_merge': card.is_merge,
                'merge_card_no': card.merge_card_no,
                'reason': card.reason,
            }
        })


class ManualEntryCancelViewSet(viewsets.ViewSet):
    """
    Handles Manual Entry Cancellation for:
    - Redemption (Trans_Loyalty_Redemption_Mas)
    - Manual Points (Trans_LoyaltyPoints_Mas / Trans_LoyaltyPoints_Det)
    """

    @action(detail=False, methods=['get'], url_path='candidate-entries')
    def candidate_entries(self, request):
        cancel_type = request.query_params.get('type', 'Redemption').strip()

        if cancel_type.lower() == 'redemption':
            entries = (
                TransLoyaltyRedemptionMas.objects.using('transaction')
                .filter(cancel=False)
                .order_by('-entry_date')[:100]
            )
            data = []
            for item in entries:
                cust_name = ""
                if item.customer_code:
                    cust = CustomerMas.objects.using('default').filter(id=item.customer_code).first()
                    if cust:
                        cust_name = cust.name
                
                date_str = item.entry_date.strftime('%d/%m/%Y') if item.entry_date else ''
                pts = float(item.redemption_points)
                display_label = f"Voucher: {item.entry_no} | Card: {item.loyalty_card_no or 'N/A'} | Pts: {pts:.0f} | Date: {date_str}"
                data.append({
                    'entry_id': item.entry_id,
                    'entry_no': item.entry_no,
                    'entry_date': item.entry_date,
                    'customer_code': item.customer_code,
                    'customer_name': cust_name,
                    'loyalty_card_no': item.loyalty_card_no,
                    'points': pts,
                    'display': display_label,
                })
            return Response(data)

        elif cancel_type.lower() == 'manual':
            entries = (
                TransLoyaltyPointsMas.objects.using('transaction')
                .filter(cancel=0)
                .order_by('-entry_date')[:100]
            )
            data = []
            for item in entries:
                date_str = item.entry_date.strftime('%d/%m/%Y') if item.entry_date else ''
                display_label = f"Entry: {item.entry_no or item.entry_id} | Scheme: {item.loyality_name or 'Manual Points'} | Date: {date_str}"
                data.append({
                    'entry_id': item.entry_id,
                    'entry_no': item.entry_no or item.entry_id,
                    'entry_date': item.entry_date,
                    'loyality_name': item.loyality_name or '',
                    'value_per_points': float(item.value_per_points),
                    'display': display_label,
                })
            return Response(data)

        return Response({'success': False, 'message': f'Unknown cancel type: {cancel_type}'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='cancel-entry')
    def cancel_entry(self, request):
        serializer = ManualCancelActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        cancel_type = data['cancel_type']
        entry_id = data['entry_id']
        user_id = data.get('user_id', 1)
        cancel_date = data.get('cancel_date') or timezone.now()

        if cancel_type == 'Redemption':
            count = (
                TransLoyaltyRedemptionMas.objects.using('transaction')
                .filter(entry_id=entry_id)
                .update(
                    cancel=True,
                    cancel_user_id=user_id,
                    cancel_user_entry_date_time=cancel_date
                )
            )
            if count == 0:
                return Response(
                    {'success': False, 'message': f'Redemption entry {entry_id} not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response({'success': True, 'message': f'Redemption entry {entry_id} cancelled successfully.'})

        elif cancel_type == 'Manual':
            count = (
                TransLoyaltyPointsMas.objects.using('transaction')
                .filter(entry_id=entry_id)
                .update(
                    cancel=1,
                    cancel_user_id=user_id,
                    cancel_user_entry_date_time=cancel_date
                )
            )
            TransLoyaltyPointsDet.objects.using('transaction').filter(entry_id=entry_id).update(
                cancel=1,
                cancel_user_id=user_id,
                cancel_user_entry_date_time=cancel_date
            )
            if count == 0:
                return Response(
                    {'success': False, 'message': f'Manual points entry {entry_id} not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response({'success': True, 'message': f'Manual points entry {entry_id} cancelled successfully.'})

        return Response({'success': False, 'message': f'Invalid type: {cancel_type}'}, status=status.HTTP_400_BAD_REQUEST)
