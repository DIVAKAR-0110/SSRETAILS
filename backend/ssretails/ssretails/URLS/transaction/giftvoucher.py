"""
ssretails/URLS/transaction/giftvoucher.py
URL routing for Gift Voucher Transaction endpoints:
- GiftVoucherIssueViewSet (/api/gift-voucher-issue/)
- GiftVoucherCancelViewSet (/api/gift-voucher-cancel/)
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from textile.views.transaction.giftvoucher import (
    GiftVoucherIssueViewSet,
    GiftVoucherCancelViewSet,
)

router = DefaultRouter()
router.register(r'gift-voucher-issue', GiftVoucherIssueViewSet, basename='gift-voucher-issue')
router.register(r'gift-voucher-cancel', GiftVoucherCancelViewSet, basename='gift-voucher-cancel')

urlpatterns = [
    path('api/', include(router.urls)),
]
