# ssretails/URLS/Master/Tally.py
from django.urls import path
from textile import views

urlpatterns = [
    path("group-heads/", views.GroupHeadViewSet.as_view({"get": "list", "post": "create"}), name="group-head"),
    path("group-heads/<int:pk>/", views.GroupHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="group-head-detail"),
    path("group-head/", views.GroupHeadViewSet.as_view({"get": "list", "post": "create"}), name="group-head-alias"),
    path("group-head/<int:pk>/", views.GroupHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="group-head-detail-alias"),

    path("account-heads/", views.AccountHeadViewSet.as_view({"get": "list", "post": "create"}), name="account-head"),
    path("account-heads/<int:pk>/", views.AccountHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="account-head-detail"),
    path("account-head/", views.AccountHeadViewSet.as_view({"get": "list", "post": "create"}), name="account-head-alias"),
    path("account-head/<int:pk>/", views.AccountHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="account-head-detail-alias"),
]
