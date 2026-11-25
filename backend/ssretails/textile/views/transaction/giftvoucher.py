"""
textile/views/transaction/giftvoucher.py
Views for Gift Voucher transactions:
- GiftVoucherIssueViewSet (Issue creation, denomination calculation, SP execution)
- GiftVoucherCancelViewSet (Cancel issued vouchers via SPTRANS_GIFTVOUCHERISSUE_MAS)
"""
from django.utils import timezone
from django.db import connections, transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from textile.models.transaction.giftvoucher import (
    TransGiftVoucherIssueMas,
    TransGiftVoucherIssueDet,
    TransGiftVoucherIssueDetailDet,
    TransGiftVoucherMas,
    TransGiftVoucherDet,
    TransAdvanceMas,
    TransAdvanceDet,
)
from textile.models.master.intractors import CustomerMas
from textile.models.master.location import LocationMas
from textile.models.master.general import EmployeeMas
from textile.models.master.general import GiftvoucherMas as MasterGiftvoucherMas
from textile.serializers.transaction.giftvoucher import (
    TransGiftVoucherIssueMasSerializer,
    GiftVoucherIssueSaveSerializer,
    GiftVoucherCancelActionSerializer,
)


class GiftVoucherIssueViewSet(viewsets.ModelViewSet):
    """
    Handles Gift Voucher Issue operations:
    - Next Entry Number preview
    - Available Vouchers / Denominations listing
    - Issue submission with SPTRANS_GIFTVOUCHERISSUE_MAS integration
    """
    queryset = TransGiftVoucherIssueMas.objects.using('transaction').all()
    serializer_class = TransGiftVoucherIssueMasSerializer

    @action(detail=False, methods=['get'], url_path='next-entry-no')
    def next_entry_no(self, request):
        location_code = int(request.query_params.get('location_code', 1))
        # Format preview sequential entry number
        count = TransGiftVoucherIssueMas.objects.using('transaction').filter(location_code=location_code).count()
        next_no = f"GVI-{count + 1:05d}"
        return Response({'next_entry_no': next_no})

    @action(detail=False, methods=['get'], url_path='master-denominations')
    def master_denominations(self, request):
        """
        Loads denominations from Master database (GiftvoucherMas / GiftRangeMas)
        """
        denominations = MasterGiftvoucherMas.objects.using('default').filter(active=True)
        results = [
            {'code': d.id, 'name': d.name, 'short_name': getattr(d, 'shortname', '')}
            for d in denominations
        ]
        return Response(results)

    @action(detail=False, methods=['post'], url_path='issue-voucher')
    def issue_voucher(self, request):
        serializer = GiftVoucherIssueSaveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        location_code = data['location_code']
        customer_code = data['customer_code']
        is_variable = (data['voucher_type'] == 'Variable')
        entry_date = data.get('entry_date') or timezone.now()
        posted_by = data.get('posted_by', 1)
        disc_per = data.get('disc_per', 0)
        disc_amount = data.get('disc_amount', 0)
        amount = data.get('amount', 0)
        remarks = data.get('remarks', '')
        denominations = data.get('denominations', [])
        settlements = data.get('settlements', [])

        # Total settlement amount
        set_amount = sum(s.get('amount', 0) for s in settlements)

        # Build XML payload for SPTRANS_GIFTVOUCHERISSUE_MAS
        xml_parts = ['<ROOT>']
        xml_parts.append('<UNQFLD><ENTRYID></ENTRYID></UNQFLD>')

        # 1. Denomination bands
        for d in denominations:
            prefix = d.get('prefix', '')
            from_no = d.get('from_no', '')
            to_no = d.get('to_no', '')
            amt = float(d.get('amount', 0))
            days = int(d.get('days', 30))
            xml_parts.append(
                f'<GIFTVOUCHERISSUEDET '
                f'PREFIX="{prefix}" '
                f'FROMNO="{from_no}" '
                f'TONO="{to_no}" '
                f'AMOUNT="{amt:.5f}" '
                f'DAYS="{days}"/>'
            )

        # 2. Individual voucher items
        order_id = 1
        for d in denominations:
            prefix = d.get('prefix', '')
            from_no = d.get('from_no', '')
            to_no = d.get('to_no', '')
            amt = float(d.get('amount', 0))
            days = int(d.get('days', 30))

            # Expand range if numeric
            try:
                start_n = int(from_no)
                end_n = int(to_no)
                count = max(1, end_n - start_n + 1)
                unit_amt = amt / count if count > 0 else amt
                for n in range(start_n, end_n + 1):
                    v_code = f"{prefix}{n}"
                    xml_parts.append(
                        f'<GIFTVOUCHERDETAILDET '
                        f'VOUCHERNO="{v_code}" '
                        f'ENTRYORDERID="{order_id}" '
                        f'AMOUNT="{unit_amt:.5f}" '
                        f'DAYS="{days}"/>'
                    )
                    order_id += 1
            except (ValueError, TypeError):
                v_code = f"{prefix}{from_no}"
                xml_parts.append(
                    f'<GIFTVOUCHERDETAILDET '
                    f'VOUCHERNO="{v_code}" '
                    f'ENTRYORDERID="{order_id}" '
                    f'AMOUNT="{amt:.5f}" '
                    f'DAYS="{days}"/>'
                )
                order_id += 1

        # 3. Advance / Settlement master
        cash_amt = sum(s.get('amount', 0) for s in settlements if s.get('pay_type', '').upper() == 'CASH')
        card_amt = sum(s.get('amount', 0) for s in settlements if s.get('pay_type', '').upper() == 'CARD')
        cheque_amt = sum(s.get('amount', 0) for s in settlements if s.get('pay_type', '').upper() == 'CHEQUE')
        others_amt = sum(s.get('amount', 0) for s in settlements if s.get('pay_type', '').upper() not in ['CASH', 'CARD', 'CHEQUE'])

        xml_parts.append(
            f'<GIFTVOUCHERMAS '
            f'ENTRYTYPE="GIFTISSUE" '
            f'CASH="{cash_amt:.5f}" '
            f'CARD="{card_amt:.5f}" '
            f'CHEQUE="{cheque_amt:.5f}" '
            f'OTHERS="{others_amt:.5f}" '
            f'BALANCE="0.00000" '
            f'TOTALAMOUNT="{set_amount:.5f}" '
            f'CUSTOMERCODE="{customer_code}"/>'
        )

        # 4. Advance / Settlement detail
        for idx, s in enumerate(settlements, 1):
            p_type = s.get('pay_type', 'CASH')
            p_amt = float(s.get('amount', 0))
            ref_no = s.get('reference_no', '')
            bank_code = int(s.get('bank_code', 0))
            xml_parts.append(
                f'<GIFTVOUCHERDET '
                f'ENTRYID="" '
                f'ENTRYORDERID="{idx}" '
                f'PAYTYPE="{p_type}" '
                f'AMOUNT="{p_amt:.5f}" '
                f'DATE="{entry_date.strftime("%Y-%m-%d")}" '
                f'REFERENCENO="{ref_no}" '
                f'BANKCODE="{bank_code}" '
                f'CARDHOLDERNAME=""/>'
            )

        xml_parts.append('</ROOT>')
        details_xml = ''.join(xml_parts)

        # Attempt execution via Stored Procedure SPTRANS_GIFTVOUCHERISSUE_MAS
        try:
            with connections['transaction'].cursor() as cursor:
                # Generate sequence if needed
                count = TransGiftVoucherIssueMas.objects.using('transaction').filter(location_code=location_code).count()
                entry_no = f"GVI-{count + 1:05d}"
                entry_id = f"GVI-{location_code}-{count + 1:05d}"

                sp_sql = """
                    DECLARE @P_ENTRYID VARCHAR(30) = %s;
                    DECLARE @P_ENTRYNO VARCHAR(15) = %s;
                    DECLARE @P_ENTRYDATE DATETIME = %s;
                    DECLARE @P_ERR INT = 0;

                    EXEC [dbo].[SPTRANS_GIFTVOUCHERISSUE_MAS]
                        @MODE = 0,
                        @ENTRYID = @P_ENTRYID OUTPUT,
                        @ENTRYNO = @P_ENTRYNO OUTPUT,
                        @ENTRYDATE = @P_ENTRYDATE OUTPUT,
                        @LOCATIONCODE = %s,
                        @CUSTOMERCODE = %s,
                        @AUTOORMANUAL = %s,
                        @AMOUNT = %s,
                        @DISCPER = %s,
                        @DISCAMOUNT = %s,
                        @USERID = %s,
                        @ERR = @P_ERR OUTPUT,
                        @DETAILS = %s,
                        @REMARKS = %s,
                        @SETAMOUNT = %s;

                    SELECT @P_ENTRYID AS EntryID, @P_ENTRYNO AS EntryNo, @P_ERR AS Err;
                """
                cursor.execute(sp_sql, [
                    entry_id,
                    entry_no,
                    entry_date,
                    location_code,
                    customer_code,
                    1 if is_variable else 0,
                    amount,
                    disc_per,
                    disc_amount,
                    posted_by,
                    details_xml,
                    remarks,
                    set_amount
                ])
                res = cursor.fetchone()
                out_id = res[0] if res and res[0] else entry_id
                out_no = res[1] if res and res[1] else entry_no

                return Response({
                    'success': True,
                    'message': f'Gift voucher issue {out_no} saved successfully.',
                    'entry_no': out_no,
                    'entry_id': out_id,
                })
        except Exception as sp_err:
            # Fallback to atomic Django ORM transaction on 'transaction' database
            with transaction.atomic(using='transaction'):
                count = TransGiftVoucherIssueMas.objects.using('transaction').filter(location_code=location_code).count()
                entry_no = f"GVI-{count + 1:05d}"
                entry_id = f"GVI-{location_code}-{count + 1:05d}"

                mas = TransGiftVoucherIssueMas.objects.using('transaction').create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    location_code=location_code,
                    customer_code=customer_code,
                    auto_or_manual=is_variable,
                    disc_per=disc_per,
                    disc_amount=disc_amount,
                    amount=amount,
                    remarks=remarks,
                    user_id=posted_by
                )

                # Insert denominations
                for d in denominations:
                    TransGiftVoucherIssueDet.objects.using('transaction').create(
                        entry_id=entry_id,
                        entry_no=entry_no,
                        entry_date=entry_date,
                        prefix=d.get('prefix', '') or 'GV',
                        from_voucher_no=d.get('from_no', ''),
                        to_voucher_no=d.get('to_no', ''),
                        days=int(d.get('days', 30)),
                        amount=d.get('amount', 0)
                    )

                # Insert details & update Trans_GiftVoucher_Det inventory
                ord_id = 1
                for d in denominations:
                    pfx = d.get('prefix', '') or 'GV'
                    from_no = d.get('from_no', '')
                    to_no = d.get('to_no', '')
                    amt = float(d.get('amount', 0))
                    dys = int(d.get('days', 30))

                    try:
                        s_n = int(from_no)
                        e_n = int(to_no)
                        cnt = max(1, e_n - s_n + 1)
                        u_amt = amt / cnt if cnt > 0 else amt
                        for n in range(s_n, e_n + 1):
                            v_code = f"{pfx}{n}"
                            TransGiftVoucherIssueDetailDet.objects.using('transaction').create(
                                entry_id=entry_id,
                                entry_no=entry_no,
                                entry_date=entry_date,
                                entry_order_id=ord_id,
                                voucher_no=v_code,
                                days=dys,
                                amount=u_amt
                            )
                            # Update or create in Trans_GiftVoucher_Det
                            TransGiftVoucherDet.objects.using('transaction').update_or_create(
                                voucher_no=v_code,
                                defaults={
                                    'entry_id': entry_id,
                                    'entry_no': entry_no,
                                    'entry_date': entry_date,
                                    'customer_code': customer_code,
                                    'issued': 1,
                                    'issued_user_id': posted_by,
                                    'issued_date': entry_date,
                                    'amount': u_amt,
                                    'issue_entry_id': entry_id,
                                    'days': dys,
                                }
                            )
                            ord_id += 1
                    except (ValueError, TypeError):
                        v_code = f"{pfx}{from_no}"
                        TransGiftVoucherIssueDetailDet.objects.using('transaction').create(
                            entry_id=entry_id,
                            entry_no=entry_no,
                            entry_date=entry_date,
                            entry_order_id=ord_id,
                            voucher_no=v_code,
                            days=dys,
                            amount=amt
                        )
                        TransGiftVoucherDet.objects.using('transaction').update_or_create(
                            voucher_no=v_code,
                            defaults={
                                'entry_id': entry_id,
                                'entry_no': entry_no,
                                'entry_date': entry_date,
                                'customer_code': customer_code,
                                'issued': 1,
                                'issued_user_id': posted_by,
                                'issued_date': entry_date,
                                'amount': amt,
                                'issue_entry_id': entry_id,
                                'days': dys,
                            }
                        )
                        ord_id += 1

                return Response({
                    'success': True,
                    'message': f'Gift voucher issue {entry_no} saved successfully.',
                    'entry_no': entry_no,
                    'entry_id': entry_id,
                })


