"""
URL configuration for ssretails project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from textile import views
from textile.views import *


urlpatterns = [
    path('admin/', admin.site.urls),

    path("admin_login/", views.admin_login, name="admin_login"),
    path("admin_register/", views.admin_register, name="admin_register"),

    path("countries/",CountryViewSet.as_view({"get": "list", "post": "create"}),name="countries"),
    path("countries/<int:pk>/",CountryViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="country-detail"),

    path("states/",StateViewSet.as_view({"get": "list","post": "create"}),name="states"),
    path("states/<int:pk>/",StateViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="state-detail"),

    path("cities/",CityViewSet.as_view({"get": "list", "post": "create"}),name="cities"),
    path("cities/<int:pk>/",CityViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="city-detail"),

    path("titles/", TitleViewSet.as_view({"get": "list", "post": "create"}), name="titles", ),
    path("titles/<int:pk>/", TitleViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="title-detail", ),

    path("grades/", GradeViewSet.as_view({"get": "list", "post": "create"}), name="grades"),
    path("grades/<int:pk>/", GradeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="grade-detail"),

    path("categories/",CategoryViewSet.as_view({"get": "list", "post": "create"}),name="categories",),
    path("categories/<int:pk>/",CategoryViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="category-detail",),

    path("groups/", GroupViewSet.as_view({"get": "list", "post": "create"}), name="groups"),
    path("groups/<int:pk>/", GroupViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="group-detail"),

    path("religions/",ReligionViewSet.as_view({"get": "list", "post": "create"}),name="religions",),
    path("religions/<int:pk>/",ReligionViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="religion-detail",),

    path("relations/",RelationViewSet.as_view({"get": "list", "post": "create"}),name="relations",),
    path("relations/<int:pk>/",RelationViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="relation-detail",),

    path("occupations/",OccupationViewSet.as_view({"get": "list", "post": "create"}),name="occupations",),
    path("occupations/<int:pk>/",OccupationViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="occupation-detail",),

    path("banks/",BankViewSet.as_view({"get": "list", "post": "create"}),name="banks",),
    path("banks/<int:pk>/",BankViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="bank-detail",),

    path("counter-groups/",CounterGroupViewSet.as_view({"get": "list","post": "create"}),name="counter-group"),
    path("counter-groups/<int:pk>/",CounterGroupViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="counter-group-detail"),

    path("tax-types/",TaxTypeViewSet.as_view({"get": "list","post": "create"}),name="tax-type"),
    path("tax-types/<int:pk>/",TaxTypeViewSet.as_view({"get": "retrieve","put": "update","patch": "partial_update","delete": "destroy"}),name="tax-type-detail"),

    path("counters/",CounterViewSet.as_view({"get": "list","post": "create"}),name="counters"),
    path("counters/<int:pk>/",CounterViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="counter-detail"),

    path("floors/",FloorViewSet.as_view({"get": "list","post": "create"}),name="floors"),
    path("floors/<int:pk>/",FloorViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="floor-detail"),

    path("system-mas/",SystemMasViewSet.as_view({"get": "list","post": "create"}),name="system-mas"),
    path("system-mas/<int:pk>/",SystemMasViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="system-mas-detail"),

    path("system-counter-integrations/",SystemCounterIntegrationViewSet.as_view({"get": "list","post": "create"}),name="system-counter-integration"),
    path("system-counter-integrations/<int:pk>/",SystemCounterIntegrationViewSet.as_view({"get": "retrieve","put": "update","patch": "partial_update","delete": "destroy"}),name="system-counter-integration-detail"),

    path("income-expenses/",IncomeAndExpenseViewSet.as_view({"get": "list","post": "create"}),name="income-expense"),
    path("income-expenses/<int:pk>/",IncomeAndExpenseViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="income-expense-detail"),

    path("giftvouchers/",GiftvoucherViewSet.as_view({"get": "list", "post": "create"}),name="giftvouchers",),
    path("giftvouchers/<int:pk>/",GiftvoucherViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy",}),name="giftvoucher-detail",),

    path("payment-modes/",PaymentModeViewSet.as_view({"get": "list", "post": "create"}),name="payment-modes",),
    path("payment-modes/<int:pk>/",PaymentModeViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy",}),name="payment-mode-detail",),

    path("discount-types/",DiscountTypeViewSet.as_view({"get": "list", "post": "create"}),name="discount-types",),
    path("discount-types/<int:pk>/",DiscountTypeViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy",}),name="discount-type-detail",),

    path("departments/",DepartmentViewSet.as_view({"get": "list", "post": "create"}),name="departments",),
    path("departments/<int:pk>/",DepartmentViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="department-detail",),

    path("transfer-modes/",TransferModeViewSet.as_view({"get": "list", "post": "create"}),name="transfer-modes",),
    path("transfer-modes/<int:pk>/",TransferModeViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy",}),name="transfer-mode-detail",),

    path("stars/",StarViewSet.as_view({"get": "list", "post": "create"}),name="stars",),
    path("stars/<int:pk>/",StarViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}),name="star-detail",),

    path("locations/",LocationViewSet.as_view({"get": "list","post": "create"}),name="location"),
    path("locations/<int:pk>/",LocationViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="location-detail"),

    path("group-heads/",GroupHeadViewSet.as_view({"get": "list","post": "create"}),name="group-head"),
    path("group-heads/<int:pk>/",GroupHeadViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="group-head-detail"),

    path("account-heads/",AccountHeadViewSet.as_view({"get": "list","post": "create"}),name="account-head"),
    path("account-heads/<int:pk>/",AccountHeadViewSet.as_view({"get": "retrieve","put": "update","delete": "destroy"}),name="account-head-detail"),

    path("employees/",EmployeeViewSet.as_view({"get": "list","post": "create"}),name="employee"),
    path("employees/<int:pk>/",EmployeeViewSet.as_view({"get": "retrieve","put": "update","patch": "partial_update","delete": "destroy"}),name="employee-detail"),

    path("errorpage/",views.errorpage,name="errorpage"),
]
