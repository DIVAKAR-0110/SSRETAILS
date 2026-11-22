# textile/views/master/location.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import LocationMas, CourierTypeMas
from textile.serializers import LocationSerializer, CourierTypeSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = LocationMas.objects.all().order_by("name")
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]


class CourierTypeViewSet(viewsets.ModelViewSet):
    queryset = CourierTypeMas.objects.all().order_by("name")
    serializer_class = CourierTypeSerializer
    permission_classes = [AllowAny]
