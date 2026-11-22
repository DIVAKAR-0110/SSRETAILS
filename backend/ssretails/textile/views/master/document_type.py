# textile/views/master/document_type.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import DocumentTypeMas
from textile.serializers import DocumentTypeSerializer


class DocumentTypeViewSet(viewsets.ModelViewSet):
    queryset = DocumentTypeMas.objects.all().order_by("-created_at")
    serializer_class = DocumentTypeSerializer
    permission_classes = [AllowAny]
