# textile/views/transaction/payment.py
import datetime
import xml.etree.ElementTree as ET
from decimal import Decimal
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from textile.models.transaction.payment import (
    TransPaymentMas,
    TransPaymentDet,
    TransPaymentModeDet,
    TransPaymentTaxDet,
    TransBalanceDet,
    TransSupplierAdvanceMas,
)
from textile.serializers.transaction.payment import (
    TransPaymentMasSerializer,
    TransPaymentDetSerializer,
    TransPaymentModeDetSerializer,
    TransPaymentTaxDetSerializer,
    TransBalanceDetSerializer,
    TransSupplierAdvanceMasSerializer,
)
from textile.utils.sp_executor import execute_custom_sp


class PaymentEntryViewSet(viewsets.ModelViewSet):
    queryset = TransPaymentMas.objects.using("transaction").all().order_by("-entry_date", "-entry_no")
    serializer_class = TransPaymentMasSerializer

    def get_queryset(self):
        qs = TransPaymentMas.objects.using("transaction").all().order_by("-entry_date", "-entry_no")
        loc_id = self.request.query_params.get("location_id")
        sup_id = self.request.query_params.get("supplier_id")
        from_date = self.request.query_params.get("from_date")
        to_date = self.request.query_params.get("to_date")
        entry_no = self.request.query_params.get("entry_no")

        if loc_id:
            qs = qs.filter(location_id=loc_id)
        if sup_id:
            qs = qs.filter(supplier_id=sup_id)
        if from_date:
            qs = qs.filter(entry_date__gte=from_date)
        if to_date:
            qs = qs.filter(entry_date__lte=to_date)
        if entry_no:
            qs = qs.filter(entry_no__icontains=entry_no)
        return qs

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        try:
            instance = TransPaymentMas.objects.using("transaction").get(entry_id=pk)
        except TransPaymentMas.DoesNotExist:
            try:
                instance = TransPaymentMas.objects.using("transaction").get(entry_no=pk)
            except TransPaymentMas.DoesNotExist:
                return Response({"detail": "Payment Entry not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="next-entry-no")
    def next_entry_no(self, request):
        now = datetime.datetime.now()
        prefix = f"PY{now.strftime('%y%m')}"
        last = (
            TransPaymentMas.objects.using("transaction")
            .filter(entry_no__startswith=prefix)
            .order_by("-entry_no")
            .first()
        )
        if last and len(last.entry_no) >= 10:
            try:
                seq = int(last.entry_no[6:]) + 1
            except ValueError:
                seq = 1
        else:
            seq = 1
        entry_no = f"{prefix}{seq:04d}"
        entry_id = f"ID-{entry_no}"
        return Response({"next_entry_no": entry_no, "entry_id": entry_id})

    @action(detail=False, methods=["get"], url_path="pending-bills")
    def pending_bills(self, request):
        """Returns outstanding credit/debit bills for the given supplier and criteria."""
        loc_id = request.query_params.get("location_id")
        comp_id = request.query_params.get("company_id")
        sup_id = request.query_params.get("supplier_id")
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        inc_date = request.query_params.get("inc_date") in ["true", "1", True]

        if not sup_id:
            return Response([])

        qs = TransBalanceDet.objects.using("transaction").filter(
            supplier_id=sup_id,
            closed=False
        )
        if loc_id:
            qs = qs.filter(location_id=loc_id)
        if comp_id:
            qs = qs.filter(company_id=comp_id)
        if inc_date:
            if from_date:
                qs = qs.filter(entry_date__gte=from_date)
            if to_date:
                qs = qs.filter(entry_date__lte=to_date)

        bills = []
        for b in qs:
            bills.append({
                "entry_id": b.entry_id,
                "entry_no": b.entry_no,
                "entry_date": b.entry_date.strftime("%Y-%m-%d") if b.entry_date else "",
                "inv_no": b.inv_no or b.entry_no,
                "inv_date": b.inv_date.strftime("%Y-%m-%d") if b.inv_date else (b.entry_date.strftime("%Y-%m-%d") if b.entry_date else ""),
                "inv_amount": float(b.credit_amount if b.credit_amount > 0 else b.debit_amount),
                "paid_amount": 0.0,
                "credit": float(b.credit_amount),
                "debit": float(b.debit_amount),
                "balance": float(b.balance),
                "closed": False,
                "net_amount": float(b.balance),
                "entry_type": b.entry_type or "PU",
                "cd_percentage": 0.0,
                "cd_amount": 0.0,
                "agent_id": 0,
                "agent_per": 0.0,
                "agent_amount": 0.0,
                "disc_per": 0.0,
                "disc_amount": 0.0,
                "delay_or_early": False,
                "interest_per": 0.0,
                "interest_amount": 0.0,
            })
        return Response(bills)

    @action(detail=False, methods=["get"], url_path="pending-advances")
    def pending_advances(self, request):
        """Returns unadjusted advances for the given supplier."""
        sup_id = request.query_params.get("supplier_id")
        loc_id = request.query_params.get("location_id")
        if not sup_id:
            return Response([])

        qs = TransSupplierAdvanceMas.objects.using("transaction").filter(
            supplier_id=sup_id,
            cancel=False
        )
        if loc_id:
            qs = qs.filter(location_id=loc_id)

        advances = []
        for adv in qs:
            advances.append({
                "entry_id": adv.entry_id,
                "entry_no": adv.entry_no,
                "entry_date": adv.entry_date.strftime("%Y-%m-%d") if adv.entry_date else "",
                "amount": float(adv.net_amount),
                "dd_cheque": "Cheque",
                "closed": False,
            })
        return Response(advances)

    def _build_details_xml(self, details, modes, taxes):
        """Constructs XML string conforming to SPTRANS_PAYMENT_MAS requirements with dual attribute & element support."""
        root = ET.Element("ROOT")

        for idx, d in enumerate(details, start=1):
            elem = ET.SubElement(root, "TRANS_PAYMENT_DET", {
                "ENTRYID": str(d.get("entry_id") or ""),
                "ENTRYNO": str(d.get("entry_no") or ""),
                "ENTRYDATE": str(d.get("entry_date") or ""),
                "ENTRYORDERID": str(d.get("entry_order_id", idx)),
                "INVOICENO": str(d.get("inv_no") or ""),
                "INVOICEDATE": str(d.get("inv_date") or ""),
                "INVAMOUNT": str(d.get("inv_amount", 0)),
                "PAIDAMOUNT": str(d.get("paid_amount", 0)),
                "BALANCE": str(d.get("balance", 0)),
                "CDPER": str(d.get("cd_percentage", 0)),
                "CDAMOUNT": str(d.get("cd_amount", 0)),
                "AGENTCODE": str(d.get("agent_id", 0)),
                "AGENTCOMMPER": str(d.get("agent_per", 0)),
                "AGENTCOMMAMOUNT": str(d.get("agent_amount", 0)),
                "DISCPER": str(d.get("disc_per", 0)),
                "DISCAMOUNT": str(d.get("disc_amount", 0)),
                "DELAYOREARLY": "1" if d.get("delay_or_early") else "0",
                "INTERESTPER": str(d.get("interest_per", 0)),
                "INTERESTAMOUNT": str(d.get("interest_amount", 0)),
                "NETAMOUNT": str(d.get("net_amount", 0)),
                "ENTRYTYPE": str(d.get("entry_type") or "PU"),
                "CLOSED": "1" if d.get("closed") else "0",
                "CREDIT": str(d.get("credit", 0)),
            })
            for k, v in list(elem.attrib.items()):
                sub = ET.SubElement(elem, k)
                sub.text = str(v)

        for idx, m in enumerate(modes, start=1):
            elem = ET.SubElement(root, "TRANS_PAYMENTMODE_DET", {
                "ENTRYORDERID": str(m.get("entry_order_id", idx)),
                "BANKCODE": str(m.get("bank_id", 0)),
                "PAYABLEAT": str(m.get("payable_at", 0)),
                "CHEQUENO": str(m.get("dd_or_cheque_no") or ""),
                "CHEQUEDATE": str(m.get("dd_or_cheque_date") or ""),
                "AMOUNT": str(m.get("amount", 0)),
                "SETNO": str(m.get("set_no") or ""),
            })
            for k, v in list(elem.attrib.items()):
                sub = ET.SubElement(elem, k)
                sub.text = str(v)

        for idx, t in enumerate(taxes, start=1):
            sign_str = "+" if not t.get("add_or_less_type") or t.get("add_or_less_type") == "+" else "-"
            elem = ET.SubElement(root, "TRANS_PAYMENTTAX_DET", {
                "ENTRYORDERID": str(t.get("entry_order_id", idx)),
                "ENTRYTYPE": str(t.get("entry_type") or "PY"),
                "TAXTYPECODE": str(t.get("tax_type_code", 0)),
                "ADDORLESSTYPE": sign_str,
                "TAXONAMOUNT": str(t.get("tax_on_amount", 0)),
                "TAXPERCENT": str(t.get("tax_percent", 0)),
                "AMOUNT": str(t.get("amount", 0)),
                "ROUNDOFF": str(t.get("round_off", 0)),
                "NETAMOUNT": str(t.get("net_amount", 0)),
            })
            for k, v in list(elem.attrib.items()):
                sub = ET.SubElement(elem, k)
                sub.text = str(v)

        return ET.tostring(root, encoding="utf-8").decode("utf-8")

    def create(self, request, *args, **kwargs):
        data = request.data
        location_id = data.get("location_id", 1)
        company_id = data.get("company_id", 1)
        supplier_id = data.get("supplier_id", 0)
        entry_date = data.get("entry_date") or datetime.date.today().isoformat()
        posted_by = data.get("posted_by", 0)
        pay_mode_type = data.get("pay_mode_type", "CS") # 'CS', 'CQ', 'UP'
        advance_amount = Decimal(str(data.get("advance_amount", 0)))
        add_less_amount = Decimal(str(data.get("add_less_amount", 0)))
        tax_amount = Decimal(str(data.get("tax_amount", 0)))
        paid_amount = Decimal(str(data.get("paid_amount", 0)))
        user_id = data.get("created_by") or 1

        details = data.get("payment_details", [])
        modes = data.get("payment_modes", [])
        taxes = data.get("payment_taxes", [])

        details_xml = self._build_details_xml(details, modes, taxes)

        # 1. Attempt Stored Procedure Execution
        entry_id = None
        try:
            sp_res = execute_custom_sp(
                "SPTRANS_PAYMENT_MAS",
                params={
                    "MODE": 0,
                    "LOCATIONCODE": location_id,
                    "COMPANYCODE": company_id,
                    "ENTRYID": None,
                    "ENTRYNO": None,
                    "ENTRYDATE": entry_date,
                    "SUPPLIERCODE": supplier_id,
                    "USERID": user_id,
                    "CANCEL": 0,
                    "SYSTEMNAME": "WEB_ERP",
                    "ERR": 0,
                    "DETAILS": details_xml,
                    "SETUPCODE": 0,
                    "POSTEDBY": posted_by,
                    "ADVANCEAMOUNT": advance_amount,
                    "ADDLESSAMOUNT": add_less_amount,
                    "TAXAMOUNT": tax_amount,
                    "PAIDAMOUNT": paid_amount,
                    "GENERATEENTRYNO": 1,
                    "ISEXPORT": 0,
                    "PAYMODETYPE": pay_mode_type,
                    "TABLENAME": "TRANS_PAYMENT_MAS",
                },
                database="transaction",
            )
            if sp_res and isinstance(sp_res, list) and len(sp_res) > 0:
                first_row = sp_res[0]
                entry_id = first_row.get("ENTRYID") or first_row.get("EntryID") or first_row.get("ENTRYNO")
        except Exception as e:
            print("SP execution failed or returned error, falling back to atomic ORM:", e)

        # 2. Fallback ORM transactional insertion
        if not entry_id:
            now = datetime.datetime.now()
            prefix = f"PY{now.strftime('%y%m')}"
            last = (
                TransPaymentMas.objects.using("transaction")
                .filter(entry_no__startswith=prefix)
                .order_by("-entry_no")
                .first()
            )
            seq = int(last.entry_no[6:]) + 1 if last and len(last.entry_no) >= 10 else 1
            entry_no = f"{prefix}{seq:04d}"
            entry_id = f"ID-{entry_no}"

            with transaction.atomic(using="transaction"):
                TransPaymentMas.objects.using("transaction").create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    location_id=location_id,
                    company_id=company_id,
                    supplier_id=supplier_id,
                    advance_amount=advance_amount,
                    add_less_amount=add_less_amount,
                    tax_amount=tax_amount,
                    paid_amount=paid_amount,
                    posted_by=posted_by,
                    system_name="WEB_ERP",
                    user_id=user_id,
                )

                for idx, d in enumerate(details, start=1):
                    p_amt = Decimal(str(d.get("paid_amount", 0)))
                    bal = Decimal(str(d.get("balance", 0))) - p_amt
                    TransPaymentDet.objects.using("transaction").create(
                        entry_id=entry_id,
                        ref_entry_id=d.get("entry_id") or entry_id,
                        ref_entry_no=d.get("entry_no") or entry_no,
                        ref_entry_date=d.get("entry_date") or entry_date,
                        entry_order_id=idx,
                        location_id=location_id,
                        company_id=company_id,
                        supplier_id=supplier_id,
                        inv_no=d.get("inv_no", ""),
                        inv_date=d.get("inv_date") or None,
                        inv_amount=Decimal(str(d.get("inv_amount", 0))),
                        entry_type=d.get("entry_type", "PU"),
                        paid_amount=p_amt,
                        balance_amount=max(Decimal("0.00"), bal),
                        cd_percentage=Decimal(str(d.get("cd_percentage", 0))),
                        cd_amount=Decimal(str(d.get("cd_amount", 0))),
                        agent_id=int(d.get("agent_id") or 0),
                        agent_per=Decimal(str(d.get("agent_per", 0))),
                        agent_amount=Decimal(str(d.get("agent_amount", 0))),
                        disc_per=Decimal(str(d.get("disc_per", 0))),
                        disc_amount=Decimal(str(d.get("disc_amount", 0))),
                        delay_or_early=bool(d.get("delay_or_early", False)),
                        interest_per=Decimal(str(d.get("interest_per", 0))),
                        interest_amount=Decimal(str(d.get("interest_amount", 0))),
                        net_amount=Decimal(str(d.get("net_amount", 0))),
                    )

                for idx, m in enumerate(modes, start=1):
                    TransPaymentModeDet.objects.using("transaction").create(
                        entry_id=entry_id,
                        entry_order_id=idx,
                        location_id=location_id,
                        pay_mode_type=pay_mode_type,
                        bank_id=int(m.get("bank_id") or 0),
                        set_no=m.get("set_no", ""),
                        payable_at=int(m.get("payable_at") or 0),
                        dd_or_cheque_no=m.get("dd_or_cheque_no", ""),
                        dd_or_cheque_date=m.get("dd_or_cheque_date") or None,
                        amount=Decimal(str(m.get("amount", 0))),
                    )

                for idx, t in enumerate(taxes, start=1):
                    TransPaymentTaxDet.objects.using("transaction").create(
                        entry_id=entry_id,
                        entry_no=entry_no,
                        entry_date=entry_date,
                        entry_order_id=idx,
                        location_id=location_id,
                        entry_type=t.get("entry_type", "PY"),
                        tax_type_code=int(t.get("tax_type_code") or 0),
                        add_or_less_type=bool(t.get("add_or_less_type", False)),
                        tax_on_amount=Decimal(str(t.get("tax_on_amount", 0))),
                        tax_percent=Decimal(str(t.get("tax_percent", 0))),
                        amount=Decimal(str(t.get("amount", 0))),
                        round_off=Decimal(str(t.get("round_off", 0))),
                        net_amount=Decimal(str(t.get("net_amount", 0))),
                    )

        return self.retrieve(request, **{"pk": entry_id})
