# textile/views/master/item_definition.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import transaction

from textile.models import (
    ItemCategoryMas1, ItemCategoryMas2, ItemCategoryMas3, ItemCategoryMas4,
    ItemCategoryMas5, ItemCategoryMas6, ItemCategoryMas7, ItemCategoryMas8,
    ItemCategoryMas9, ItemCategoryMas10, ProductMas, ProductCategoryValuesMas,
    ItemMas, UomMas, ItemTypeMas, CommodityCodeMas, ProductRolMas
)
from textile.serializers import (
    BrandSerializer, TypeSerializer, StyleSerializer, PatternSerializer,
    ColorSerializer, HsnCodeSerializer, FloorsSerializer, SectionSerializer,
    SectionGroupSerializer, SizeOrderSerializer, ProductMiniSerializer,
    ProductCategoryValuesSerializer, ItemSerializer, UomSerializer,
    ItemTypeSerializer, ProductSerializer, CommodityCodeSerializer,
    ProductRolSerializer
)


class BaseCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    category_code = None

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.category_code:
            linked_count = ProductCategoryValuesMas.objects.filter(
                item_category_code=self.category_code,
                item_category_value_code=instance.id
            ).count()
            if linked_count > 0:
                return Response(
                    {"detail": f"Cannot delete '{instance.name}' because it is currently linked to {linked_count} product(s) in ProductCategoryValuesMas."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return super().destroy(request, *args, **kwargs)


class BrandViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas1.objects.all().order_by('name')
    serializer_class = BrandSerializer
    category_code = 1


class TypeViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas2.objects.all().order_by('name')
    serializer_class = TypeSerializer
    category_code = 2


class StyleViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas3.objects.all().order_by('name')
    serializer_class = StyleSerializer
    category_code = 3


class PatternViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas4.objects.all().order_by('name')
    serializer_class = PatternSerializer
    category_code = 4


class ColorViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas5.objects.all().order_by('name')
    serializer_class = ColorSerializer
    category_code = 5


class HsnCodeViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas6.objects.all().order_by('name')
    serializer_class = HsnCodeSerializer
    category_code = 6


class FloorsViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas7.objects.all().order_by('name')
    serializer_class = FloorsSerializer
    category_code = 7


class SectionViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas8.objects.all().order_by('name')
    serializer_class = SectionSerializer
    category_code = 8


class SectionGroupViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas9.objects.all().order_by('name')
    serializer_class = SectionGroupSerializer
    category_code = 9


class SizeOrderViewSet(BaseCategoryViewSet):
    queryset = ItemCategoryMas10.objects.all().order_by('name')
    serializer_class = SizeOrderSerializer
    category_code = 10


# =========================================================================
# Item, UOM, ItemType, Product ViewSets
# =========================================================================

class ItemMasViewSet(viewsets.ModelViewSet):
    queryset = ItemMas.objects.all().order_by('name')
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        linked_products = ProductMas.objects.filter(item_code=instance.id).count()
        if linked_products > 0:
            return Response(
                {"detail": f"Cannot delete '{instance.name}' because it is linked to {linked_products} product(s)."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


class UomMasViewSet(viewsets.ModelViewSet):
    queryset = UomMas.objects.all().order_by('name')
    serializer_class = UomSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        linked_products = ProductMas.objects.filter(
            base_uom_code=instance.id
        ).count() + ProductMas.objects.filter(
            purchase_uom_code=instance.id
        ).count() + ProductMas.objects.filter(
            sales_uom_code=instance.id
        ).count()
        if linked_products > 0:
            return Response(
                {"detail": f"Cannot delete '{instance.name}' because it is used as UOM in {linked_products} product reference(s)."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


class ItemTypeMasViewSet(viewsets.ModelViewSet):
    queryset = ItemTypeMas.objects.all().order_by('name')
    serializer_class = ItemTypeSerializer
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        linked_products = ProductMas.objects.filter(item_type_code=instance.id).count()
        if linked_products > 0:
            return Response(
                {"detail": f"Cannot delete '{instance.name}' because it is linked to {linked_products} product(s)."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


class ProductMasViewSet(viewsets.ModelViewSet):
    queryset = ProductMas.objects.all().order_by('name')
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = dict(serializer.data)
        category_values = list(ProductCategoryValuesMas.objects.filter(
            product_code=instance.id
        ).values("item_category_code", "item_category_value_code", "is_default"))
        data["category_values"] = category_values
        return Response(data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        data["category_values"] = list(ProductCategoryValuesMas.objects.filter(
            product_code=serializer.instance.id
        ).values("item_category_code", "item_category_value_code", "is_default"))
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        data = dict(serializer.data)
        data["category_values"] = list(ProductCategoryValuesMas.objects.filter(
            product_code=instance.id
        ).values("item_category_code", "item_category_value_code", "is_default"))
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with transaction.atomic():
            ProductCategoryValuesMas.objects.filter(product_code=instance.id).delete()
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommodityCodeMasViewSet(viewsets.ModelViewSet):
    queryset = CommodityCodeMas.objects.all().order_by('name')
    serializer_class = CommodityCodeSerializer
    permission_classes = [AllowAny]


class ProductRolMasViewSet(viewsets.ModelViewSet):
    queryset = ProductRolMas.objects.all().order_by('-id')
    serializer_class = ProductRolSerializer
    permission_classes = [AllowAny]



# =========================================================================
# Additional Category / Product helper endpoints
# =========================================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def active_products_list(request):
    products = ProductMas.objects.filter(active=True).order_by("name")
    serializer = ProductMiniSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def category_product_mappings_view(request):
    if request.method == "GET":
        category_id = request.query_params.get("category_id")
        value_id = request.query_params.get("value_id")
        if not category_id or not value_id:
            return Response(
                {"detail": "Both category_id and value_id are required query parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )
        mappings = ProductCategoryValuesMas.objects.filter(
            item_category_code=category_id,
            item_category_value_code=value_id
        ).values("product_code", "is_default")
        mapping_dict = {
            m["product_code"]: {"select": True, "is_default": bool(m["is_default"])}
            for m in mappings
        }
        return Response(mapping_dict)

    elif request.method == "POST":
        data = request.data
        category_id = data.get("category_id")
        value_id = data.get("value_id")
        mappings = data.get("mappings", [])

        if not category_id or not value_id:
            return Response(
                {"detail": "Both category_id and value_id are required in request body."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            for m in mappings:
                p_code = m.get("product_code") or m.get("id")
                selected = m.get("select", False)
                is_default = m.get("is_default", False)
                if not p_code:
                    continue
                if selected:
                    ProductCategoryValuesMas.objects.update_or_create(
                        product_code=p_code,
                        item_category_code=category_id,
                        item_category_value_code=value_id,
                        defaults={"is_default": bool(is_default)}
                    )
                else:
                    ProductCategoryValuesMas.objects.filter(
                        product_code=p_code,
                        item_category_code=category_id,
                        item_category_value_code=value_id
                    ).delete()

        return Response({"status": "success", "message": "Product mappings synchronized successfully."})
