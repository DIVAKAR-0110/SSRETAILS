"""
ssretails/urls.py
Root URL configuration for SSRetails ERP.
Modularized by Domain & Menu Category (Master, Transaction, Reports, MIS, Setup, Tools).
"""
from django.contrib import admin
from django.urls import path, include
from textile import views

urlpatterns = [
    # 1. Admin & Authentication
    path('admin/', admin.site.urls),
    path("admin_login/", views.admin_login, name="admin_login"),
    path("admin_register/", views.admin_register, name="admin_register"),
    path("errorpage/", views.errorpage, name="errorpage"),

    # 2. Master Module Endpoints
    path("", include("ssretails.URLS.Master.General")),
    path("", include("ssretails.URLS.Master.ItemDefinition")),
    path("", include("ssretails.URLS.Master.Location")),
    path("", include("ssretails.URLS.Master.PurchaseType")),
    path("", include("ssretails.URLS.Master.DocumentType")),
    path("", include("ssretails.URLS.Master.Company")),
    path("", include("ssretails.URLS.Master.JobWork")),
    path("", include("ssretails.URLS.Master.Tally")),
    path("", include("ssretails.URLS.Master.Intractors")),
    path("", include("ssretails.URLS.Master.CourierType")),
    path("", include("ssretails.URLS.Master.Accounts")),

    # 3. Transaction Module Endpoints
    path("", include("ssretails.URLS.transaction.LR")),
    path("", include("ssretails.URLS.transaction.purchaseorder")),
    path("", include("ssretails.URLS.transaction.payment")),
    path("", include("ssretails.URLS.transaction.loyalitycard")),
    path("", include("ssretails.URLS.transaction.giftvoucher")),
    path("", include("ssretails.URLS.transaction.settlement")),
    path("", include("ssretails.URLS.transaction.others")),
    path("", include("ssretails.URLS.transaction.stock")),
]
