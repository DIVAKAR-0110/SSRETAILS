# ssretails/URLS/Master/Location.py
from django.urls import path
from textile import views

urlpatterns = [
    path("locations/", views.LocationViewSet.as_view({"get": "list", "post": "create"}), name="location"),
    path("locations/<int:pk>/", views.LocationViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="location-detail"),
]

