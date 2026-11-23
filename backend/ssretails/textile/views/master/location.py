# textile/views/master/location.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import LocationMas, CourierTypeMas
from textile.serializers import LocationSerializer, CourierTypeSerializer
from textile.utils import StoredProcedureMasterViewSetMixin


class LocationViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "SPLOCATIONMAS"
    queryset = LocationMas.objects.all().order_by("name")
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]


class CourierTypeViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "SPCOURIERTYPEMAS"
    queryset = CourierTypeMas.objects.all().order_by("name")
    serializer_class = CourierTypeSerializer
    permission_classes = [AllowAny]
