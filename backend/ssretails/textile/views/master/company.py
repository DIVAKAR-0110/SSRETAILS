# textile/views/master/company.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import CompanyMas
from textile.serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = CompanyMas.objects.all().order_by("-created_at")
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]
