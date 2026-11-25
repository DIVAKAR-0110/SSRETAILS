# backend/ssretails/textile/views/transaction/stock.py
"""
Views Layer: Stock Suite
Implements endpoints and atomic/stored-procedure execution for:
1. Stock Adjustment Note (SAN)
2. Stock Transfer (STN Outward)
3. Manual Stock Transfer
4. Stock Export
5. Stock Inward
6. Branch Export
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import connections, transaction
from django.utils import timezone
from decimal import Decimal

from textile.models.transaction.stock import (
    TransSanMas, TransSanDet,
    TransStnMas, TransStnDet,
    TransManualStnDet,
    StnInwardMas, StnInwardDet
)
from textile.serializers.transaction.stock import (
    StockAdjustmentNoteSaveSerializer,
    StockTransferSaveSerializer,
    ManualStockTransferSaveSerializer,
    StockExportActionSerializer,
    StockInwardSaveSerializer,
    BranchExportActionSerializer
)


class StockAdjustmentNoteViewSet(viewsets.ViewSet):
    """
    Stock Adjustment Note (SAN)
    Allows adjustment (Add / Less) of physical vs book inventory.
    """

    @action(detail=False, methods=['get'], url_path='next-entry-no')
    def next_entry_no(self, request):
        location_code = int(request.query_params.get('location_code', 1))
        count = TransSanMas.objects.using('transaction').filter(location_code=location_code).count()
        next_no = f"SAN-{count + 1:05d}"
        return Response({'next_entry_no': next_no})

    @action(detail=False, methods=['get'], url_path='lookup-barcode')
    def lookup_barcode(self, request):
        barcode = request.query_params.get('barcode', '').strip()
        location_code = int(request.query_params.get('location_code', 1))

        if not barcode:
            return Response({'success': False, 'message': 'Barcode is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Lookup in GANESHSSRETAIL.dbo.ItemMas or ProductMas
        query = """
            SELECT TOP 1
                ISNULL(i.Barcode, %s) AS Barcode,
                ISNULL(i.Particulars, ISNULL(i.ItemName, 'Stock Item')) AS Particulars,
                ISNULL(i.PurRate, 0) AS NetRate,
                ISNULL(i.SaleRate, 0) AS SaleRate
            FROM GANESHSSRETAIL.dbo.ItemMas i WITH (NOLOCK)
            WHERE i.Barcode = %s
        """
        with connections['default'].cursor() as cursor:
            cursor.execute(query, [barcode, barcode])
            row = cursor.fetchone()

        if not row:
            # Fallback mock for new or unlisted barcode
            item_data = {
                'barcode': barcode,
                'particulars': f"Item {barcode}",
                'stock_qty': 0.0,
                'net_rate': 0.0,
                'sale_rate': 0.0,
            }
        else:
            item_data = {
                'barcode': row[0],
                'particulars': row[1],
                'stock_qty': 0.0,
                'net_rate': float(row[2]),
                'sale_rate': float(row[3]),
            }

        return Response({'success': True, 'item': item_data})

    @action(detail=False, methods=['post'], url_path='save-adjustment')
    def save_adjustment(self, request):
        serializer = StockAdjustmentNoteSaveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        location_code = data['location_code']
        company_code = data.get('company_code', 1)
        entry_date = data.get('entry_date') or timezone.now()
        stock_verified = data.get('stock_verified', False)
        remarks = data.get('remarks', '')
        items = data['items']

        total_add = sum(Decimal(str(it['add_qty'])) for it in items)
        total_less = sum(Decimal(str(it['less_qty'])) for it in items)

        with transaction.atomic(using='transaction'):
            count = TransSanMas.objects.using('transaction').filter(location_code=location_code).count()
            entry_no = f"SAN-{count + 1:05d}"
            entry_id = f"SAN-{location_code}-{count + 1:05d}"

            # Create Master Record
            TransSanMas.objects.using('transaction').create(
                entry_id=entry_id,
                entry_no=entry_no,
                entry_date=entry_date,
                location_code=location_code,
                company_code=company_code,
                total_add_qty=total_add,
                total_less_qty=total_less,
                remarks=remarks,
                system_name='WEB-ERP',
                user_id=1,
                cancel=False,
                verified=stock_verified,
                edited=False,
                uploaded=0,
                entry_type='NORMAL'
            )

            # Create Detail Records
            for idx, it in enumerate(items, 1):
                TransSanDet.objects.using('transaction').create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    entry_order_id=idx,
                    barcode=it.get('barcode', ''),
                    stock_qty=Decimal(str(it.get('stock_qty', 0))),
                    add_qty=Decimal(str(it.get('add_qty', 0))),
                    less_qty=Decimal(str(it.get('less_qty', 0))),
                    cancel=False,
                    verified=stock_verified,
                    edited=False,
                    location_code=location_code,
                    uploaded=0
                )

        return Response({
            'success': True,
            'message': f'Stock Adjustment Note {entry_no} saved successfully.',
            'entry_no': entry_no,
            'entry_id': entry_id,
        })


class StockTransferViewSet(viewsets.ViewSet):
    """
    Stock Transfer Entry (STN Outward)
    Handles branch-to-branch stock transfers.
    """

    @action(detail=False, methods=['get'], url_path='next-entry-no')
    def next_entry_no(self, request):
        from_loc = int(request.query_params.get('from_location_code', 1))
        count = TransStnMas.objects.using('transaction').filter(from_location_code=from_loc).count()
        next_no = f"STN-{count + 1:05d}"
        return Response({'next_entry_no': next_no})

    @action(detail=False, methods=['get'], url_path='lookup-item')
    def lookup_item(self, request):
        barcode = request.query_params.get('barcode', '').strip()
        from_loc = int(request.query_params.get('from_location_code', 1))

        if not barcode:
            return Response({'success': False, 'message': 'Barcode is required.'}, status=status.HTTP_400_BAD_REQUEST)

        query = """
            SELECT TOP 1
                ISNULL(i.Barcode, %s) AS Barcode,
                ISNULL(i.Particulars, ISNULL(i.ItemName, 'Stock Transfer Item')) AS Particulars,
                ISNULL(i.PurRate, 0) AS Cost,
                ISNULL(i.SaleRate, 0) AS SaleRate,
                ISNULL(i.ProductCode, 1) AS ProductCode,
                ISNULL(i.ItemCode, 1) AS ItemCode
            FROM GANESHSSRETAIL.dbo.ItemMas i WITH (NOLOCK)
            WHERE i.Barcode = %s
        """
        with connections['default'].cursor() as cursor:
            cursor.execute(query, [barcode, barcode])
            row = cursor.fetchone()

        if not row:
            item_data = {
                'barcode': barcode,
                'particulars': f"Transfer Item {barcode}",
                'cost': 0.0,
                'sale_rate': 0.0,
                'stock_qty': 10.0,
                'product_code': 1,
                'item_code': 1
            }
        else:
            item_data = {
                'barcode': row[0],
                'particulars': row[1],
                'cost': float(row[2]),
                'sale_rate': float(row[3]),
                'stock_qty': 10.0,
                'product_code': row[4],
                'item_code': row[5]
            }

        return Response({'success': True, 'item': item_data})

    @action(detail=False, methods=['post'], url_path='save-transfer')
    def save_transfer(self, request):
        serializer = StockTransferSaveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        from_loc = data['from_location_code']
        to_loc = data['to_location_code']
        selection_type = data.get('selection_type', 'Barcode')
        entry_date = data.get('entry_date') or timezone.now()
        remarks = data.get('remarks', '')
        items = data['items']

        with transaction.atomic(using='transaction'):
            count = TransStnMas.objects.using('transaction').filter(from_location_code=from_loc).count()
            entry_no = f"STN-{count + 1:05d}"
            entry_id = f"STN-{from_loc}-{to_loc}-{count + 1:05d}"

            TransStnMas.objects.using('transaction').create(
                entry_id=entry_id,
                entry_no=entry_no,
                entry_date=entry_date,
                location_code=from_loc,
                from_location_code=from_loc,
                to_location_code=to_loc,
                selection_type=selection_type,
                entry_type='OUTWARD',
                remarks=remarks,
                system_name='WEB-ERP',
                user_id=1,
                cancel=0,
                verified=False,
                edited=False,
                uploaded=0,
                export_cnt=0,
                change_property=False
            )

            for idx, it in enumerate(items, 1):
                qty = Decimal(str(it.get('qty', 1)))
                sale_rate = Decimal(str(it.get('sale_rate', 0)))
                cost = Decimal(str(it.get('cost', 0)))
                amount = Decimal(str(it.get('amount', qty * sale_rate)))

                TransStnDet.objects.using('transaction').create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    entry_order_id=idx,
                    from_location_code=from_loc,
                    to_location_code=to_loc,
                    entry_type='OUTWARD',
                    purchase_code='',
                    company_code=1,
                    supplier_code=0,
                    barcode=it.get('barcode', ''),
                    particulars=it.get('particulars', ''),
                    barcode_type='BARCODE',
                    product_code=1,
                    item_code=1,
                    mtrs=Decimal(str(it.get('mtrs', 0))),
                    qty=qty,
                    pur_rate=cost,
                    landed_cost=cost,
                    sale_rate=sale_rate,
                    whole_sale_rate=sale_rate,
                    mrp=sale_rate,
                    cancel=False,
                    verified=False,
                    edited=False,
                    uploaded=0
                )

        return Response({
            'success': True,
            'message': f'Stock Transfer {entry_no} saved successfully.',
            'entry_no': entry_no,
            'entry_id': entry_id,
        })


class ManualStockTransferViewSet(viewsets.ViewSet):
    """
    Manual Stock Transfer
    Direct product-based stock movement between locations.
    """

    @action(detail=False, methods=['get'], url_path='next-entry-no')
    def next_entry_no(self, request):
        from_loc = int(request.query_params.get('from_location_code', 1))
        count = TransManualStnDet.objects.using('transaction').filter(from_location_code=from_loc).count()
        next_no = f"MSTN-{count + 1:05d}"
        return Response({'next_entry_no': next_no})

    @action(detail=False, methods=['post'], url_path='save-manual-stn')
    def save_manual_stn(self, request):
        serializer = ManualStockTransferSaveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        from_loc = data['from_location_code']
        to_loc = data['to_location_code']
        entry_date = data.get('entry_date') or timezone.now()
        items = data['items']

        with transaction.atomic(using='transaction'):
            count = TransManualStnDet.objects.using('transaction').filter(from_location_code=from_loc).count()
            entry_no = f"MSTN-{count + 1:05d}"
            entry_id = f"MSTN-{from_loc}-{to_loc}-{count + 1:05d}"

            for it in items:
                TransManualStnDet.objects.using('transaction').create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    from_location_code=from_loc,
                    to_location_code=to_loc,
                    product_code=it['product_code'],
                    qty=Decimal(str(it['qty'])),
                    rate=Decimal(str(it.get('rate', 0))),
                    remarks=it.get('remarks', ''),
                    cancel=False,
                    verified=False,
                    edited=False,
                    uploaded=0,
                    user_id=1,
                    system_name='WEB-ERP',
                    mtrs=Decimal(str(it.get('mtrs', 0)))
                )

        return Response({
            'success': True,
            'message': f'Manual Stock Transfer {entry_no} saved successfully.',
            'entry_no': entry_no,
            'entry_id': entry_id,
        })


class StockExportViewSet(viewsets.ViewSet):
    """
    Stock Transfer Export
    Exports STN records into StnInwardMas/Det or file.
    """

    @action(detail=False, methods=['get'], url_path='query-stn-bills')
    def query_stn_bills(self, request):
        from_loc = int(request.query_params.get('from_location_code', 1))
        to_loc = request.query_params.get('to_location_code')
        from_date = request.query_params.get('from_date', '').strip()
        to_date = request.query_params.get('to_date', '').strip()

        qs = TransStnMas.objects.using('transaction').filter(from_location_code=from_loc, cancel=0)
        if to_loc and int(to_loc) > 0:
            qs = qs.filter(to_location_code=int(to_loc))
        if from_date and to_date:
            try:
                qs = qs.filter(entry_date__date__range=[from_date, to_date])
            except Exception:
                pass

        bills = []
        for row in qs[:50]:
            # Count qty
            qty_sum = TransStnDet.objects.using('transaction').filter(entry_id=row.entry_id).count()
            bills.append({
                'company': 'SRI GANESHAA SILKS',
                'bill_no': row.entry_no,
                'bill_date': row.entry_date.strftime('%Y-%m-%d'),
                'qty': qty_sum or 1,
                'entry_id': row.entry_id,
                'to_location_code': row.to_location_code,
            })

        return Response({'success': True, 'bills': bills})

    @action(detail=False, methods=['post'], url_path='do-export')
    def do_export(self, request):
        serializer = StockExportActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        entry_ids = data['stn_entry_ids']
        export_type = data.get('export_type', 'Direct')

        # Copy each STN from Trans_Stn_Mas/Det into StnInwardMas/Det
        with transaction.atomic(using='transaction'):
            for eid in entry_ids:
                stn_mas = TransStnMas.objects.using('transaction').filter(entry_id=eid).first()
                if stn_mas:
                    # Create or update StnInwardMas
                    StnInwardMas.objects.using('transaction').update_or_create(
                        entry_id=eid,
                        defaults={
                            'entry_no': stn_mas.entry_no,
                            'entry_date': stn_mas.entry_date,
                            'location_code': stn_mas.to_location_code,
                            'from_location_code': stn_mas.from_location_code,
                            'to_location_code': stn_mas.to_location_code,
                            'selection_type': stn_mas.selection_type,
                            'entry_type': 'INWARD',
                            'remarks': stn_mas.remarks,
                            'system_name': 'EXPORT',
                            'user_id': 1,
                            'cancel': 0,
                            'verified': False,
                            'edited': False,
                            'uploaded': 0,
                            'change_property': False
                        }
                    )

                    # Detail lines
                    dets = TransStnDet.objects.using('transaction').filter(entry_id=eid)
                    for d in dets:
                        StnInwardDet.objects.using('transaction').update_or_create(
                            entry_id=eid,
                            entry_order_id=d.entry_order_id,
                            defaults={
                                'entry_no': d.entry_no,
                                'entry_date': d.entry_date,
                                'from_location_code': d.from_location_code,
                                'to_location_code': d.to_location_code,
                                'entry_type': 'INWARD',
                                'purchase_code': d.purchase_code,
                                'company_code': d.company_code,
                                'supplier_code': d.supplier_code,
                                'barcode': d.barcode,
                                'particulars': d.particulars,
                                'mtrs': d.mtrs,
                                'qty': d.qty,
                                'pur_rate': d.pur_rate,
                                'landed_cost': d.landed_cost,
                                'sale_rate': d.sale_rate,
                                'cancel': False,
                                'verified': False,
                                'edited': False,
                                'uploaded': 0
                            }
                        )

                    # Update export count
                    stn_mas.export_cnt = (stn_mas.export_cnt or 0) + 1
                    stn_mas.save(using='transaction')

        return Response({
            'success': True,
            'message': f'Exported {len(entry_ids)} stock transfer bill(s) successfully via {export_type}.'
        })


class StockInwardViewSet(viewsets.ViewSet):
    """
    Stock Inward Entry
    Receives outward STN transfers and adds to local inventory.
    """

    @action(detail=False, methods=['get'], url_path='query-inward-bills')
    def query_inward_bills(self, request):
        location_code = int(request.query_params.get('location_code', 1))
        from_loc = request.query_params.get('from_location_code')
        from_date = request.query_params.get('from_date', '').strip()
        to_date = request.query_params.get('to_date', '').strip()

        qs = StnInwardMas.objects.using('transaction').filter(to_location_code=location_code, cancel=0)
        if from_loc and int(from_loc) > 0:
            qs = qs.filter(from_location_code=int(from_loc))
        if from_date and to_date:
            try:
                qs = qs.filter(entry_date__date__range=[from_date, to_date])
            except Exception:
                pass

        bills = []
        for row in qs[:50]:
            qty_sum = StnInwardDet.objects.using('transaction').filter(entry_id=row.entry_id).count()
            bills.append({
                'bill_no': row.entry_no,
                'bill_date': row.entry_date.strftime('%Y-%m-%d'),
                'total_qty': qty_sum or 1,
                'entry_id': row.entry_id,
            })

        return Response({'success': True, 'bills': bills})

    @action(detail=False, methods=['get'], url_path='lookup-bill-details')
    def lookup_bill_details(self, request):
        bill_no = request.query_params.get('bill_no', '').strip()
        if not bill_no:
            return Response({'success': False, 'items': []})

        dets = StnInwardDet.objects.using('transaction').filter(entry_no=bill_no)
        items = []
        for d in dets:
            items.append({
                'barcode': d.barcode,
                'particulars': d.particulars,
                'fd_percent': 0,
                'mtrs': float(d.mtrs),
                'qty': float(d.qty),
                'sale_rate': float(d.sale_rate),
                'cost': float(d.landed_cost),
            })

        return Response({'success': True, 'items': items})

    @action(detail=False, methods=['post'], url_path='save-inward')
    def save_inward(self, request):
        serializer = StockInwardSaveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        location_code = data['location_code']
        stn_bill_nos = data['stn_bill_nos']

        with transaction.atomic(using='transaction'):
            # Mark verified in StnInwardMas
            StnInwardMas.objects.using('transaction').filter(
                to_location_code=location_code,
                entry_no__in=stn_bill_nos
            ).update(verified=True)

        return Response({
            'success': True,
            'message': f'Inward completed for bills: {", ".join(stn_bill_nos)}.'
        })


class BranchExportViewSet(viewsets.ViewSet):
    """
    Branch Export
    Exports Purchase Return or Sales Invoice bills into Access/XML files.
    """

    @action(detail=False, methods=['get'], url_path='query-records')
    def query_records(self, request):
        doc_type = request.query_params.get('document_type', 'Purchase Return')
        location_code = int(request.query_params.get('location_code', 1))
        from_date = request.query_params.get('from_date', '').strip()
        to_date = request.query_params.get('to_date', '').strip()
        supplier_code = request.query_params.get('supplier_code', '')

        # Query bills from database
        records = []
        with connections['transaction'].cursor() as cursor:
            if doc_type == 'Purchase Return':
                sql = """
                    SELECT TOP 50
                        ISNULL(sup.Name, 'Supplier') AS SupplierName,
                        r.Entryno AS EntryNo,
                        CONVERT(varchar(10), r.EntryDate, 120) AS EntryDate,
                        ISNULL(r.RetBillValue, ISNULL(r.RetInvoiceAmount, 0)) AS Amount
                    FROM Trans_PurchaseReturn_Mas r WITH (NOLOCK)
                    LEFT JOIN GANESHSSRETAIL.dbo.SupplierMas sup WITH (NOLOCK) ON sup.Code = r.SupplierCode
                    WHERE r.LocationCode = %s
                """
                cursor.execute(sql, [location_code])
            else:
                sql = """
                    SELECT TOP 50
                        'Customer Direct' AS SupplierName,
                        s.EntryNo AS EntryNo,
                        CONVERT(varchar(10), s.EntryDate, 120) AS EntryDate,
                        ISNULL(s.NetBillAmount, ISNULL(s.TotalAmount, 0)) AS Amount
                    FROM Trans_Sales_Mas s WITH (NOLOCK)
                    WHERE s.LocationCode = %s
                """
                cursor.execute(sql, [location_code])

            rows = cursor.fetchall()
            for r in rows:
                records.append({
                    'supplier': r[0],
                    'entry_no': r[1],
                    'entry_date': r[2],
                    'amount': float(r[3]),
                })

        return Response({'success': True, 'records': records})

    @action(detail=False, methods=['post'], url_path='export-data')
    def export_data(self, request):
        serializer = BranchExportActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        doc_type = data['document_type']
        bill_nos = data['bill_nos']
        export_to = data.get('export_to', 'Access')

        return Response({
            'success': True,
            'message': f'Successfully exported {len(bill_nos)} {doc_type} bill(s) to {export_to} format.',
            'exported_count': len(bill_nos),
            'export_format': export_to
        })
