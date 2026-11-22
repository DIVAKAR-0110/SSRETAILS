# ssretails/URLS/Master/Company.py
from django.urls import path
from textile import views

urlpatterns = [
    path("companies/", views.CompanyViewSet.as_view({"get": "list", "post": "create"}), name="companies"),
    path("companies/<int:pk>/", views.CompanyViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="company-detail"),
]