class GiftVoucherCancelViewSet(viewsets.ViewSet):
    """
    Handles Gift Voucher Cancellation:
    - Loads active issued vouchers for a given Location & Customer
    - Cancels selected vouchers using SPTRANS_GIFTVOUCHERISSUE_MAS (@MODE = 2)
    """

    @action(detail=False, methods=['get'], url_path='load-issued-vouchers')
    def load_issued_vouchers(self, request):
        location_code = request.query_params.get('location_code')
        customer_code = request.query_params.get('customer_code')

        qs = TransGiftVoucherIssueDetailDet.objects.using('transaction').filter(cancel=False)
        if location_code:
            # Filter via TransGiftVoucherIssue_Mas
            issue_ids = TransGiftVoucherIssueMas.objects.using('transaction').filter(
                location_code=int(location_code),
                cancel=False
            )
            if customer_code and int(customer_code) > 0:
                issue_ids = issue_ids.filter(customer_code=int(customer_code))
            entry_ids = list(issue_ids.values_list('entry_id', flat=True))
            qs = qs.filter(entry_id__in=entry_ids)

        vouchers = []
        for v in qs.order_by('-entry_date')[:200]:
            vouchers.append({
                'entry_id': v.entry_id,
                'entry_no': v.entry_no,
                'issue_no': v.entry_no,
                'voucher_no': v.voucher_no,
                'validity_days': v.days,
                'voucher_amount': float(v.amount),
                'selected': False,
            })
        return Response(vouchers)

    @action(detail=False, methods=['post'], url_path='cancel-vouchers')
    def cancel_vouchers(self, request):
        serializer = GiftVoucherCancelActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        vouchers = data['vouchers']
        user_id = data.get('user_id', 1)
        cancel_date = data.get('cancel_date') or timezone.now()

        if not vouchers:
            return Response({'success': False, 'message': 'No vouchers selected for cancellation.'}, status=status.HTTP_400_BAD_REQUEST)

        # Build XML payload for SP @MODE = 2
        xml_parts = ['<ROOT>']
        for item in vouchers:
            xml_parts.append(
                f'<GIFTVOUCHERDETAILDET '
                f'ISSUEDID="{item["entry_id"]}" '
                f'VOUCHERNO="{item["voucher_no"]}"/>'
            )
        xml_parts.append('</ROOT>')
        details_xml = ''.join(xml_parts)

        try:
            with connections['transaction'].cursor() as cursor:
                sp_sql = """
                    DECLARE @P_ERR INT = 0;
                    EXEC [dbo].[SPTRANS_GIFTVOUCHERISSUE_MAS]
                        @MODE = 2,
                        @DETAILS = %s,
                        @ERR = @P_ERR OUTPUT;
                    SELECT @P_ERR AS Err;
                """
                cursor.execute(sp_sql, [details_xml])
        except Exception as sp_err:
            pass

        # Ensure updates across tables
        with transaction.atomic(using='transaction'):
            for item in vouchers:
                v_no = item['voucher_no']
                e_id = item['entry_id']
                # Mark detail as cancelled
                TransGiftVoucherIssueDetailDet.objects.using('transaction').filter(
                    entry_id=e_id, voucher_no=v_no
                ).update(cancel=True)

                # Reset inventory record
                TransGiftVoucherDet.objects.using('transaction').filter(
                    voucher_no=v_no
                ).update(
                    customer_code=0,
                    issued=0,
                    issue_entry_id='',
                    issued_user_id=0,
                    issued_date=None
                )

        return Response({
            'success': True,
            'message': f'Successfully cancelled {len(vouchers)} voucher(s).'
        })
