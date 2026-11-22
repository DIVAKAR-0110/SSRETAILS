# textile/views/master/purchase_type.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import PurchaseTypeMas
from textile.serializers import PurchaseTypeSerializer


class PurchaseTypeViewSet(viewsets.ModelViewSet):
    queryset = PurchaseTypeMas.objects.all().order_by("-created_at")
    serializer_class = PurchaseTypeSerializer
    permission_classes = [AllowAny]
