# ssretails/URLS/Master/Accounts.py
from django.urls import path
from textile import views

urlpatterns = [
    # Accounts Group Head
    path("accounts/group-heads/", views.AccountsGroupHeadViewSet.as_view({"get": "list", "post": "create"}), name="accounts-group-head"),
    path("accounts/group-heads/<int:pk>/", views.AccountsGroupHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="accounts-group-head-detail"),
    path("accounts/group-head/", views.AccountsGroupHeadViewSet.as_view({"get": "list", "post": "create"}), name="accounts-group-head-alias"),
    path("accounts/group-head/<int:pk>/", views.AccountsGroupHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="accounts-group-head-detail-alias"),

    # Naration
    path("accounts/narations/", views.NarationViewSet.as_view({"get": "list", "post": "create"}), name="naration"),
    path("accounts/narations/<int:pk>/", views.NarationViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="naration-detail"),
    path("accounts/naration/", views.NarationViewSet.as_view({"get": "list", "post": "create"}), name="naration-alias"),
    path("accounts/naration/<int:pk>/", views.NarationViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="naration-detail-alias"),

    # Transaction Head
    path("accounts/transaction-heads/", views.TransactionHeadViewSet.as_view({"get": "list", "post": "create"}), name="transaction-head"),
    path("accounts/transaction-heads/<int:pk>/", views.TransactionHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="transaction-head-detail"),
    path("accounts/transaction-head/", views.TransactionHeadViewSet.as_view({"get": "list", "post": "create"}), name="transaction-head-alias"),
    path("accounts/transaction-head/<int:pk>/", views.TransactionHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="transaction-head-detail-alias"),

    # Account Side Lookup
    path("accounts/sides/", views.AccountSideViewSet.as_view({"get": "list"}), name="account-sides"),

    # Agent Lookup with City
    path("accounts/agents/", views.AgentLookupViewSet.as_view({"get": "list"}), name="accounts-agents"),
]
