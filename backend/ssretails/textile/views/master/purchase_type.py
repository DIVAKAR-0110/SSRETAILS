# textile/views/master/purchase_type.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import PurchaseTypeMas
from textile.serializers import PurchaseTypeSerializer
from textile.utils import StoredProcedureMasterViewSetMixin


class PurchaseTypeViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "SPPURCHASETYPEMAS"
    queryset = PurchaseTypeMas.objects.all().order_by("-created_at")
    serializer_class = PurchaseTypeSerializer
    permission_classes = [AllowAny]
