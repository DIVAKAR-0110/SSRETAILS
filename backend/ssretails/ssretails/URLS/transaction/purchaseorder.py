# ssretails/URLS/transaction/purchaseorder.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from textile.views.transaction.purchaseorder import PurchaseOrderViewSet

router = DefaultRouter()
router.register(r"purchase-order", PurchaseOrderViewSet, basename="purchase-order")

urlpatterns = [
    path("", include(router.urls)),
]
