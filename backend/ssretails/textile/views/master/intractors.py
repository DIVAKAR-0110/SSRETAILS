# textile/views/master/intractors.py
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import transaction

from textile.models.master.intractors import (
    SupplierMas, SupplierCompanyMas, SupplierItemTypeMas,
    AgentMas, AgentCompanyMas,
    ManufactureMas,
    CustomerMas, CustomerCompanyMas,
    CourierMas, TransportMas, TransportCompanyMas
)
from textile.models.master.job_work import ContactDetailsMas
from textile.serializers.master.intractors import (
    SupplierSerializer, SupplierCompanySerializer, SupplierItemTypeSerializer,
    AgentSerializer, AgentCompanySerializer,
    ManufactureSerializer,
    CustomerSerializer, CustomerCompanySerializer,
    CourierSerializer, TransportSerializer, TransportCompanySerializer
)
from textile.serializers.master.job_work import ContactDetailsSerializer


# ==========================================
# 1. Supplier ViewSet
# ==========================================
class SupplierViewSet(viewsets.ModelViewSet):
    queryset = SupplierMas.objects.all().order_by('name')
    serializer_class = SupplierSerializer
    permission_classes = [AllowAny]

    def _attach_child_data(self, supplier_id, data):
        contacts = ContactDetailsMas.objects.filter(
            mas_from='SUPPLIER', mas_code=supplier_id
        )
        companies = SupplierCompanyMas.objects.filter(supplier_id=supplier_id)
        item_types = SupplierItemTypeMas.objects.filter(supplier_id=supplier_id)

        data["contacts"] = ContactDetailsSerializer(contacts, many=True).data
        data["companies"] = SupplierCompanySerializer(companies, many=True).data
        data["item_types"] = SupplierItemTypeSerializer(item_types, many=True).data
        return data

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = dict(serializer.data)
        data = self._attach_child_data(instance.id, data)
        return Response(data)

    def _sync_child_records(self, supplier_id, raw_data):
        # 1. Sync Contacts
        contacts_data = raw_data.get("contacts")
        if contacts_data is not None:
            ContactDetailsMas.objects.filter(
                mas_from='SUPPLIER', mas_code=supplier_id
            ).delete()
            for c in contacts_data:
                name = c.get("name")
                if not name:
                    continue
                ContactDetailsMas.objects.create(
                    mas_code=supplier_id,
                    mas_from='SUPPLIER',
                    name=name.strip().upper(),
                    shortname=(c.get("shortname") or "").strip().upper(),
                    gender=c.get("gender", ""),
                    designation=c.get("designation", ""),
                    dob=c.get("dob") or None,
                    doa=c.get("doa") or None,
                    address=c.get("address", ""),
                    city_id=int(c.get("city_id") or 0),
                    phoneno=c.get("phoneno", ""),
                    extension_no=c.get("extension_no", ""),
                    mobile=c.get("mobile", ""),
                    fax=c.get("fax", ""),
                    email=c.get("email", ""),
                    relation_code=int(c.get("relation_code") or 0),
                    religion_code=int(c.get("religion_code") or 0),
                )

        # 2. Sync Companies
        companies_data = raw_data.get("companies")
        if companies_data is not None:
            SupplierCompanyMas.objects.filter(supplier_id=supplier_id).delete()
            for comp in companies_data:
                c_id = comp.get("company_id") or comp.get("id")
                selected = comp.get("select", True)
                if c_id and selected:
                    SupplierCompanyMas.objects.create(
                        supplier_id=supplier_id,
                        company_id=int(c_id),
                        opening_balance=comp.get("opening_balance") or 0.00
                    )

        # 3. Sync Item Types
        item_types_data = raw_data.get("item_types")
        if item_types_data is not None:
            SupplierItemTypeMas.objects.filter(supplier_id=supplier_id).delete()
            for it in item_types_data:
                it_id = it.get("item_type_id") or it.get("id")
                selected = it.get("select", True)
                if it_id and selected:
                    SupplierItemTypeMas.objects.create(
                        supplier_id=supplier_id,
                        item_type_id=int(it_id)
                    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            supplier = serializer.save()
            self._sync_child_records(supplier.id, request.data)

        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        data = self._attach_child_data(supplier.id, data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            supplier = serializer.save()
            self._sync_child_records(supplier.id, request.data)

        data = dict(serializer.data)
        data = self._attach_child_data(supplier.id, data)
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with transaction.atomic():
            ContactDetailsMas.objects.filter(
                mas_from='SUPPLIER', mas_code=instance.id
            ).delete()
            SupplierCompanyMas.objects.filter(supplier_id=instance.id).delete()
            SupplierItemTypeMas.objects.filter(supplier_id=instance.id).delete()
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==========================================
# 2. Agent ViewSet
# ==========================================
class AgentViewSet(viewsets.ModelViewSet):
    queryset = AgentMas.objects.all().order_by('name')
    serializer_class = AgentSerializer
    permission_classes = [AllowAny]

    def _attach_child_data(self, agent_id, data):
        contacts = ContactDetailsMas.objects.filter(
            mas_from='AGENT', mas_code=agent_id
        )
        companies = AgentCompanyMas.objects.filter(agent_id=agent_id)

        data["contacts"] = ContactDetailsSerializer(contacts, many=True).data
        data["companies"] = AgentCompanySerializer(companies, many=True).data
        return data

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = dict(serializer.data)
        data = self._attach_child_data(instance.id, data)
        return Response(data)

    def _sync_child_records(self, agent_id, raw_data):
        # 1. Contacts
        contacts_data = raw_data.get("contacts")
        if contacts_data is not None:
            ContactDetailsMas.objects.filter(
                mas_from='AGENT', mas_code=agent_id
            ).delete()
            for c in contacts_data:
                name = c.get("name")
                if not name:
                    continue
                ContactDetailsMas.objects.create(
                    mas_code=agent_id,
                    mas_from='AGENT',
                    name=name.strip().upper(),
                    shortname=(c.get("shortname") or "").strip().upper(),
                    gender=c.get("gender", ""),
                    designation=c.get("designation", ""),
                    dob=c.get("dob") or None,
                    doa=c.get("doa") or None,
                    address=c.get("address", ""),
                    city_id=int(c.get("city_id") or 0),
                    phoneno=c.get("phoneno", ""),
                    extension_no=c.get("extension_no", ""),
                    mobile=c.get("mobile", ""),
                    fax=c.get("fax", ""),
                    email=c.get("email", ""),
                    relation_code=int(c.get("relation_code") or 0),
                    religion_code=int(c.get("religion_code") or 0),
                )

        # 2. Companies
        companies_data = raw_data.get("companies")
        if companies_data is not None:
            AgentCompanyMas.objects.filter(agent_id=agent_id).delete()
            for comp in companies_data:
                c_id = comp.get("company_id") or comp.get("id")
                selected = comp.get("select", True)
                if c_id and selected:
                    AgentCompanyMas.objects.create(
                        agent_id=agent_id,
                        company_id=int(c_id),
                        opening_balance=comp.get("opening_balance") or 0.00
                    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            agent = serializer.save()
            self._sync_child_records(agent.id, request.data)

        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        data = self._attach_child_data(agent.id, data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            agent = serializer.save()
            self._sync_child_records(agent.id, request.data)

        data = dict(serializer.data)
        data = self._attach_child_data(agent.id, data)
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with transaction.atomic():
            ContactDetailsMas.objects.filter(
                mas_from='AGENT', mas_code=instance.id
            ).delete()
            AgentCompanyMas.objects.filter(agent_id=instance.id).delete()
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==========================================
# 3. Manufacture ViewSet
# ==========================================
class ManufactureViewSet(viewsets.ModelViewSet):
    queryset = ManufactureMas.objects.all().order_by('name')
    serializer_class = ManufactureSerializer
    permission_classes = [AllowAny]

    def _attach_child_data(self, manufacture_id, data):
        contacts = ContactDetailsMas.objects.filter(
            mas_from='MANUFACTURE', mas_code=manufacture_id
        )
        data["contacts"] = ContactDetailsSerializer(contacts, many=True).data
        return data

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = dict(serializer.data)
        data = self._attach_child_data(instance.id, data)
        return Response(data)

    def _sync_child_records(self, manufacture_id, raw_data):
        contacts_data = raw_data.get("contacts")
        if contacts_data is not None:
            ContactDetailsMas.objects.filter(
                mas_from='MANUFACTURE', mas_code=manufacture_id
            ).delete()
            for c in contacts_data:
                name = c.get("name")
                if not name:
                    continue
                ContactDetailsMas.objects.create(
                    mas_code=manufacture_id,
                    mas_from='MANUFACTURE',
                    name=name.strip().upper(),
                    shortname=(c.get("shortname") or "").strip().upper(),
                    gender=c.get("gender", ""),
                    designation=c.get("designation", ""),
                    dob=c.get("dob") or None,
                    doa=c.get("doa") or None,
                    address=c.get("address", ""),
                    city_id=int(c.get("city_id") or 0),
                    phoneno=c.get("phoneno", ""),
                    extension_no=c.get("extension_no", ""),
                    mobile=c.get("mobile", ""),
                    fax=c.get("fax", ""),
                    email=c.get("email", ""),
                    relation_code=int(c.get("relation_code") or 0),
                    religion_code=int(c.get("religion_code") or 0),
                )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            manufacture = serializer.save()
            self._sync_child_records(manufacture.id, request.data)

        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        data = self._attach_child_data(manufacture.id, data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            manufacture = serializer.save()
            self._sync_child_records(manufacture.id, request.data)

        data = dict(serializer.data)
        data = self._attach_child_data(manufacture.id, data)
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with transaction.atomic():
            ContactDetailsMas.objects.filter(
                mas_from='MANUFACTURE', mas_code=instance.id
            ).delete()
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==========================================
# 4. Customer ViewSet
# ==========================================
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = CustomerMas.objects.all().order_by('name')
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]

    def _attach_child_data(self, customer_id, data):
        contacts = ContactDetailsMas.objects.filter(
            mas_from='CUSTOMER', mas_code=customer_id
        )
        companies = CustomerCompanyMas.objects.filter(customer_id=customer_id)

        data["contacts"] = ContactDetailsSerializer(contacts, many=True).data
        data["companies"] = CustomerCompanySerializer(companies, many=True).data
        return data

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = dict(serializer.data)
        data = self._attach_child_data(instance.id, data)
        return Response(data)

    def _sync_child_records(self, customer_id, raw_data):
        # 1. Contacts
        contacts_data = raw_data.get("contacts")
        if contacts_data is not None:
            ContactDetailsMas.objects.filter(
                mas_from='CUSTOMER', mas_code=customer_id
            ).delete()
            for c in contacts_data:
                name = c.get("name")
                if not name:
                    continue
                ContactDetailsMas.objects.create(
                    mas_code=customer_id,
                    mas_from='CUSTOMER',
                    name=name.strip().upper(),
                    shortname=(c.get("shortname") or "").strip().upper(),
                    gender=c.get("gender", ""),
                    designation=c.get("designation", ""),
                    dob=c.get("dob") or None,
                    doa=c.get("doa") or None,
                    address=c.get("address", ""),
                    city_id=int(c.get("city_id") or 0),
                    phoneno=c.get("phoneno", ""),
                    extension_no=c.get("extension_no", ""),
                    mobile=c.get("mobile", ""),
                    fax=c.get("fax", ""),
                    email=c.get("email", ""),
                    relation_code=int(c.get("relation_code") or 0),
                    religion_code=int(c.get("religion_code") or 0),
                )

        # 2. Companies
        companies_data = raw_data.get("companies")
        if companies_data is not None:
            CustomerCompanyMas.objects.filter(customer_id=customer_id).delete()
            for comp in companies_data:
                c_id = comp.get("company_id") or comp.get("id")
                selected = comp.get("select", True)
                if c_id and selected:
                    CustomerCompanyMas.objects.create(
                        customer_id=customer_id,
                        company_id=int(c_id),
                        opening_balance=comp.get("opening_balance") or 0.00
                    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            customer = serializer.save()
            self._sync_child_records(customer.id, request.data)

        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        data = self._attach_child_data(customer.id, data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            customer = serializer.save()
            self._sync_child_records(customer.id, request.data)

        data = dict(serializer.data)
        data = self._attach_child_data(customer.id, data)
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with transaction.atomic():
            ContactDetailsMas.objects.filter(
                mas_from='CUSTOMER', mas_code=instance.id
            ).delete()
            CustomerCompanyMas.objects.filter(customer_id=instance.id).delete()
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==========================================
# 5. Courier ViewSet
# ==========================================
class CourierViewSet(viewsets.ModelViewSet):
    queryset = CourierMas.objects.all().order_by('name')
    serializer_class = CourierSerializer
    permission_classes = [AllowAny]

    def _attach_child_data(self, courier_id, data):
        contacts = ContactDetailsMas.objects.filter(
            mas_from__in=['COURIER', 'COURIERMAS'], mas_code=courier_id
        )
        data["contacts"] = ContactDetailsSerializer(contacts, many=True).data
        return data

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = dict(serializer.data)
        data = self._attach_child_data(instance.id, data)
        return Response(data)

    def _sync_child_records(self, courier_id, raw_data):
        contacts_data = raw_data.get("contacts")
        if contacts_data is not None:
            ContactDetailsMas.objects.filter(
                mas_from__in=['COURIER', 'COURIERMAS'], mas_code=courier_id
            ).delete()
            for c in contacts_data:
                name = c.get("name")
                if not name:
                    continue
                ContactDetailsMas.objects.create(
                    mas_code=courier_id,
                    mas_from='COURIER',
                    name=name.strip().upper(),
                    shortname=(c.get("shortname") or "").strip().upper(),
                    gender=c.get("gender", ""),
                    designation=c.get("designation", ""),
                    dob=c.get("dob") or None,
                    doa=c.get("doa") or None,
                    address=c.get("address", ""),
                    city_id=int(c.get("city_id") or 0),
                    phoneno=c.get("phoneno", ""),
                    extension_no=c.get("extension_no", ""),
                    mobile=c.get("mobile", ""),
                    fax=c.get("fax", ""),
                    email=c.get("email", ""),
                    relation_code=int(c.get("relation_code") or 0),
                    religion_code=int(c.get("religion_code") or 0),
                )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            courier = serializer.save()
            self._sync_child_records(courier.id, request.data)

        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        data = self._attach_child_data(courier.id, data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            courier = serializer.save()
            self._sync_child_records(courier.id, request.data)

        data = dict(serializer.data)
        data = self._attach_child_data(courier.id, data)
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with transaction.atomic():
            ContactDetailsMas.objects.filter(
                mas_from__in=['COURIER', 'COURIERMAS'], mas_code=instance.id
            ).delete()
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==========================================
# 6. Transport ViewSet
# ==========================================
class TransportViewSet(viewsets.ModelViewSet):
    queryset = TransportMas.objects.all().order_by('name')
    serializer_class = TransportSerializer
    permission_classes = [AllowAny]

    def _attach_child_data(self, transport_id, data):
        contacts = ContactDetailsMas.objects.filter(
            mas_from__in=['TRANSPORT', 'TRANSPORTMAS'], mas_code=transport_id
        )
        companies = TransportCompanyMas.objects.filter(transport_id=transport_id)

        data["contacts"] = ContactDetailsSerializer(contacts, many=True).data
        data["companies"] = TransportCompanySerializer(companies, many=True).data
        return data

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = dict(serializer.data)
        data = self._attach_child_data(instance.id, data)
        return Response(data)

    def _sync_child_records(self, transport_id, raw_data):
        # 1. Contacts
        contacts_data = raw_data.get("contacts")
        if contacts_data is not None:
            ContactDetailsMas.objects.filter(
                mas_from__in=['TRANSPORT', 'TRANSPORTMAS'], mas_code=transport_id
            ).delete()
            for c in contacts_data:
                name = c.get("name")
                if not name:
                    continue
                ContactDetailsMas.objects.create(
                    mas_code=transport_id,
                    mas_from='TRANSPORTMAS',
                    name=name.strip().upper(),
                    shortname=(c.get("shortname") or "").strip().upper(),
                    gender=c.get("gender", ""),
                    designation=c.get("designation", ""),
                    dob=c.get("dob") or None,
                    doa=c.get("doa") or None,
                    address=c.get("address", ""),
                    city_id=int(c.get("city_id") or 0),
                    phoneno=c.get("phoneno", ""),
                    extension_no=c.get("extension_no", ""),
                    mobile=c.get("mobile", ""),
                    fax=c.get("fax", ""),
                    email=c.get("email", ""),
                    relation_code=int(c.get("relation_code") or 0),
                    religion_code=int(c.get("religion_code") or 0),
                )

        # 2. Companies
        companies_data = raw_data.get("companies")
        if companies_data is not None:
            TransportCompanyMas.objects.filter(transport_id=transport_id).delete()
            for comp in companies_data:
                c_id = comp.get("company_id") or comp.get("id")
                selected = comp.get("select", True)
                if c_id and selected:
                    TransportCompanyMas.objects.create(
                        transport_id=transport_id,
                        company_id=int(c_id),
                        opening_balance=comp.get("opening_balance") or 0.00
                    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            transport = serializer.save()
            self._sync_child_records(transport.id, request.data)

        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        data = self._attach_child_data(transport.id, data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            transport = serializer.save()
            self._sync_child_records(transport.id, request.data)

        data = dict(serializer.data)
        data = self._attach_child_data(transport.id, data)
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with transaction.atomic():
            ContactDetailsMas.objects.filter(
                mas_from__in=['TRANSPORT', 'TRANSPORTMAS'], mas_code=instance.id
            ).delete()
            TransportCompanyMas.objects.filter(transport_id=instance.id).delete()
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

