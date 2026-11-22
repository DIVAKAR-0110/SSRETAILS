# ssretails/URLS/Master/DocumentType.py
from django.urls import path
from textile import views

urlpatterns = [
    path("document-types/", views.DocumentTypeViewSet.as_view({"get": "list", "post": "create"}), name="document-types"),
    path("document-types/<int:pk>/", views.DocumentTypeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="document-type-detail"),
]
