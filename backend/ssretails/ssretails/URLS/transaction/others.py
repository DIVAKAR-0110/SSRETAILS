"""
ssretails/URLS/transaction/others.py
URL routing for Transaction -> Others Suite:
- DayBookViewSet (/api/day-book/)
- CourierInwardViewSet (/api/courier-inward/)
- CashDrawerDenominationViewSet (/api/cash-drawer-denomination/)
- SalesManEditViewSet (/api/salesman-edit/)
- TemplateClearOffViewSet (/api/template-clear-off/)
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from textile.views.transaction.others import (
    DayBookViewSet,
    CourierInwardViewSet,
    CashDrawerDenominationViewSet,
    SalesManEditViewSet,
    TemplateClearOffViewSet,
)

router = DefaultRouter()
router.register(r'day-book', DayBookViewSet, basename='day-book')
router.register(r'courier-inward', CourierInwardViewSet, basename='courier-inward')
router.register(r'cash-drawer-denomination', CashDrawerDenominationViewSet, basename='cash-drawer-denomination')
router.register(r'salesman-edit', SalesManEditViewSet, basename='salesman-edit')
router.register(r'template-clear-off', TemplateClearOffViewSet, basename='template-clear-off')

urlpatterns = [
    path('api/', include(router.urls)),
]
