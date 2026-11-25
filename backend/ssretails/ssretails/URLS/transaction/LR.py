# ssretails/URLS/transaction/LR.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from textile.views.transaction.LR import (
    LREntryViewSet, LREntryTypeViewSet, LRChargeModeViewSet,
    LRIssueViewSet, LRReceiptViewSet, LRExportViewSet, LRAccountPostViewSet
)

router = DefaultRouter()
router.register(r"lr-entry", LREntryViewSet, basename="lr-entry")
router.register(r"lr-entry-types", LREntryTypeViewSet, basename="lr-entry-types")
router.register(r"lr-charge-modes", LRChargeModeViewSet, basename="lr-charge-modes")
router.register(r"lr-issue", LRIssueViewSet, basename="lr-issue")
router.register(r"lr-receipt", LRReceiptViewSet, basename="lr-receipt")
router.register(r"lr-export", LRExportViewSet, basename="lr-export")
router.register(r"lr-account-post", LRAccountPostViewSet, basename="lr-account-post")

urlpatterns = [
    path("", include(router.urls)),
]
