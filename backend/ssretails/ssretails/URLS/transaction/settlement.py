"""
ssretails/URLS/transaction/settlement.py
URL routing for Settlement Transaction endpoints:
- SettlementCancelViewSet (/api/settlement-cancel/)
- ManualVoucherCancelViewSet (/api/manual-voucher-cancel/)
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from textile.views.transaction.settlement import (
    SettlementCancelViewSet,
    ManualVoucherCancelViewSet,
)

router = DefaultRouter()
router.register(r'settlement-cancel', SettlementCancelViewSet, basename='settlement-cancel')
router.register(r'manual-voucher-cancel', ManualVoucherCancelViewSet, basename='manual-voucher-cancel')

urlpatterns = [
    path('api/', include(router.urls)),
]
