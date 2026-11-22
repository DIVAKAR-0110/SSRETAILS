# ssretails/URLS/Master/PurchaseType.py
from django.urls import path
from textile import views

urlpatterns = [
    path("purchase-types/", views.PurchaseTypeViewSet.as_view({"get": "list", "post": "create"}), name="purchase-types"),
    path("purchase-types/<int:pk>/", views.PurchaseTypeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="purchase-type-detail"),
]
