# textile/views/master/item_definition.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from textile.models import (
    ItemCategoryMas1, ItemCategoryMas2, ItemCategoryMas3, ItemCategoryMas4,
    ItemCategoryMas5, ItemCategoryMas6, ItemCategoryMas7, ItemCategoryMas8,
    ItemCategoryMas9, ItemCategoryMas10
)
from textile.serializers import (
    BrandSerializer, TypeSerializer, StyleSerializer, PatternSerializer,
    ColorSerializer, HsnCodeSerializer, FloorsSerializer, SectionSerializer,
    SectionGroupSerializer, SizeOrderSerializer
)


class BrandViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas1.objects.all().order_by('-created_at')
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]


class TypeViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas2.objects.all().order_by('-created_at')
    serializer_class = TypeSerializer
    permission_classes = [AllowAny]


class StyleViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas3.objects.all().order_by('-created_at')
    serializer_class = StyleSerializer
    permission_classes = [AllowAny]


class PatternViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas4.objects.all().order_by('-created_at')
    serializer_class = PatternSerializer
    permission_classes = [AllowAny]


class ColorViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas5.objects.all().order_by('-created_at')
    serializer_class = ColorSerializer
    permission_classes = [AllowAny]


class HsnCodeViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas6.objects.all().order_by('-created_at')
    serializer_class = HsnCodeSerializer
    permission_classes = [AllowAny]


class FloorsViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas7.objects.all().order_by('-created_at')
    serializer_class = FloorsSerializer
    permission_classes = [AllowAny]


class SectionViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas8.objects.all().order_by('-created_at')
    serializer_class = SectionSerializer
    permission_classes = [AllowAny]


class SectionGroupViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas9.objects.all().order_by('-created_at')
    serializer_class = SectionGroupSerializer
    permission_classes = [AllowAny]


class SizeOrderViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas10.objects.all().order_by('-created_at')
    serializer_class = SizeOrderSerializer
    permission_classes = [AllowAny]

