# textile/views/master/job_work.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction, connection
from django.db.models import Q
from textile.utils import StoredProcedureMasterViewSetMixin, execute_master_sp

from textile.models.master.job_work import (
    JobWorkChargeHeadMas,
    TailorMas,
    ContactDetailsMas,
    TailorChargeMas,
    TailorConsumptionMas,
    SupplierChargeMas,
    SupplierConsumptionMas,
)
from textile.models.master.intractors import SupplierMas
from textile.serializers.master.job_work import (
    JobWorkChargeHeadSerializer,
    TailorMasSerializer,
    ContactDetailsSerializer,
    TailorChargeSerializer,
    TailorConsumptionSerializer,
    SupplierChargeSerializer,
    SupplierConsumptionSerializer,
)


class JobWorkChargeHeadViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "SPJOBWORKCHARGEHEADMAS"
    queryset = JobWorkChargeHeadMas.objects.all().order_by("name")
    serializer_class = JobWorkChargeHeadSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = JobWorkChargeHeadMas.objects.all().order_by("name")
        search = self.request.query_params.get("search", "").strip()
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(shortname__icontains=search))
        return qs


class TailorMasViewSet(viewsets.ModelViewSet):
    queryset = TailorMas.objects.all().order_by("name")
    serializer_class = TailorMasSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = TailorMas.objects.all().order_by("name")
        search = self.request.query_params.get("search", "").strip()
        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(shortname__icontains=search)
                | Q(mobile__icontains=search)
                | Q(phoneno__icontains=search)
            )
        return qs

    def retrieve(self, request, *args, **kwargs):
        tailor = self.get_object()
        serializer = self.get_serializer(tailor)
        data = serializer.data

        # Fetch contacts
        contacts = ContactDetailsMas.objects.filter(
            mas_code=tailor.id, mas_from="TAILOR"
        ).order_by("entry_order_id")
        data["contacts"] = ContactDetailsSerializer(contacts, many=True).data

        # Fetch charges
        charges = TailorChargeMas.objects.filter(tailor_id=tailor.id).order_by("entry_order_id")
        data["charges"] = TailorChargeSerializer(charges, many=True).data

        # Fetch consumptions
        consumptions = TailorConsumptionMas.objects.filter(tailor_id=tailor.id).order_by("entry_order_id")
        data["consumptions"] = TailorConsumptionSerializer(consumptions, many=True).data

        return Response(data)

    def create(self, request, *args, **kwargs):
        contacts_data = request.data.get("contacts", [])
        charges_data = request.data.get("charges", [])
        consumptions_data = request.data.get("consumptions", [])

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            new_id = execute_master_sp("SPTAILORMAS", mode=0, data=serializer.validated_data)
            tailor = TailorMas.objects.get(pk=new_id)

            # Save contacts
            for idx, c in enumerate(contacts_data, start=1):
                ContactDetailsMas.objects.create(
                    mas_code=tailor.id,
                    mas_from="TAILOR",
                    name=(c.get("name") or "").strip().upper(),
                    shortname=(c.get("shortname") or "").strip().upper(),
                    gender=c.get("gender") or "",
                    designation=c.get("designation") or "",
                    dob=c.get("dob") or None,
                    doa=c.get("doa") or None,
                    address=c.get("address") or "",
                    city_id=c.get("city_id") or 0,
                    phoneno=c.get("phoneno") or "",
                    extension_no=c.get("extension_no") or "",
                    mobile=c.get("mobile") or "",
                    fax=c.get("fax") or "",
                    email=c.get("email") or "",
                    relation_code=0,
                    religion_code=0,
                )

            # Save charges
            for idx, ch in enumerate(charges_data, start=1):
                if ch.get("charge_head_id"):
                    TailorChargeMas.objects.create(
                        tailor_id=tailor.id,
                        charge_head_id=ch.get("charge_head_id"),
                        charge=ch.get("charge") or 0,
                    )

            # Save consumptions
            for idx, cs in enumerate(consumptions_data, start=1):
                if cs.get("product_id") or cs.get("item_id"):
                    TailorConsumptionMas.objects.create(
                        tailor_id=tailor.id,
                        product_id=cs.get("product_id") or 0,
                        item_id=cs.get("item_id") or 0,
                        design_no=cs.get("design_no") or "",
                        cons_pcs=cs.get("cons_pcs") or 0,
                        item_category_1=cs.get("item_category_1") or 0,
                        item_category_2=cs.get("item_category_2") or 0,
                        item_category_3=cs.get("item_category_3") or 0,
                        item_category_4=cs.get("item_category_4") or 0,
                        item_category_5=cs.get("item_category_5") or 0,
                        item_category_6=cs.get("item_category_6") or 0,
                        item_category_7=cs.get("item_category_7") or 0,
                        item_category_8=cs.get("item_category_8") or 0,
                        item_category_9=cs.get("item_category_9") or 0,
                        item_category_10=cs.get("item_category_10") or 0,
                    )

        # Return refreshed payload
        res_serializer = self.get_serializer(tailor)
        res_data = res_serializer.data
        res_data["contacts"] = ContactDetailsSerializer(
            ContactDetailsMas.objects.filter(mas_code=tailor.id, mas_from="TAILOR").order_by("entry_order_id"),
            many=True
        ).data
        res_data["charges"] = TailorChargeSerializer(
            TailorChargeMas.objects.filter(tailor_id=tailor.id).order_by("entry_order_id"),
            many=True
        ).data
        res_data["consumptions"] = TailorConsumptionSerializer(
            TailorConsumptionMas.objects.filter(tailor_id=tailor.id).order_by("entry_order_id"),
            many=True
        ).data
        return Response(res_data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        tailor = self.get_object()
        contacts_data = request.data.get("contacts", [])
        charges_data = request.data.get("charges", [])
        consumptions_data = request.data.get("consumptions", [])

        serializer = self.get_serializer(tailor, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            execute_master_sp("SPTAILORMAS", mode=1, code=tailor.pk, data=serializer.validated_data)
            tailor.refresh_from_db()

            # Clean existing child records matching SPTAILORMAS Mode 1
            ContactDetailsMas.objects.filter(mas_code=tailor.id, mas_from="TAILOR").delete()
            TailorChargeMas.objects.filter(tailor_id=tailor.id).delete()
            TailorConsumptionMas.objects.filter(tailor_id=tailor.id).delete()

            # Re-insert contacts
            for idx, c in enumerate(contacts_data, start=1):
                ContactDetailsMas.objects.create(
                    mas_code=tailor.id,
                    mas_from="TAILOR",
                    name=(c.get("name") or "").strip().upper(),
                    shortname=(c.get("shortname") or "").strip().upper(),
                    gender=c.get("gender") or "",
                    designation=c.get("designation") or "",
                    dob=c.get("dob") or None,
                    doa=c.get("doa") or None,
                    address=c.get("address") or "",
                    city_id=c.get("city_id") or 0,
                    phoneno=c.get("phoneno") or "",
                    extension_no=c.get("extension_no") or "",
                    mobile=c.get("mobile") or "",
                    fax=c.get("fax") or "",
                    email=c.get("email") or "",
                    relation_code=0,
                    religion_code=0,
                )

            # Re-insert charges
            for idx, ch in enumerate(charges_data, start=1):
                if ch.get("charge_head_id"):
                    TailorChargeMas.objects.create(
                        tailor_id=tailor.id,
                        charge_head_id=ch.get("charge_head_id"),
                        charge=ch.get("charge") or 0,
                    )

            # Re-insert consumptions
            for idx, cs in enumerate(consumptions_data, start=1):
                if cs.get("product_id") or cs.get("item_id"):
                    TailorConsumptionMas.objects.create(
                        tailor_id=tailor.id,
                        product_id=cs.get("product_id") or 0,
                        item_id=cs.get("item_id") or 0,
                        design_no=cs.get("design_no") or "",
                        cons_pcs=cs.get("cons_pcs") or 0,
                        item_category_1=cs.get("item_category_1") or 0,
                        item_category_2=cs.get("item_category_2") or 0,
                        item_category_3=cs.get("item_category_3") or 0,
                        item_category_4=cs.get("item_category_4") or 0,
                        item_category_5=cs.get("item_category_5") or 0,
                        item_category_6=cs.get("item_category_6") or 0,
                        item_category_7=cs.get("item_category_7") or 0,
                        item_category_8=cs.get("item_category_8") or 0,
                        item_category_9=cs.get("item_category_9") or 0,
                        item_category_10=cs.get("item_category_10") or 0,
                    )

        res_serializer = self.get_serializer(tailor)
        res_data = res_serializer.data
        res_data["contacts"] = ContactDetailsSerializer(
            ContactDetailsMas.objects.filter(mas_code=tailor.id, mas_from="TAILOR").order_by("entry_order_id"),
            many=True
        ).data
        res_data["charges"] = TailorChargeSerializer(
            TailorChargeMas.objects.filter(tailor_id=tailor.id).order_by("entry_order_id"),
            many=True
        ).data
        res_data["consumptions"] = TailorConsumptionSerializer(
            TailorConsumptionMas.objects.filter(tailor_id=tailor.id).order_by("entry_order_id"),
            many=True
        ).data
        return Response(res_data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        tailor = self.get_object()
        with transaction.atomic():
            ContactDetailsMas.objects.filter(mas_code=tailor.id, mas_from="TAILOR").delete()
            TailorChargeMas.objects.filter(tailor_id=tailor.id).delete()
            TailorConsumptionMas.objects.filter(tailor_id=tailor.id).delete()
            execute_master_sp("SPTAILORMAS", mode=2, code=tailor.pk)
        return Response({"message": "Tailor deleted successfully."}, status=status.HTTP_200_OK)


class ConsumptionMasterViewSet(viewsets.ViewSet):
    """
    Configures Supplier Job Work charges and consumptions (SPSUPPLIERJOBWORKMAS).
    """
    permission_classes = [AllowAny]

    def list(self, request):
        search = request.query_params.get("search", "").strip()
        qs = SupplierMas.objects.filter(active=True).order_by("name")
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(shortname__icontains=search))

        data = []
        for s in qs:
            charges_count = SupplierChargeMas.objects.filter(supplier_id=s.id).count()
            consumptions_count = SupplierConsumptionMas.objects.filter(supplier_id=s.id).count()
            data.append({
                "id": s.id,
                "name": s.name,
                "shortname": s.shortname,
                "active": s.active,
                "charges_count": charges_count,
                "consumptions_count": consumptions_count,
            })
        return Response(data)

    def retrieve(self, request, pk=None):
        supplier = SupplierMas.objects.filter(id=pk).first()
        if not supplier:
            return Response({"error": "Supplier not found."}, status=status.HTTP_404_NOT_FOUND)

        charges = SupplierChargeMas.objects.filter(supplier_id=supplier.id).order_by("entry_order_id")
        consumptions = SupplierConsumptionMas.objects.filter(supplier_id=supplier.id).order_by("entry_order_id")

        return Response({
            "supplier_id": supplier.id,
            "supplier_name": supplier.name,
            "supplier_shortname": supplier.shortname,
            "charges": SupplierChargeSerializer(charges, many=True).data,
            "consumptions": SupplierConsumptionSerializer(consumptions, many=True).data,
        })

    def update(self, request, pk=None):
        supplier = SupplierMas.objects.filter(id=pk).first()
        if not supplier:
            return Response({"error": "Supplier not found."}, status=status.HTTP_404_NOT_FOUND)

        charges_data = request.data.get("charges", [])
        consumptions_data = request.data.get("consumptions", [])

        with transaction.atomic():
            # Clean existing child records matching SPSUPPLIERJOBWORKMAS Mode 1
            SupplierChargeMas.objects.filter(supplier_id=supplier.id).delete()
            SupplierConsumptionMas.objects.filter(supplier_id=supplier.id).delete()

            # Insert charges
            for idx, ch in enumerate(charges_data, start=1):
                if ch.get("charge_head_id"):
                    SupplierChargeMas.objects.create(
                        supplier_id=supplier.id,
                        charge_head_id=ch.get("charge_head_id"),
                        charge=ch.get("charge") or 0,
                    )

            # Insert consumptions
            for idx, cs in enumerate(consumptions_data, start=1):
                if cs.get("product_id") or cs.get("item_id"):
                    SupplierConsumptionMas.objects.create(
                        supplier_id=supplier.id,
                        product_id=cs.get("product_id") or 0,
                        item_id=cs.get("item_id") or 0,
                        design_no=cs.get("design_no") or "",
                        cons_pcs=cs.get("cons_pcs") or 0,
                        item_category_1=cs.get("item_category_1") or 0,
                        item_category_2=cs.get("item_category_2") or 0,
                        item_category_3=cs.get("item_category_3") or 0,
                        item_category_4=cs.get("item_category_4") or 0,
                        item_category_5=cs.get("item_category_5") or 0,
                        item_category_6=cs.get("item_category_6") or 0,
                        item_category_7=cs.get("item_category_7") or 0,
                        item_category_8=cs.get("item_category_8") or 0,
                        item_category_9=cs.get("item_category_9") or 0,
                        item_category_10=cs.get("item_category_10") or 0,
                    )

        return self.retrieve(request, pk=supplier.id)

    def create(self, request):
        supplier_id = request.data.get("supplier_id")
        return self.update(request, pk=supplier_id)


from rest_framework.decorators import api_view, permission_classes
from textile.models.master.item_definition import ProductMas, ItemMas


@api_view(["GET"])
@permission_classes([AllowAny])
def jobwork_products_lookup(request):
    prods = ProductMas.objects.filter(active=True).order_by("name")
    data = [{"id": p.id, "name": p.name, "shortname": p.shortname or ""} for p in prods]
    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def jobwork_items_lookup(request):
    items = ItemMas.objects.filter(active=True).order_by("name")
    data = [{"id": i.id, "name": i.name, "shortname": i.shortname or ""} for i in items]
    return Response(data)
