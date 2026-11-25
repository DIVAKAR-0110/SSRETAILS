# backend/ssretails/ssretails/URLS/transaction/stock.py
"""
URLs Layer: Stock Suite
Exposes routes for Stock Adjustment Note, Stock Transfer, Manual Stock Transfer,
Stock Export, Stock Inward, and Branch Export.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from textile.views.transaction.stock import (
    StockAdjustmentNoteViewSet,
    StockTransferViewSet,
    ManualStockTransferViewSet,
    StockExportViewSet,
    StockInwardViewSet,
    BranchExportViewSet,
)

router = DefaultRouter()
router.register(r'stock-adjustment', StockAdjustmentNoteViewSet, basename='stock-adjustment')
router.register(r'stock-transfer', StockTransferViewSet, basename='stock-transfer')
router.register(r'manual-stock-transfer', ManualStockTransferViewSet, basename='manual-stock-transfer')
router.register(r'stock-export', StockExportViewSet, basename='stock-export')
router.register(r'stock-inward', StockInwardViewSet, basename='stock-inward')
router.register(r'branch-export', BranchExportViewSet, basename='branch-export')

urlpatterns = [
    path('api/', include(router.urls)),
]
