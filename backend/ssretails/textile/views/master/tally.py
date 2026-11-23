# textile/views/master/tally.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import GroupHeadMas, AccountHeadMas
from textile.serializers import GroupHeadSerializer, AccountHeadSerializer
from textile.utils import StoredProcedureMasterViewSetMixin


class GroupHeadViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "SPGROUPHEADMAS"
    queryset = GroupHeadMas.objects.all().order_by("name")
    serializer_class = GroupHeadSerializer
    permission_classes = [AllowAny]


class AccountHeadViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "SPACCOUNTHEADMAS"
    queryset = AccountHeadMas.objects.all().order_by("name")
    serializer_class = AccountHeadSerializer
    permission_classes = [AllowAny]
