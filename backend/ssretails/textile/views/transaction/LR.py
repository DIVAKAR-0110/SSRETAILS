# backend/ssretails/textile/views/transaction/LR.py
import datetime
from django.db import transaction, connections
from django.utils import timezone
from rest_framework import viewsets, status, exceptions
from rest_framework.decorators import action
from rest_framework.response import Response

from textile.models.transaction.LR import (
    LREntryTypeMas, LRChargeModeMas, TransLRMas, TransLRInvoiceDet, TransLRDet,
    TransLRIssueMas, TransLRIssueDet, TransLRReceiptMas, TransLRReceiptDet,
    TransLRReceiptAddLessDet, TransLRTransferMas, TransLRTransferDet
)
from textile.serializers.transaction.LR import (
    LREntryTypeSerializer, LRChargeModeSerializer, TransLRMasSerializer,
    TransLRInvoiceDetSerializer, TransLRDetSerializer,
    TransLRIssueMasSerializer, TransLRIssueDetSerializer,
    TransLRReceiptMasSerializer, TransLRReceiptDetSerializer,
    TransLRReceiptAddLessDetSerializer, TransLRTransferMasSerializer,
    TransLRTransferDetSerializer
)
from textile.models.master.intractors import SupplierMas, TransportMas
from textile.models.master.general import CityMas


class LREntryTypeViewSet(viewsets.ModelViewSet):
    """API for LR Entry Types (Purchase, Sales, Stock Transfer, etc.)."""
    queryset = LREntryTypeMas.objects.all()
    serializer_class = LREntryTypeSerializer


class LRChargeModeViewSet(viewsets.ModelViewSet):
    """API for LR Charge Modes (Weight, Bundle, Fixed, etc.)."""
    queryset = LRChargeModeMas.objects.all()
    serializer_class = LRChargeModeSerializer


class LREntryViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Transaction -> LR -> LR Entry.
    Persists data to GANESHSSRETAILTRAN database.
    """
    serializer_class = TransLRMasSerializer

    def get_queryset(self):
        qs = TransLRMas.objects.using("transaction").filter(cancel=False)
        loc = self.request.query_params.get("location_id")
        if loc:
            qs = qs.filter(location_id=loc)
        return qs

    @action(detail=False, methods=["get"], url_path="next-entry-no")
    def next_entry_no(self, request):
        """Generates the next sequential Entry Number for LR."""
        today = timezone.now()
        prefix = f"LR{today.strftime('%y%m')}"
        latest = (
            TransLRMas.objects.using("transaction")
            .filter(entry_no__startswith=prefix)
            .order_by("-entry_no")
            .first()
        )
        if latest and latest.entry_no and len(latest.entry_no) > len(prefix):
            try:
                seq = int(latest.entry_no[len(prefix):]) + 1
            except ValueError:
                seq = 1
        else:
            seq = 1
        next_no = f"{prefix}{seq:04d}"
        return Response({"entry_no": next_no, "entry_id": f"ID-{next_no}"})

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk") or kwargs.get("entry_id")
        if not pk and len(args) > 0:
            pk = args[0]
        header = TransLRMas.objects.using("transaction").filter(pk=pk).first()
        if not header:
            return Response({"detail": "LR Entry not found."}, status=status.HTTP_404_NOT_FOUND)

        invoices = list(TransLRInvoiceDet.objects.using("transaction").filter(entry_id=pk, cancel=False))
        lr_details = list(TransLRDet.objects.using("transaction").filter(entry_id=pk, cancel=False))

        data = self.get_serializer(header).data
        data["invoices"] = TransLRInvoiceDetSerializer(invoices, many=True).data
        data["lr_details"] = TransLRDetSerializer(lr_details, many=True).data
        return Response(data)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        invoices_data = data.pop("invoices", [])
        lr_details_data = data.pop("lr_details", [])

        # Auto-allocate EntryNo & EntryID if omitted
        entry_no = data.get("entry_no")
        if not entry_no:
            today = timezone.now()
            prefix = f"LR{today.strftime('%y%m')}"
            count = TransLRMas.objects.using("transaction").filter(entry_no__startswith=prefix).count()
            entry_no = f"{prefix}{count + 1:04d}"
            data["entry_no"] = entry_no

        entry_id = data.get("entry_id") or f"ID-{entry_no}"
        data["entry_id"] = entry_id
        entry_date = data.get("entry_date") or timezone.now()

        # Extract primary LR header fields if present in lr_details
        primary_lr = next((l for l in lr_details_data if l.get("is_primary")), None)
        if not primary_lr and lr_details_data:
            primary_lr = lr_details_data[0]

        if primary_lr:
            data.setdefault("lr_no", primary_lr.get("lr_no", "") or "")
            data.setdefault("lr_date", primary_lr.get("lr_date") or entry_date)
            data.setdefault("transport_id", int(primary_lr.get("transport_id", 0) or 0))
            data.setdefault("from_city_id", int(primary_lr.get("from_city_id", 0) or 0))
            data.setdefault("to_city_id", int(primary_lr.get("to_city_id", 0) or 0))
        else:
            data.setdefault("lr_no", "")
            data.setdefault("lr_date", entry_date)
            data.setdefault("transport_id", 0)
            data.setdefault("from_city_id", 0)
            data.setdefault("to_city_id", 0)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic(using="transaction"):
            header = serializer.save()

            # Save Tab 1: Invoices
            for idx, inv in enumerate(invoices_data, start=1):
                inv_date = inv.get("invoice_date") or entry_date
                TransLRInvoiceDet.objects.using("transaction").create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    entry_order_id=idx,
                    supplier_id=inv.get("supplier_id") or inv.get("supplier_code", 0),
                    invoice_no=inv.get("invoice_no", "").strip().upper(),
                    invoice_date=inv_date,
                    bundles=inv.get("bundles", 0),
                    amount=inv.get("amount", 0),
                    supplier_bundle_no=inv.get("supplier_bundle_no", ""),
                    location_id=header.location_id,
                )

            # Save Tab 2: LR Details
            for idx, lrd in enumerate(lr_details_data, start=1):
                l_date = lrd.get("lr_date") or entry_date
                TransLRDet.objects.using("transaction").create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    entry_order_id=idx,
                    transport_id=lrd.get("transport_id") or lrd.get("transport_code", 0),
                    from_city_id=lrd.get("from_city_id") or lrd.get("from_city_code", 0),
                    to_city_id=lrd.get("to_city_id") or lrd.get("to_city_code", 0),
                    transfer_mode_id=lrd.get("transfer_mode_id") or lrd.get("transfer_mode_code", 0),
                    lr_no=lrd.get("lr_no", "").strip().upper(),
                    lr_date=l_date,
                    is_paid=lrd.get("is_paid", False),
                    paid_by=lrd.get("paid_by", ""),
                    lr_amount=lrd.get("lr_amount", 0),
                    other_charge_amount=lrd.get("other_charge_amount", 0),
                    freight_charge_mode_id=lrd.get("freight_charge_mode_id", 0),
                    freight_charge_per_mode=lrd.get("freight_charge_per_mode", 0),
                    freight_charge=lrd.get("freight_charge", 0),
                    lu_charge_mode_id=lrd.get("lu_charge_mode_id", 0),
                    lu_charge_per_mode=lrd.get("lu_charge_per_mode", 0),
                    lu_charge=lrd.get("lu_charge", 0),
                    total=lrd.get("total", 0),
                    is_primary=lrd.get("is_primary", True),
                    location_id=header.location_id,
                    actual_weight=lrd.get("actual_weight", 0),
                    charged_weight=lrd.get("charged_weight", 0),
                    noof_bundles=lrd.get("noof_bundles", 0),
                )

        # Re-fetch populated result
        return self.retrieve(request, *args, **{"pk": entry_id})

    def update(self, request, *args, **kwargs):
        pk = kwargs.get("pk") or kwargs.get("entry_id")
        header = TransLRMas.objects.using("transaction").filter(pk=pk).first()
        if not header:
            return Response({"detail": "LR Entry not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        invoices_data = data.pop("invoices", None)
        lr_details_data = data.pop("lr_details", None)

        serializer = self.get_serializer(header, data=data, partial=kwargs.get("partial", False))
        serializer.is_valid(raise_exception=True)

        with transaction.atomic(using="transaction"):
            header = serializer.save()

            if invoices_data is not None:
                TransLRInvoiceDet.objects.using("transaction").filter(entry_id=pk).delete()
                for idx, inv in enumerate(invoices_data, start=1):
                    inv_date = inv.get("invoice_date") or header.entry_date
                    TransLRInvoiceDet.objects.using("transaction").create(
                        entry_id=header.entry_id,
                        entry_no=header.entry_no,
                        entry_date=header.entry_date,
                        entry_order_id=idx,
                        supplier_id=inv.get("supplier_id") or inv.get("supplier_code", 0),
                        invoice_no=inv.get("invoice_no", "").strip().upper(),
                        invoice_date=inv_date,
                        bundles=inv.get("bundles", 0),
                        amount=inv.get("amount", 0),
                        supplier_bundle_no=inv.get("supplier_bundle_no", ""),
                        location_id=header.location_id,
                    )

            if lr_details_data is not None:
                TransLRDet.objects.using("transaction").filter(entry_id=pk).delete()
                for idx, lrd in enumerate(lr_details_data, start=1):
                    l_date = lrd.get("lr_date") or header.entry_date
                    TransLRDet.objects.using("transaction").create(
                        entry_id=header.entry_id,
                        entry_no=header.entry_no,
                        entry_date=header.entry_date,
                        entry_order_id=idx,
                        transport_id=lrd.get("transport_id") or lrd.get("transport_code", 0),
                        from_city_id=lrd.get("from_city_id") or lrd.get("from_city_code", 0),
                        to_city_id=lrd.get("to_city_id") or lrd.get("to_city_code", 0),
                        transfer_mode_id=lrd.get("transfer_mode_id") or lrd.get("transfer_mode_code", 0),
                        lr_no=lrd.get("lr_no", "").strip().upper(),
                        lr_date=l_date,
                        is_paid=lrd.get("is_paid", False),
                        paid_by=lrd.get("paid_by", ""),
                        lr_amount=lrd.get("lr_amount", 0),
                        other_charge_amount=lrd.get("other_charge_amount", 0),
                        freight_charge_mode_id=lrd.get("freight_charge_mode_id", 0),
                        freight_charge_per_mode=lrd.get("freight_charge_per_mode", 0),
                        freight_charge=lrd.get("freight_charge", 0),
                        lu_charge_mode_id=lrd.get("lu_charge_mode_id", 0),
                        lu_charge_per_mode=lrd.get("lu_charge_per_mode", 0),
                        lu_charge=lrd.get("lu_charge", 0),
                        total=lrd.get("total", 0),
                        is_primary=lrd.get("is_primary", True),
                        location_id=header.location_id,
                        actual_weight=lrd.get("actual_weight", 0),
                        charged_weight=lrd.get("charged_weight", 0),
                        noof_bundles=lrd.get("noof_bundles", 0),
                    )

        return self.retrieve(request, *args, **{"pk": pk})

    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        with transaction.atomic(using="transaction"):
            TransLRMas.objects.using("transaction").filter(pk=pk).update(cancel=True)
            TransLRInvoiceDet.objects.using("transaction").filter(entry_id=pk).update(cancel=True)
            TransLRDet.objects.using("transaction").filter(entry_id=pk).update(cancel=True)
        return Response(status=status.HTTP_204_NO_CONTENT)


# =========================================================================
# LR Issue ViewSet
# =========================================================================

class LRIssueViewSet(viewsets.ModelViewSet):
    """ViewSet for LR Issue Entry."""
    serializer_class = TransLRIssueMasSerializer

    def get_queryset(self):
        qs = TransLRIssueMas.objects.using("transaction").filter(cancel=False)
        loc = self.request.query_params.get("location_id")
        if loc:
            qs = qs.filter(location_id=loc)
        return qs

    @action(detail=False, methods=["get"], url_path="next-entry-no")
    def next_entry_no(self, request):
        today = timezone.now()
        prefix = f"IS{today.strftime('%y%m')}"
        latest = (
            TransLRIssueMas.objects.using("transaction")
            .filter(entry_no__startswith=prefix)
            .order_by("-entry_no")
            .first()
        )
        if latest and latest.entry_no and len(latest.entry_no) > len(prefix):
            try:
                seq = int(latest.entry_no[len(prefix):]) + 1
            except ValueError:
                seq = 1
        else:
            seq = 1
        next_no = f"{prefix}{seq:04d}"
        return Response({"entry_no": next_no, "entry_id": f"ID-{next_no}"})

    @action(detail=False, methods=["get"], url_path="pending-lrs")
    def pending_lrs(self, request):
        """Fetches candidate unissued LR entries matching filters."""
        location_id = request.query_params.get("location_id")
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        transport_id = request.query_params.get("transport_id")
        supplier_id = request.query_params.get("supplier_id")
        lr_no = request.query_params.get("lr_no")
        entry_no = request.query_params.get("entry_no")

        # Unissued LRs: lr_issue_no is null or blank
        qs = TransLRMas.objects.using("transaction").filter(
            cancel=False
        ).exclude(lr_issue_no__isnull=False, lr_issue_no__gt="")

        if location_id:
            qs = qs.filter(location_id=location_id)
        if from_date:
            qs = qs.filter(entry_date__date__gte=from_date)
        if to_date:
            qs = qs.filter(entry_date__date__lte=to_date)
        if transport_id:
            qs = qs.filter(transport_id=transport_id)
        if lr_no:
            qs = qs.filter(lr_no__icontains=lr_no)
        if entry_no:
            qs = qs.filter(entry_no__icontains=entry_no)

        records = []
        for lr in qs[:100]:
            # Fetch transport name & cities
            tr_obj = TransportMas.objects.filter(pk=lr.transport_id).first()
            from_c = CityMas.objects.filter(pk=lr.from_city_id).first()
            to_c = CityMas.objects.filter(pk=lr.to_city_id).first()

            # Invoices
            inv_qs = TransLRInvoiceDet.objects.using("transaction").filter(entry_id=lr.entry_id, cancel=False)
            if supplier_id:
                inv_qs = inv_qs.filter(supplier_id=supplier_id)
            inv_first = inv_qs.first()
            if supplier_id and not inv_first:
                continue

            sup_name = ""
            if inv_first:
                sup = SupplierMas.objects.filter(pk=inv_first.supplier_id).first()
                sup_name = sup.name if sup else ""

            records.append({
                "entry_id": lr.entry_id,
                "entry_no": lr.entry_no,
                "entry_date": lr.entry_date.strftime("%Y-%m-%d") if lr.entry_date else "",
                "transport_name": tr_obj.name if tr_obj else "",
                "booked_from": from_c.name if from_c else "",
                "booked_to": to_c.name if to_c else "",
                "supplier_name": sup_name,
                "lr_no": lr.lr_no or "",
                "lr_date": lr.lr_date.strftime("%Y-%m-%d") if lr.lr_date else "",
                "bundles": int(lr.total_bundles or 0),
                "time": lr.user_entry_datetime.strftime("%H:%M") if lr.user_entry_datetime else "",
            })

        return Response(records)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        details_data = data.pop("issue_details", [])

        entry_no = data.get("entry_no")
        if not entry_no:
            today = timezone.now()
            prefix = f"IS{today.strftime('%y%m')}"
            count = TransLRIssueMas.objects.using("transaction").filter(entry_no__startswith=prefix).count()
            entry_no = f"{prefix}{count + 1:04d}"
            data["entry_no"] = entry_no

        entry_id = data.get("entry_id") or f"ID-{entry_no}"
        data["entry_id"] = entry_id
        entry_date = data.get("entry_date") or timezone.now()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic(using="transaction"):
            header = serializer.save()
            for idx, item in enumerate(details_data, start=1):
                lr_entry_id = item.get("lr_entry_id") or item.get("entry_id")
                bundles = item.get("bundles", 0)
                TransLRIssueDet.objects.using("transaction").create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    entry_order_id=idx,
                    lr_entry_id=lr_entry_id,
                    bundles=bundles,
                    location_id=header.location_id,
                )
                # Mark source LR as issued
                TransLRMas.objects.using("transaction").filter(entry_id=lr_entry_id).update(
                    lr_issue_no=entry_no,
                    lr_issue_date=entry_date
                )

        return Response(self.get_serializer(header).data, status=status.HTTP_201_CREATED)


# =========================================================================
# LR Receipt ViewSet
# =========================================================================

class LRReceiptViewSet(viewsets.ModelViewSet):
    """ViewSet for LR Receipt Entry."""
    serializer_class = TransLRReceiptMasSerializer

    def get_queryset(self):
        qs = TransLRReceiptMas.objects.using("transaction").filter(cancel=False)
        loc = self.request.query_params.get("location_id")
        if loc:
            qs = qs.filter(location_id=loc)
        return qs

    @action(detail=False, methods=["get"], url_path="next-entry-no")
    def next_entry_no(self, request):
        today = timezone.now()
        prefix = f"RC{today.strftime('%y%m')}"
        latest = (
            TransLRReceiptMas.objects.using("transaction")
            .filter(entry_no__startswith=prefix)
            .order_by("-entry_no")
            .first()
        )
        if latest and latest.entry_no and len(latest.entry_no) > len(prefix):
            try:
                seq = int(latest.entry_no[len(prefix):]) + 1
            except ValueError:
                seq = 1
        else:
            seq = 1
        next_no = f"{prefix}{seq:04d}"
        return Response({"entry_no": next_no, "entry_id": f"ID-{next_no}"})

    @action(detail=False, methods=["get"], url_path="pending-issues")
    def pending_issues(self, request):
        """Queries candidate issued LRs pending receipt."""
        location_id = request.query_params.get("location_id")
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        transport_id = request.query_params.get("transport_id")
        issue_no = request.query_params.get("issue_no")
        lr_no = request.query_params.get("lr_no")

        # Query LRs with lr_issue_no but no receipt_no
        qs = TransLRMas.objects.using("transaction").filter(
            cancel=False,
            lr_issue_no__isnull=False,
            lr_receipt_no__isnull=True
        )
        if location_id:
            qs = qs.filter(location_id=location_id)
        if from_date:
            qs = qs.filter(entry_date__date__gte=from_date)
        if to_date:
            qs = qs.filter(entry_date__date__lte=to_date)
        if transport_id:
            qs = qs.filter(transport_id=transport_id)
        if issue_no:
            qs = qs.filter(lr_issue_no__icontains=issue_no)
        if lr_no:
            qs = qs.filter(lr_no__icontains=lr_no)

        records = []
        for lr in qs[:100]:
            tr_obj = TransportMas.objects.filter(pk=lr.transport_id).first()
            det_first = TransLRDet.objects.using("transaction").filter(entry_id=lr.entry_id).first()

            records.append({
                "entry_id": lr.entry_id,
                "entry_no": lr.entry_no,
                "entry_date": lr.entry_date.strftime("%Y-%m-%d") if lr.entry_date else "",
                "transport_name": tr_obj.name if tr_obj else "",
                "lr_no": lr.lr_no or "",
                "lr_date": lr.lr_date.strftime("%Y-%m-%d") if lr.lr_date else "",
                "no_of_bundles": int(lr.total_bundles or 0),
                "recvd_bundles": int(lr.recvd_bundles or 0),
                "balance_bundles": int((lr.total_bundles or 0) - (lr.recvd_bundles or 0)),
                "receive_bundles": int((lr.total_bundles or 0) - (lr.recvd_bundles or 0)),
                "charged_weight": float(lr.charged_weight or 0),
                "paid_amount": float(det_first.lr_amount if det_first else 0),
                "is_paid": bool(det_first.is_paid if det_first else False),
                "lr_issue_entry_id": lr.lr_issue_no or "",
                "lr_issue_entry_order_id": 1,
            })

        return Response(records)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        receipt_details = data.pop("receipt_details", [])
        addless_details = data.pop("addless_details", [])

        entry_no = data.get("entry_no")
        if not entry_no:
            today = timezone.now()
            prefix = f"RC{today.strftime('%y%m')}"
            count = TransLRReceiptMas.objects.using("transaction").filter(entry_no__startswith=prefix).count()
            entry_no = f"{prefix}{count + 1:04d}"
            data["entry_no"] = entry_no

        entry_id = data.get("entry_id") or f"ID-{entry_no}"
        data["entry_id"] = entry_id
        entry_date = data.get("entry_date") or timezone.now()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic(using="transaction"):
            header = serializer.save()

            for idx, r_row in enumerate(receipt_details, start=1):
                lr_entry_id = r_row.get("lr_entry_id") or r_row.get("entry_id")
                rcvd = r_row.get("receive_bundles", 0) or r_row.get("recvd_bundles", 0)
                TransLRReceiptDet.objects.using("transaction").create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    entry_order_id=idx,
                    lr_entry_id=lr_entry_id,
                    bundles=r_row.get("no_of_bundles", 0),
                    recvd_bundles=rcvd,
                    receipt_return=r_row.get("receipt_return", False),
                    is_paid=r_row.get("is_paid", False),
                    location_id=header.location_id,
                    lr_issue_entry_id=r_row.get("lr_issue_entry_id", ""),
                )
                # Mark source LR as received
                TransLRMas.objects.using("transaction").filter(entry_id=lr_entry_id).update(
                    lr_receipt_no=header.receipt_no or entry_no,
                    lr_receipt_date=header.receipt_date or entry_date,
                    recvd_bundles=rcvd
                )

            for idx, a_row in enumerate(addless_details, start=1):
                TransLRReceiptAddLessDet.objects.using("transaction").create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    entry_order_id=idx,
                    tax_type_id=a_row.get("tax_type_id", 0),
                    add_or_less_type=a_row.get("add_or_less_type", False),
                    tax_percent=a_row.get("tax_percent", 0),
                    tax_on_amount=a_row.get("tax_on_amount", 0),
                    amount=a_row.get("amount", 0),
                    round_off=a_row.get("round_off", 0),
                    net_amount=a_row.get("net_amount", 0),
                    location_id=header.location_id,
                )

        return Response(self.get_serializer(header).data, status=status.HTTP_201_CREATED)


# =========================================================================
# LR Export ViewSet
# =========================================================================

class LRExportViewSet(viewsets.ModelViewSet):
    """ViewSet for LR Transfer & Manifest Export."""
    serializer_class = TransLRTransferMasSerializer

    def get_queryset(self):
        qs = TransLRTransferMas.objects.using("transaction").filter(cancel=False)
        loc = self.request.query_params.get("location_id")
        if loc:
            qs = qs.filter(location_id=loc)
        return qs

    @action(detail=False, methods=["get"], url_path="pending-transfers")
    def pending_transfers(self, request):
        location_id = request.query_params.get("location_id")
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        company_id = request.query_params.get("company_id")
        to_location_id = request.query_params.get("to_location_id")

        qs = TransLRTransferMas.objects.using("transaction").filter(cancel=False)
        if location_id:
            qs = qs.filter(location_id=location_id)
        if to_location_id:
            qs = qs.filter(from_or_to_location_id=to_location_id)
        if company_id:
            qs = qs.filter(company_id=company_id)
        if from_date:
            qs = qs.filter(entry_date__date__gte=from_date)
        if to_date:
            qs = qs.filter(entry_date__date__lte=to_date)

        records = []
        for tr in qs[:100]:
            records.append({
                "entry_id": tr.entry_id,
                "entryno": tr.entry_no,
                "entrydate": tr.entry_date.strftime("%Y-%m-%d") if tr.entry_date else "",
                "noofbundles": float(tr.noof_bundles or 0),
                "exported": bool(tr.exported),
            })
        return Response(records)

    @action(detail=False, methods=["post"], url_path="export-manifests")
    def export_manifests(self, request):
        entry_ids = request.data.get("entry_ids", [])
        export_type = request.data.get("export_type", "DIRECT")
        file_path = request.data.get("file_path", "")

        TransLRTransferMas.objects.using("transaction").filter(entry_id__in=entry_ids).update(
            exported=1,
            entry_type=export_type
        )
        return Response({
            "message": f"Successfully exported {len(entry_ids)} manifests via {export_type}.",
            "exported_ids": entry_ids,
            "file_path": file_path
        })


# =========================================================================
# LR Account Post ViewSet
# =========================================================================

class LRAccountPostViewSet(viewsets.ViewSet):
    """ViewSet for LR General Ledger & Invoice Account Posting."""

    @action(detail=False, methods=["get"], url_path="pending-invoices")
    def pending_invoices(self, request):
        location_id = request.query_params.get("location_id")
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        transport_id = request.query_params.get("transport_id")
        lr_no = request.query_params.get("lr_no")

        # Unposted invoices: accounts_entry_id is null or blank
        qs = TransLRInvoiceDet.objects.using("transaction").filter(
            cancel=False
        ).exclude(accounts_entry_id__isnull=False, accounts_entry_id__gt="")

        if location_id:
            qs = qs.filter(location_id=location_id)
        if from_date:
            qs = qs.filter(invoice_date__date__gte=from_date)
        if to_date:
            qs = qs.filter(invoice_date__date__lte=to_date)

        records = []
        for inv in qs[:150]:
            sup = SupplierMas.objects.filter(pk=inv.supplier_id).first()
            lr_mas = TransLRMas.objects.using("transaction").filter(entry_id=inv.entry_id).first()

            if transport_id and lr_mas and str(lr_mas.transport_id) != str(transport_id):
                continue
            if lr_no and lr_mas and lr_no.upper() not in (lr_mas.lr_no or "").upper():
                continue

            records.append({
                "entry_id": inv.entry_id,
                "entryno": inv.entry_no,
                "entrydate": inv.entry_date.strftime("%Y-%m-%d") if inv.entry_date else "",
                "supplier_name": sup.name if sup else "",
                "invoice_date": inv.invoice_date.strftime("%Y-%m-%d") if inv.invoice_date else "",
                "invoiceno": inv.invoice_no,
                "bundles": int(inv.bundles or 0),
                "amount": float(inv.amount or 0),
            })

        return Response(records)

    @action(detail=False, methods=["post"], url_path="post-to-accounts")
    def post_to_accounts(self, request):
        invoices = request.data.get("invoices", [])
        is_master_export = request.data.get("master_export", False)
        today = timezone.now()

        posted_count = 0
        with transaction.atomic(using="transaction"):
            for inv in invoices:
                entry_id = inv.get("entry_id")
                inv_no = inv.get("invoiceno")
                voucher_ref = f"ACC-{today.strftime('%y%m')}-{inv_no}"
                TransLRInvoiceDet.objects.using("transaction").filter(
                    entry_id=entry_id,
                    invoice_no=inv_no
                ).update(accounts_entry_id=voucher_ref)
                posted_count += 1

        return Response({
            "message": f"Successfully posted {posted_count} invoices to Accounts Ledger.",
            "posted_count": posted_count,
            "master_export": is_master_export
        })

