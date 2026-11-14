# textile/views/master/location.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import LocationMas
from textile.serializers import LocationSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = LocationMas.objects.all().order_by("-created_at")
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]

