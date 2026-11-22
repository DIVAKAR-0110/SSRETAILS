# ssretails/URLS/Master/CourierType.py
from django.urls import path
from textile import views

urlpatterns = [
    path("courier-types/", views.CourierTypeViewSet.as_view({"get": "list", "post": "create"}), name="courier-type"),
    path("courier-types/<int:pk>/", views.CourierTypeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="courier-type-detail"),
    path("courier-type/", views.CourierTypeViewSet.as_view({"get": "list", "post": "create"}), name="courier-type-alias"),
    path("courier-type/<int:pk>/", views.CourierTypeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="courier-type-detail-alias"),
]
