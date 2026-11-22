# ssretails/URLS/Master/Intractors.py
from django.urls import path
from textile import views

urlpatterns = [
    path("suppliers/", views.SupplierViewSet.as_view({"get": "list", "post": "create"}), name="suppliers-list"),
    path("suppliers/<int:pk>/", views.SupplierViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="suppliers-detail"),

    path("agents/", views.AgentViewSet.as_view({"get": "list", "post": "create"}), name="agents-list"),
    path("agents/<int:pk>/", views.AgentViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="agents-detail"),

    path("manufactures/", views.ManufactureViewSet.as_view({"get": "list", "post": "create"}), name="manufactures-list"),
    path("manufactures/<int:pk>/", views.ManufactureViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="manufactures-detail"),

    path("customers/", views.CustomerViewSet.as_view({"get": "list", "post": "create"}), name="customers-list"),
    path("customers/<int:pk>/", views.CustomerViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="customers-detail"),

    path("couriers/", views.CourierViewSet.as_view({"get": "list", "post": "create"}), name="couriers-list"),
    path("couriers/<int:pk>/", views.CourierViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="couriers-detail"),

    path("transports/", views.TransportViewSet.as_view({"get": "list", "post": "create"}), name="transports-list"),
    path("transports/<int:pk>/", views.TransportViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="transports-detail"),
]
