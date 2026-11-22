# ssretails/URLS/Master/General.py
from django.urls import path
from textile import views

urlpatterns = [
    # 1. Country
    path("countries/", views.CountryViewSet.as_view({"get": "list", "post": "create"}), name="countries"),
    path("countries/<int:pk>/", views.CountryViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="country-detail"),

    # 2. State
    path("states/", views.StateViewSet.as_view({"get": "list", "post": "create"}), name="states"),
    path("states/<int:pk>/", views.StateViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="state-detail"),

    # 3. City
    path("cities/", views.CityViewSet.as_view({"get": "list", "post": "create"}), name="cities"),
    path("cities/<int:pk>/", views.CityViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="city-detail"),

    # 4. Title
    path("titles/", views.TitleViewSet.as_view({"get": "list", "post": "create"}), name="titles"),
    path("titles/<int:pk>/", views.TitleViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="title-detail"),

    # 5. Grade
    path("grades/", views.GradeViewSet.as_view({"get": "list", "post": "create"}), name="grades"),
    path("grades/<int:pk>/", views.GradeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="grade-detail"),

    # 6. Group
    path("groups/", views.GroupViewSet.as_view({"get": "list", "post": "create"}), name="groups"),
    path("groups/<int:pk>/", views.GroupViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="group-detail"),

    # 7. Category
    path("categories/", views.CategoryViewSet.as_view({"get": "list", "post": "create"}), name="categories"),
    path("categories/<int:pk>/", views.CategoryViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="category-detail"),

    # 8. Relation
    path("relations/", views.RelationViewSet.as_view({"get": "list", "post": "create"}), name="relations"),
    path("relations/<int:pk>/", views.RelationViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="relation-detail"),

    # 9. Religion
    path("religions/", views.ReligionViewSet.as_view({"get": "list", "post": "create"}), name="religions"),
    path("religions/<int:pk>/", views.ReligionViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="religion-detail"),

    # 10. Occupation
    path("occupations/", views.OccupationViewSet.as_view({"get": "list", "post": "create"}), name="occupations"),
    path("occupations/<int:pk>/", views.OccupationViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="occupation-detail"),

    # 11. Bank
    path("banks/", views.BankViewSet.as_view({"get": "list", "post": "create"}), name="banks"),
    path("banks/<int:pk>/", views.BankViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="bank-detail"),

    # 12. Employee & User Groups
    path("employees/", views.EmployeeViewSet.as_view({"get": "list", "post": "create"}), name="employee"),
    path("employees/<int:pk>/", views.EmployeeViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}), name="employee-detail"),
    path("employees/<int:pk>/incentives/", views.EmployeeViewSet.as_view({"get": "incentives"}), name="employee-incentives"),
    path("employee/", views.EmployeeViewSet.as_view({"get": "list", "post": "create"}), name="employee-alias"),
    path("employee/<int:pk>/", views.EmployeeViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}), name="employee-alias-detail"),
    path("user-groups/", views.UserGroupViewSet.as_view({"get": "list"}), name="user-groups"),

    # 13. Tax Type
    path("tax-types/", views.TaxTypeViewSet.as_view({"get": "list", "post": "create"}), name="tax-type"),
    path("tax-types/<int:pk>/", views.TaxTypeViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}), name="tax-type-detail"),

    # 14. System
    path("system-mas/", views.SystemMasViewSet.as_view({"get": "list", "post": "create"}), name="system-mas"),
    path("system-mas/<int:pk>/", views.SystemMasViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="system-mas-detail"),

    # 15. Counter
    path("counters/", views.CounterViewSet.as_view({"get": "list", "post": "create"}), name="counters"),
    path("counters/<int:pk>/", views.CounterViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="counter-detail"),

    # 16. System Counter Integration 2
    path("system-counter-integrations/", views.SystemCounterIntegrationViewSet.as_view({"get": "list", "post": "create"}), name="system-counter-integration"),
    path("system-counter-integrations/<int:pk>/", views.SystemCounterIntegrationViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}), name="system-counter-integration-detail"),

    # 17. Counter Group 1
    path("counter-groups/", views.CounterGroupViewSet.as_view({"get": "list", "post": "create"}), name="counter-group"),
    path("counter-groups/<int:pk>/", views.CounterGroupViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="counter-group-detail"),

    # 18. Gift Voucher
    path("giftvouchers/", views.GiftvoucherViewSet.as_view({"get": "list", "post": "create"}), name="giftvouchers"),
    path("giftvouchers/<int:pk>/", views.GiftvoucherViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="giftvoucher-detail"),

    # 19. Payment Mode
    path("payment-modes/", views.PaymentModeViewSet.as_view({"get": "list", "post": "create"}), name="payment-modes"),
    path("payment-modes/<int:pk>/", views.PaymentModeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="payment-mode-detail"),

    # 20. Discount Type
    path("discount-types/", views.DiscountTypeViewSet.as_view({"get": "list", "post": "create"}), name="discount-types"),
    path("discount-types/<int:pk>/", views.DiscountTypeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="discount-type-detail"),

    # 21. Income and Expenses 3
    path("income-expenses/", views.IncomeAndExpenseViewSet.as_view({"get": "list", "post": "create"}), name="income-expense"),
    path("income-expenses/<int:pk>/", views.IncomeAndExpenseViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="income-expense-detail"),
    path("income-and-expense/", views.IncomeAndExpenseViewSet.as_view({"get": "list", "post": "create"}), name="income-and-expense-alias"),
    path("income-and-expense/<int:pk>/", views.IncomeAndExpenseViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="income-and-expense-alias-detail"),
    path("income-and-expenses/", views.IncomeAndExpenseViewSet.as_view({"get": "list", "post": "create"}), name="income-and-expenses-alias"),
    path("income-and-expenses/<int:pk>/", views.IncomeAndExpenseViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="income-and-expenses-alias-detail"),

    # 22. Department
    path("departments/", views.DepartmentViewSet.as_view({"get": "list", "post": "create"}), name="departments"),
    path("departments/<int:pk>/", views.DepartmentViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="department-detail"),

    # 23. Floor
    path("floors/", views.FloorViewSet.as_view({"get": "list", "post": "create"}), name="floors"),
    path("floors/<int:pk>/", views.FloorViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="floor-detail"),

    # 24. Transfer Mode
    path("transfer-modes/", views.TransferModeViewSet.as_view({"get": "list", "post": "create"}), name="transfer-modes"),
    path("transfer-modes/<int:pk>/", views.TransferModeViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="transfer-mode-detail"),

    # 25. Star
    path("stars/", views.StarViewSet.as_view({"get": "list", "post": "create"}), name="stars"),
    path("stars/<int:pk>/", views.StarViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="star-detail"),

    # 26. Print Functions (Lookup for System Master)
    path("print-functions/", views.PrintFunctionViewSet.as_view({"get": "list"}), name="print-functions"),
    path("print-functions/<int:pk>/", views.PrintFunctionViewSet.as_view({"get": "retrieve"}), name="print-function-detail"),
]

