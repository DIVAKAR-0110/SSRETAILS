"""
ssretails/URLS/transaction/loyalitycard.py
URL routing for Loyalty Card Transaction endpoints:
- LoyaltyCardUpdateViewSet (/api/loyalty-card-update/)
- ManualEntryCancelViewSet (/api/manual-entry-cancel/)
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from textile.views.transaction.loyalitycard import (
    LoyaltyCardUpdateViewSet,
    ManualEntryCancelViewSet,
)

router = DefaultRouter()
router.register(r'loyalty-card-update', LoyaltyCardUpdateViewSet, basename='loyalty-card-update')
router.register(r'manual-entry-cancel', ManualEntryCancelViewSet, basename='manual-entry-cancel')

urlpatterns = [
    path('api/', include(router.urls)),
]
