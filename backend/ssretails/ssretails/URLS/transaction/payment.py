# ssretails/URLS/transaction/payment.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from textile.views.transaction.payment import PaymentEntryViewSet

router = DefaultRouter()
router.register(r"payment-entry", PaymentEntryViewSet, basename="payment-entry")

urlpatterns = [
    path("", include(router.urls)),
]
