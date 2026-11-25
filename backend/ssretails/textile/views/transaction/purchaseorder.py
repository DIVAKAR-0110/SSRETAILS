# textile/views/transaction/purchaseorder.py
import datetime
import xml.etree.ElementTree as ET
from decimal import Decimal
from django.db import transaction, connections
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from textile.models.transaction.purchaseorder import (
    TransPurchaseOrderMas,
    TransPurchaseOrderDet,
    TransPurchaseOrderDiscountDet,
    TransPurchaseOrderSizeDet,
    TransPurchaseOrderAddLessDet,
)
from textile.serializers.transaction.purchaseorder import (
    TransPurchaseOrderMasSerializer,
    TransPurchaseOrderDetSerializer,
    TransPurchaseOrderDiscountDetSerializer,
    TransPurchaseOrderSizeDetSerializer,
    TransPurchaseOrderAddLessDetSerializer,
)
from textile.utils.sp_executor import execute_custom_sp


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = TransPurchaseOrderMas.objects.using("transaction").all().order_by("-entry_date", "-entry_no")
    serializer_class = TransPurchaseOrderMasSerializer

    def get_queryset(self):
        qs = TransPurchaseOrderMas.objects.using("transaction").all().order_by("-entry_date", "-entry_no")
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
            instance = TransPurchaseOrderMas.objects.using("transaction").get(entry_id=pk)
        except TransPurchaseOrderMas.DoesNotExist:
            try:
                instance = TransPurchaseOrderMas.objects.using("transaction").get(entry_no=pk)
            except TransPurchaseOrderMas.DoesNotExist:
                return Response({"detail": "Purchase Order not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="next-entry-no")
    def next_entry_no(self, request):
        location_id = request.query_params.get("location_id", 1)
        now = datetime.datetime.now()
        prefix = f"PO{now.strftime('%y%m')}"
        last = (
            TransPurchaseOrderMas.objects.using("transaction")
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

    @action(detail=False, methods=["get"], url_path="previous-orders")
    def previous_orders(self, request):
        location_id = request.query_params.get("location_id")
        qs = TransPurchaseOrderMas.objects.using("transaction").all().order_by("-entry_date", "-entry_no")
        if location_id:
            qs = qs.filter(location_id=location_id)
        orders = qs[:50]
        serializer = TransPurchaseOrderMasSerializer(orders, many=True)
        return Response(serializer.data)

    def _build_details_xml(self, discounts, items, sizes, add_less):
        """Constructs XML string conforming to SPTRANS_PURCHASEORDER_MAS requirements."""
        root = ET.Element("ROOT")

        for idx, d in enumerate(discounts, start=1):
            ET.SubElement(root, "CASHDISCOUNT", {
                "ENTRYORDERID": str(d.get("entry_order_id", idx)),
                "DAYS": str(d.get("days", 0)),
                "DISCOUNTPER": str(d.get("discount_per", 0)),
            })

        for idx, it in enumerate(items, start=1):
            ET.SubElement(root, "PURCHASEORDERDET", {
                "ENTRYORDERID": str(it.get("entry_order_id", idx)),
                "FIXEDCODE": str(it.get("fixed_code") or ""),
                "PRODUCTCODE": str(it.get("product_id", 0)),
                "ITEMCODE": str(it.get("item_id", 0)),
                "DESIGNNO": str(it.get("design_no") or ""),
                "QTY": str(it.get("qty", 0)),
                "MTRS": str(it.get("mtrs", 0)),
                "RATE": str(it.get("rate", 0)),
                "MRP": str(it.get("mrp", 0)),
                "AMOUNT": str(it.get("amount", 0)),
                "REMARKS": str(it.get("remarks") or ""),
                "PURCHASETAX1CODE": str(it.get("purchase_tax1_code", 0)),
                "PURCHASETAX2CODE": str(it.get("purchase_tax2_code", 0)),
                "PURCHASETAX3CODE": str(it.get("purchase_tax3_code", 0)),
                "DELIVERYDATE": str(it.get("delivery_date") or ""),
                "ITEMCATEGORYCODE1": str(it.get("item_category_code1", 0)),
                "ITEMCATEGORYCODE2": str(it.get("item_category_code2", 0)),
                "ITEMCATEGORYCODE3": str(it.get("item_category_code3", 0)),
                "ITEMCATEGORYCODE4": str(it.get("item_category_code4", 0)),
                "ITEMCATEGORYCODE5": str(it.get("item_category_code5", 0)),
                "ITEMCATEGORYCODE6": str(it.get("item_category_code6", 0)),
                "ITEMCATEGORYCODE7": str(it.get("item_category_code7", 0)),
                "ITEMCATEGORYCODE8": str(it.get("item_category_code8", 0)),
                "ITEMCATEGORYCODE9": str(it.get("item_category_code9", 0)),
                "IMAGENAME": str(it.get("image_name") or ""),
                "FROMSIZECODE": str(it.get("from_size_code", 0)),
                "TOSIZECODE": str(it.get("to_size_code", 0)),
                "JUMPRATIO": str(it.get("jump_ratio", 0)),
                "RECVDQTY": "0",
                "CANCELQTY": "0",
            })

        for idx, sz in enumerate(sizes, start=1):
            ET.SubElement(root, "SIZEDETAILS", {
                "MASENTRYORDERID": str(sz.get("mas_entry_order_id", 1)),
                "ENTRYORDERID": str(sz.get("entry_order_id", idx)),
                "FIXEDCODE": str(sz.get("fixed_code") or ""),
                "ITEMCATEGORYCODE1": str(sz.get("item_category_code1", 0)),
                "ITEMCATEGORYCODE2": str(sz.get("item_category_code2", 0)),
                "ITEMCATEGORYCODE3": str(sz.get("item_category_code3", 0)),
                "ITEMCATEGORYCODE4": str(sz.get("item_category_code4", 0)),
                "ITEMCATEGORYCODE5": str(sz.get("item_category_code5", 0)),
                "ITEMCATEGORYCODE6": str(sz.get("item_category_code6", 0)),
                "ITEMCATEGORYCODE7": str(sz.get("item_category_code7", 0)),
                "ITEMCATEGORYCODE8": str(sz.get("item_category_code8", 0)),
                "ITEMCATEGORYCODE9": str(sz.get("item_category_code9", 0)),
                "ITEMCATEGORYCODE10": str(sz.get("item_category_code10", 0)),
                "QTY": str(sz.get("qty", 0)),
                "MTRS": str(sz.get("mtrs", 0)),
                "NETRATE": str(sz.get("net_rate", 0)),
                "MRP": str(sz.get("mrp", 0)),
            })

        for idx, al in enumerate(add_less, start=1):
            sign = al.get("add_or_less_type")
            sign_str = "+" if sign is False or sign == 0 or sign == "+" else "-"
            ET.SubElement(root, "TAXDETAILS", {
                "ENTRYORDERID": str(al.get("entry_order_id", idx)),
                "ENTRYTYPE": str(al.get("entry_type", "PO")),
                "TAXTYPECODE": str(al.get("tax_type_code", 0)),
                "ADDORLESSTYPE": sign_str,
                "TAXPERCENT": str(al.get("tax_percent", 0)),
                "TAXONAMOUNT": str(al.get("tax_on_amount", 0)),
                "AMOUNT": str(al.get("amount", 0)),
                "ROUNDOFF": str(al.get("round_off", 0)),
                "NETAMOUNT": str(al.get("net_amount", 0)),
            })

        return ET.tostring(root, encoding="utf-8").decode("utf-8")

    def create(self, request, *args, **kwargs):
        data = request.data
        discounts = data.get("discount_details", [])
        items = data.get("item_details", [])
        sizes = data.get("size_details", [])
        add_less = data.get("add_less_details", [])

        location_id = data.get("location_id", 1)
        company_id = data.get("company_id", 1)
        entry_date = data.get("entry_date") or datetime.date.today().isoformat()
        purchase_type = data.get("purchase_type") or "Regular"
        order_no = data.get("order_no", "")
        order_date = data.get("order_date") or None
        supplier_id = data.get("supplier_id", 0)
        rep_name = data.get("rep_name", "")
        payment_terms = data.get("payment_terms", "")
        amount = Decimal(str(data.get("amount", 0)))
        remarks = data.get("remarks", "")
        user_id = data.get("created_by") or 1

        details_xml = self._build_details_xml(discounts, items, sizes, add_less)

        # 1. Attempt Stored Procedure execution
        entry_id = None
        try:
            sp_res = execute_custom_sp(
                "SPTRANS_PURCHASEORDER_MAS",
                params={
                    "MODE": 0,
                    "ENTRYNO": None,
                    "ENTRYDATE": entry_date,
                    "ENTRYID": None,
                    "COMPANYCODE": company_id,
                    "SYSTEMNAME": "WEB_ERP",
                    "LOCATIONCODE": location_id,
                    "PURCHASETYPE": purchase_type,
                    "ORDERNO": order_no,
                    "ORDERDATE": order_date,
                    "SUPPLIERCODE": supplier_id,
                    "REPNAME": rep_name,
                    "PAYMENTTERMS": payment_terms,
                    "AMOUNT": amount,
                    "REMARKS": remarks,
                    "USERID": user_id,
                    "CANCEL": 0,
                    "TABLENAME": "TRANS_PURCHASEORDER_MAS",
                    "DETAILS": details_xml,
                    "ERR": 0,
                },
                database="transaction",
            )
            if sp_res and isinstance(sp_res, list) and len(sp_res) > 0:
                first_row = sp_res[0]
                entry_id = first_row.get("ENTRYID") or first_row.get("EntryID") or first_row.get("ENTRYNO")
        except Exception as e:
            print("SP execution failed or returned error, falling back to atomic ORM:", e)

        # 3. Fallback ORM transactional insertion if SP was bypassed or did not return key
        if not entry_id:
            now = datetime.datetime.now()
            prefix = f"PO{now.strftime('%y%m')}"
            last = (
                TransPurchaseOrderMas.objects.using("transaction")
                .filter(entry_no__startswith=prefix)
                .order_by("-entry_no")
                .first()
            )
            seq = int(last.entry_no[6:]) + 1 if last and len(last.entry_no) >= 10 else 1
            entry_no = f"{prefix}{seq:04d}"
            entry_id = f"ID-{entry_no}"

            with transaction.atomic(using="transaction"):
                po_mas = TransPurchaseOrderMas.objects.using("transaction").create(
                    entry_id=entry_id,
                    entry_no=entry_no,
                    entry_date=entry_date,
                    location_id=location_id,
                    company_id=company_id,
                    purchase_type=purchase_type,
                    order_no=order_no,
                    order_date=order_date,
                    supplier_id=supplier_id,
                    rep_name=rep_name,
                    payment_terms=payment_terms,
                    amount=amount,
                    remarks=remarks,
                    system_name="WEB_ERP",
                    user_id=user_id,
                )

                for idx, d in enumerate(discounts, start=1):
                    TransPurchaseOrderDiscountDet.objects.using("transaction").create(
                        entry_id=entry_id,
                        entry_no=entry_no,
                        entry_date=entry_date,
                        entry_order_id=idx,
                        days=int(d.get("days", 0)),
                        discount_per=Decimal(str(d.get("discount_per", 0))),
                        location_id=location_id,
                    )

                for idx, it in enumerate(items, start=1):
                    qty = Decimal(str(it.get("qty", 0)))
                    mtrs = Decimal(str(it.get("mtrs", 0)))
                    rate = Decimal(str(it.get("rate", 0)))
                    amt = Decimal(str(it.get("amount", qty * rate)))
                    TransPurchaseOrderDet.objects.using("transaction").create(
                        entry_id=entry_id,
                        entry_no=entry_no,
                        entry_date=entry_date,
                        entry_order_id=idx,
                        fixed_code=it.get("fixed_code", ""),
                        product_id=int(it.get("product_id") or 0),
                        item_id=int(it.get("item_id") or 0),
                        design_no=it.get("design_no", ""),
                        qty=qty,
                        mtrs=mtrs,
                        total_qty=qty * mtrs if mtrs > 0 else qty,
                        rate=rate,
                        amount=amt,
                        mrp=Decimal(str(it.get("mrp", 0))),
                        delivery_date=it.get("delivery_date") or None,
                        remarks=it.get("remarks", ""),
                        location_id=location_id,
                    )

                for idx, sz in enumerate(sizes, start=1):
                    TransPurchaseOrderSizeDet.objects.using("transaction").create(
                        entry_id=entry_id,
                        entry_no=entry_no,
                        entry_date=entry_date,
                        mas_entry_order_id=int(sz.get("mas_entry_order_id", 1)),
                        entry_order_id=idx,
                        fixed_code=sz.get("fixed_code", ""),
                        qty=Decimal(str(sz.get("qty", 0))),
                        mtrs=Decimal(str(sz.get("mtrs", 0))),
                        net_rate=Decimal(str(sz.get("net_rate", 0))),
                        mrp=Decimal(str(sz.get("mrp", 0))),
                        location_id=location_id,
                    )

                for idx, al in enumerate(add_less, start=1):
                    TransPurchaseOrderAddLessDet.objects.using("transaction").create(
                        entry_id=entry_id,
                        entry_no=entry_no,
                        entry_date=entry_date,
                        entry_order_id=idx,
                        entry_type=al.get("entry_type", "PO"),
                        tax_type_code=int(al.get("tax_type_code") or 0),
                        add_or_less_type=bool(al.get("add_or_less_type", False)),
                        tax_percent=Decimal(str(al.get("tax_percent", 0))),
                        tax_on_amount=Decimal(str(al.get("tax_on_amount", 0))),
                        amount=Decimal(str(al.get("amount", 0))),
                        round_off=Decimal(str(al.get("round_off", 0))),
                        net_amount=Decimal(str(al.get("net_amount", 0))),
                        location_id=location_id,
                    )

        return self.retrieve(request, **{"pk": entry_id})

    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        po = TransPurchaseOrderMas.objects.using("transaction").filter(entry_id=pk).first()
        if not po:
            return Response({"detail": "Purchase Order not found."}, status=status.HTTP_404_NOT_FOUND)
        po.cancel = True
        po.cancel_user_id = request.data.get("user_id", 1)
        po.cancel_user_entry_datetime = datetime.datetime.now()
        po.save(using="transaction")
        return Response({"message": "Purchase Order cancelled successfully."}, status=status.HTTP_200_OK)
