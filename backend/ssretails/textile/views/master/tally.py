# textile/views/master/tally.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import GroupHeadMas, AccountHeadMas
from textile.serializers import GroupHeadSerializer, AccountHeadSerializer


class GroupHeadViewSet(viewsets.ModelViewSet):
    queryset = GroupHeadMas.objects.all().order_by("-created_at")
    serializer_class = GroupHeadSerializer
    permission_classes = [AllowAny]


class AccountHeadViewSet(viewsets.ModelViewSet):
    queryset = AccountHeadMas.objects.all().order_by("-created_at")
    serializer_class = AccountHeadSerializer
    permission_classes = [AllowAny]

