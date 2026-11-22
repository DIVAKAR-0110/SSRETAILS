# ssretails/URLS/Master/JobWork.py
from django.urls import path
from textile import views

urlpatterns = [
    # Job Work Charge Heads
    path("job-work/charge-heads/", views.JobWorkChargeHeadViewSet.as_view({"get": "list", "post": "create"}), name="job-work-charge-heads"),
    path("job-work/charge-heads/<int:pk>/", views.JobWorkChargeHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="job-work-charge-head-detail"),

    # Also keep legacy endpoint for backward compatibility
    path("job-work-charge-heads/", views.JobWorkChargeHeadViewSet.as_view({"get": "list", "post": "create"}), name="legacy-job-work-charge-heads"),
    path("job-work-charge-heads/<int:pk>/", views.JobWorkChargeHeadViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="legacy-job-work-charge-head-detail"),

    # Tailor Mas
    path("job-work/tailors/", views.TailorMasViewSet.as_view({"get": "list", "post": "create"}), name="job-work-tailors"),
    path("job-work/tailors/<int:pk>/", views.TailorMasViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"}), name="job-work-tailor-detail"),

    # Consumption Master (Supplier Job Work)
    path("job-work/consumptions/", views.ConsumptionMasterViewSet.as_view({"get": "list", "post": "create"}), name="job-work-consumptions"),
    path("job-work/consumptions/<int:pk>/", views.ConsumptionMasterViewSet.as_view({"get": "retrieve", "put": "update"}), name="job-work-consumption-detail"),

    # Lookups for Consumption Details Grid
    path("job-work/lookups/products/", views.jobwork_products_lookup, name="jobwork-products-lookup"),
    path("job-work/lookups/items/", views.jobwork_items_lookup, name="jobwork-items-lookup"),
]
