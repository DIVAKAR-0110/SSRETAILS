# textile/views/master/accounts.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import GroupHead, Naration, TransactionHead, AccountSide
from textile.serializers import (
    AccountsGroupHeadSerializer,
    NarationSerializer,
    TransactionHeadSerializer,
    AccountSideSerializer,
    AgentLookupSerializer,
)
from textile.utils import StoredProcedureMasterViewSetMixin


class AccountsGroupHeadViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "spGroupHead"
    queryset = GroupHead.objects.all().order_by("name")
    serializer_class = AccountsGroupHeadSerializer
    permission_classes = [AllowAny]


class AgentLookupViewSet(viewsets.ReadOnlyModelViewSet):
    from textile.models import AgentMas
    queryset = AgentMas.objects.filter(active=True).order_by("name")
    serializer_class = AgentLookupSerializer
    permission_classes = [AllowAny]


class NarationViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "spNaration"
    queryset = Naration.objects.all().order_by("id")
    serializer_class = NarationSerializer
    permission_classes = [AllowAny]


class TransactionHeadViewSet(StoredProcedureMasterViewSetMixin, viewsets.ModelViewSet):
    stored_proc_name = "SPACCOUNTHEADMAS"
    queryset = TransactionHead.objects.all().order_by("name")
    serializer_class = TransactionHeadSerializer
    permission_classes = [AllowAny]


class AccountSideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AccountSide.objects.all().order_by("id")
    serializer_class = AccountSideSerializer
    permission_classes = [AllowAny]
