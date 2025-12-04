from django.urls import path
from django.contrib import admin
from shop.views import *


urlpatterns = [
    path('admin/',admin.site.urls),
    # --- CSRF & Admin Login ---
    path('get_csrf/', get_csrf, name='get_csrf'),
    path('admin_login/', admin_login, name='admin_login'),

    path("country/", country_list_add),
    path("country/<int:code>/", country_detail),
    path("country/report/", country_report),

    path("state/", state_list_add),
    path("state/<int:pk>/", state_update_delete),
    path("state/report/", state_report),

    path('city/', city_list_add, name='city_list_add'),
    path('city/<int:code>/', city_detail, name='city_detail'),
    path('city/report/', city_report, name='city_report'),

    path("title/", title_list),
    path("title/add/", title_add),
    path("title/update/<int:code>/", title_update),
    path("title/delete/<int:code>/", title_delete),
    path("title/report/", title_report),
    path('report/', title_report),
    path('add/', title_insert_update),
    path('update/', title_insert_update),
    path('delete/<int:code>/', title_delete),

    path("grade/add/", grade_add),
    path("grade/delete/<int:code>/", grade_delete),
    path("grade/get/<int:code>/", grade_get),
    path("grade/report/", grade_report),

    path('group/', group_list_add, name='group_list_add'),
    path('group/<int:code>/', group_detail, name='group_detail'),
    path('group/report/', group_report, name='group_report'),

    path('category/', category_list_add, name='category_list_add'),
    path('category/<int:code>/', category_detail, name='category_detail'),
    path('category/report/', category_report, name='category_report'),

    path('relation/', relation_report, name='relation_report'),  # GET all religions
    path('relation/add/', relation_add, name='relation_add'),  # POST add/update religion
    path('relation/delete/<int:code>/', relation_delete, name='relation_delete'),  # DELETE by code
    path('relation/<int:code>/', relation_get, name='relation_get'),

    path('religion/', religion_report, name='religion_report'),  # GET all religions
    path('religion/add/', religion_add, name='religion_add'),  # POST add/update religion
    path('religion/delete/<int:code>/', religion_delete, name='religion_delete'),  # DELETE by code
    path('religion/<int:code>/', religion_get, name='religion_get'),

    path('occupationreport/', occupationreport, name='occupationreport'),
    path('occupation/add/', occupation_add, name='occupation_add'),
    path('occupation/delete/<int:code>/', occupation_delete, name='occupation_delete'),
    path('occupation/<int:code>/', occupation_get, name='occupation_get'),

    path('bank/', bank_report, name='bank_report'),            # GET all
    path('bank/add/', bank_add, name='bank_add'),              # POST add/update
    path('bank/delete/<int:code>/', bank_delete, name='bank_delete'),  # DELETE
    path('bank/<int:code>/', bank_get, name='bank_get'),

    path("employee/", employee_list, name="employee_list"),
    path("employee/<int:code>/", employee_detail, name="employee_detail"),
    path("employee/add/", employee_add, name="employee_add"),
    path("employee/delete/<int:code>/", employee_delete, name="employee_delete"),

    path("taxtype/", tax_type_list),
    path("taxtype/<int:code>/", tax_type_detail),
    path("taxtype/add/", tax_type_add),
    path("taxtype/delete/<int:code>/", tax_type_delete),


    path("system/", system_list),
    path("system/<int:code>/", system_detail),
    path("system/add/", system_add),
    path("system/delete/<int:code>/", system_delete),

    path("counter/", counter_list),
    path("counter/<int:code>/", counter_detail),
    path("counter/add/", counter_add),
    path("counter/delete/<int:code>/", counter_delete),

    path("systemcounter/", system_counter_list),
    path("systemcounter/<int:code>/", system_counter_detail),
    path("systemcounter/add/", system_counter_add),
    path("systemcounter/delete/<int:code>/", system_counter_delete),


    path("countergroup/", counter_group_list),
    path("countergroup/<int:code>/", counter_group_detail),
    path("countergroup/add/", counter_group_add),
    path("countergroup/delete/<int:code>/", counter_group_delete),


    path("giftvoucher/", giftvoucher_list),
    path("giftvoucher/<int:code>/", giftvoucher_detail),
    path("giftvoucher/add/", giftvoucher_add),
    path("giftvoucher/delete/<int:code>/", giftvoucher_delete),

    path("paymentmode/", paymentmode_list),
    path("paymentmode/<int:code>/", paymentmode_detail),
    path("paymentmode/add/", paymentmode_add),
    path("paymentmode/delete/<int:code>/", paymentmode_delete),

    path("discounttype/", discounttype_list),
    path("discounttype/<int:code>/", discounttype_detail),
    path("discounttype/add/", discounttype_add),
    path("discounttype/delete/<int:code>/", discounttype_delete),

    path("incomeexpense/", incomeexpense_list),
    path("incomeexpense/<int:code>/", incomeexpense_detail),
    path("incomeexpense/add/", incomeexpense_add),
    path("incomeexpense/delete/<int:code>/", incomeexpense_delete),

    path("department/", department_list),  # GET only
    path("department/<int:code>/", department_detail),  # GET detail
    path("department/add/", department_add),  # POST add/update
    path("department/delete/<int:code>/", department_delete),  # DELETE


    path("floor/", floor_list, name="floor_list"),
    path("floor/<int:code>/", floor_detail, name="floor_detail"),
    path("floor/add/", floor_add, name="floor_add"),
    path("floor/delete/<int:code>/", floor_delete, name="floor_delete"),

    path("transfermode/", transfermode_list),
    path("transfermode/<int:code>/", transfermode_detail),
    path("transfermode/add/", transfermode_add),
    path("transfermode/delete/<int:code>/", transfermode_delete),

    path("star/", star_list),
    path("star/<int:code>/", star_detail),
    path("star/add/", star_add),
    path("star/delete/<int:code>/", star_delete),

    #suppliers

    path("titles/", title_list),
    path("supplier-groups/", supplier_group_list),
    path("supplier-grades/", supplier_grade_list),
    path("supplier-categories/", supplier_category_list),
    path("locations/", location_lookup_list),
    path("banks/", bank_list),
    path("supplier/", supplier_list),
    path("supplier/<int:code>/", supplier_detail),
    path("supplier/add/", supplier_add),
    path("supplier/delete/<int:code>/", supplier_delete),

    path("cities/", city_list, name="city_list"),
    path("location/", location_list, name="location_list"),
    path("location/<int:code>/", location_detail, name="location_detail"),
    path("location/add/", location_add, name="location_add"),
    path("location/delete/<int:code>/", location_delete, name="location_delete"),
]

