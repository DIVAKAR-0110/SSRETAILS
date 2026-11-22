# ssretails/URLS/Master/ItemDefinition.py
from django.urls import path
from textile import views

urlpatterns = [
    # Item Definition Core Endpoints
    path("items/", views.ItemMasViewSet.as_view({"get": "list", "post": "create"}), name="items-list"),
    path("items/<int:pk>/", views.ItemMasViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="items-detail"),

    path("uoms/", views.UomMasViewSet.as_view({"get": "list", "post": "create"}), name="uoms-list"),
    path("uoms/<int:pk>/", views.UomMasViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="uoms-detail"),

    path("item-types/", views.ItemTypeMasViewSet.as_view({"get": "list", "post": "create"}), name="item-types-list"),
    path("item-types/<int:pk>/", views.ItemTypeMasViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="item-types-detail"),

    path("products/", views.ProductMasViewSet.as_view({"get": "list", "post": "create"}), name="products-list"),
    path("products/<int:pk>/", views.ProductMasViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="products-detail"),

    path("commodity-codes/", views.CommodityCodeMasViewSet.as_view({"get": "list", "post": "create"}), name="commodity-codes-list"),
    path("commodity-codes/<int:pk>/", views.CommodityCodeMasViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="commodity-codes-detail"),

    path("rols/", views.ProductRolMasViewSet.as_view({"get": "list", "post": "create"}), name="rols-list"),
    path("rols/<int:pk>/", views.ProductRolMasViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="rols-detail"),

    # Product Grid Helper Endpoints
    path("products/active/", views.active_products_list, name="active-products"),
    path("category-product-mappings/", views.category_product_mappings_view, name="category-product-mappings"),

    # 1. Brand (ItemCategoryMas1)
    path("brand/", views.BrandViewSet.as_view({"get": "list", "post": "create"}), name="brand"),
    path("brand/<int:pk>/", views.BrandViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="brand-detail"),

    # 2. Type (ItemCategoryMas2)
    path("type/", views.TypeViewSet.as_view({"get": "list", "post": "create"}), name="type"),
    path("type/<int:pk>/", views.TypeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="type-detail"),

    # 3. Style (ItemCategoryMas3)
    path("style/", views.StyleViewSet.as_view({"get": "list", "post": "create"}), name="style"),
    path("style/<int:pk>/", views.StyleViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="style-detail"),

    # 4. Pattern (ItemCategoryMas4)
    path("pattern/", views.PatternViewSet.as_view({"get": "list", "post": "create"}), name="pattern"),
    path("pattern/<int:pk>/", views.PatternViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="pattern-detail"),

    # 5. Color (ItemCategoryMas5)
    path("color/", views.ColorViewSet.as_view({"get": "list", "post": "create"}), name="color"),
    path("color/<int:pk>/", views.ColorViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="color-detail"),

    # 6. Hsn Code (ItemCategoryMas6)
    path("hsn_code/", views.HsnCodeViewSet.as_view({"get": "list", "post": "create"}), name="hsn_code"),
    path("hsn_code/<int:pk>/", views.HsnCodeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="hsn_code-detail"),
    path("hsn-code/", views.HsnCodeViewSet.as_view({"get": "list", "post": "create"}), name="hsn-code-alias"),
    path("hsn-code/<int:pk>/", views.HsnCodeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="hsn-code-alias-detail"),

    # 7. Floor / Floor Category (ItemCategoryMas7)
    path("floor_category/", views.FloorsViewSet.as_view({"get": "list", "post": "create"}), name="floor_category"),
    path("floor_category/<int:pk>/", views.FloorsViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="floor_category-detail"),
    path("floor-category/", views.FloorsViewSet.as_view({"get": "list", "post": "create"}), name="floor-category-alias"),
    path("floor-category/<int:pk>/", views.FloorsViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="floor-category-alias-detail"),

    # 8. Section (ItemCategoryMas8)
    path("section/", views.SectionViewSet.as_view({"get": "list", "post": "create"}), name="section"),
    path("section/<int:pk>/", views.SectionViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="section-detail"),

    # 9. Section Group (ItemCategoryMas9)
    path("section_group/", views.SectionGroupViewSet.as_view({"get": "list", "post": "create"}), name="section_group"),
    path("section_group/<int:pk>/", views.SectionGroupViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="section_group-detail"),
    path("section-group/", views.SectionGroupViewSet.as_view({"get": "list", "post": "create"}), name="section-group-alias"),
    path("section-group/<int:pk>/", views.SectionGroupViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="section-group-alias-detail"),

    # 10. Size Order (ItemCategoryMas10)
    path("sizeorder/", views.SizeOrderViewSet.as_view({"get": "list", "post": "create"}), name="sizeorder"),
    path("sizeorder/<int:pk>/", views.SizeOrderViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="sizeorder-detail"),
    path("size-order/", views.SizeOrderViewSet.as_view({"get": "list", "post": "create"}), name="size-order-alias"),
    path("size-order/<int:pk>/", views.SizeOrderViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="size-order-alias-detail"),
]
