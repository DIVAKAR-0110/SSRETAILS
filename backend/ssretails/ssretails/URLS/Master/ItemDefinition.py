# ssretails/URLS/Master/ItemDefinition.py
from django.urls import path
from textile import views

urlpatterns = [
    # 1. Brand
    path("brand/", views.BrandViewSet.as_view({"get": "list", "post": "create"}), name="brand"),
    path("brand/<int:pk>/", views.BrandViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="brand-detail"),

    # 2. Type
    path("type/", views.TypeViewSet.as_view({"get": "list", "post": "create"}), name="type"),
    path("type/<int:pk>/", views.TypeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="type-detail"),

    # 3. Style
    path("style/", views.StyleViewSet.as_view({"get": "list", "post": "create"}), name="style"),
    path("style/<int:pk>/", views.StyleViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="style-detail"),

    # 4. Pattern
    path("pattern/", views.PatternViewSet.as_view({"get": "list", "post": "create"}), name="pattern"),
    path("pattern/<int:pk>/", views.PatternViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="pattern-detail"),

    # 5. Color
    path("color/", views.ColorViewSet.as_view({"get": "list", "post": "create"}), name="color"),
    path("color/<int:pk>/", views.ColorViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="color-detail"),

    # 6. Floor Category
    path("floor_category/", views.FloorsViewSet.as_view({"get": "list", "post": "create"}), name="floor_category"),
    path("floor_category/<int:pk>/", views.FloorsViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="floor_category-detail"),

    # 7. Hsn Code
    path("hsn_code/", views.HsnCodeViewSet.as_view({"get": "list", "post": "create"}), name="hsn_code"),
    path("hsn_code/<int:pk>/", views.HsnCodeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="hsn_code-detail"),

    # 8. Section
    path("section/", views.SectionViewSet.as_view({"get": "list", "post": "create"}), name="section"),
    path("section/<int:pk>/", views.SectionViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="section-detail"),

    # 9. Section Group
    path("section_group/", views.SectionGroupViewSet.as_view({"get": "list", "post": "create"}), name="section_group"),
    path("section_group/<int:pk>/", views.SectionGroupViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="section_group-detail"),

    # 10. Size Order
    path("sizeorder/", views.SizeOrderViewSet.as_view({"get": "list", "post": "create"}), name="sizeorder"),
    path("sizeorder/<int:pk>/", views.SizeOrderViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="sizeorder-detail"),
]

