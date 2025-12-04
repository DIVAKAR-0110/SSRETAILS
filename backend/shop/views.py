from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from .models import *
from django.contrib.auth.hashers import check_password
import json
from django.shortcuts import get_object_or_404
import datetime
from django.db.models import Q
from django.utils import timezone
from .serializers import *
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


# ------------------ CSRF ------------------
@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"csrf": "ok"})

# ------------------ Admin Login ------------------
@csrf_exempt
def admin_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        try:
            admin = AdminLogin.objects.get(email=email)
            if check_password(password, admin.password):
                return JsonResponse({"status": "success", "admin_id": admin.id, "email": admin.email})
            else:
                return JsonResponse({"status": "error", "message": "Invalid password"})
        except AdminLogin.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Admin not found"})
    return JsonResponse({"status": "error", "message": "Invalid request"})


from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import CountryMas
from .serializers import CountrySerializer

# Allowed ordering columns
ALLOWED_ORDER_FIELDS = {
    "Code": "Code",
    "Name": "Name",
    "ShortName": "ShortName",
    "Active": "Active",
    "CreatedDateTime": "CreatedDateTime"
}


@api_view(['GET', 'POST'])
def country_list_add(request):
    """
    GET = List with:
    - search
    - sorting
    - pagination
    - column filtering
    POST = Add new country
    """

    # ---------------------------
    # 🟦 POST → Add new record
    # ---------------------------
    if request.method == 'POST':
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Created", "data": serializer.data})
        return Response(serializer.errors, status=400)

    # ---------------------------
    # 🟦 GET → List
    # ---------------------------

    queryset = CountryMas.objects.all()

    # 🔍 Search
    search = request.GET.get("search", "")
    if search:
        queryset = queryset.filter(Name__icontains=search)

    # 🎯 Column Filtering
    # /country/?Active=true&Name=India
    for field in ["Code", "Name", "ShortName", "Active"]:
        value = request.GET.get(field)
        if value:
            queryset = queryset.filter(**{f"{field}__icontains": value})

    # 🔽 Sorting
    ordering = request.GET.get("ordering", "Name")
    ordering = ordering.strip()

    if ordering.replace("-", "") in ALLOWED_ORDER_FIELDS:
        queryset = queryset.order_by(ordering)
    else:
        queryset = queryset.order_by("Name")

    # 📄 Pagination
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))
    start = (page - 1) * page_size
    end = start + page_size

    total_records = queryset.count()
    serializer = CountrySerializer(queryset[start:end], many=True)

    return Response({
        "results": serializer.data,
        "total": total_records,
        "page": page,
        "page_size": page_size
    })


@api_view(['GET', 'PUT', 'DELETE'])
def country_detail(request, code):
    """
    GET = View single
    PUT = Edit
    DELETE = Delete
    """

    try:
        country = CountryMas.objects.get(Code=code)
    except CountryMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    # 🟦 GET View single
    if request.method == 'GET':
        return Response(CountrySerializer(country).data)

    # 🟦 UPDATE
    if request.method == 'PUT':
        serializer = CountrySerializer(country, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated", "data": serializer.data})
        return Response(serializer.errors, status=400)

    # 🟦 DELETE
    if request.method == 'DELETE':
        country.delete()
        return Response({"message": "Deleted"}, status=204)



@api_view(['GET'])
def country_report(request):
    """
    Returns full table for HTML/GRID ReportView.jsx
    """

    queryset = CountryMas.objects.all().order_by("Name")
    serializer = CountrySerializer(queryset, many=True)

    return Response({
        "columns": ["Code", "Name", "ShortName", "Active", "UserID", "CreatedDateTime"],
        "data": serializer.data
    })


VALID_ORDER_FIELDS = ['Code', 'Name', 'ShortName', 'CountryCode__Name', 'Active']

@api_view(['GET', 'POST'])
def state_list_add(request):
    # -----------------------
    # ADD STATE (POST)
    # -----------------------
    if request.method == "POST":
        serializer = StateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        return Response({"success": False, "errors": serializer.errors}, status=400)

    # -----------------------
    # LIST STATE (GET)
    # -----------------------
    search = request.GET.get("search", "")
    ordering = request.GET.get("ordering", "Name")
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 10))

    if ordering not in VALID_ORDER_FIELDS:
        ordering = "Name"

    queryset = StateMas.objects.filter(
        Q(Name__icontains=search) |
        Q(ShortName__icontains=search) |
        Q(CountryCode__Name__icontains=search)
    ).order_by(ordering)

    paginator = Paginator(queryset, page_size)
    page_obj = paginator.get_page(page)

    serializer = StateSerializer(page_obj, many=True)

    return Response({
        "success": True,
        "results": serializer.data,
        "total": paginator.count,
        "page": page,
        "page_size": page_size,
        "total_pages": paginator.num_pages,
    })


# -----------------------
# EDIT OR DELETE STATE
# -----------------------
@api_view(['PUT', 'DELETE'])
def state_update_delete(request, pk):
    try:
        state = StateMas.objects.get(pk=pk)
    except StateMas.DoesNotExist:
        return Response({"success": False, "error": "State not found"}, status=404)

    if request.method == "PUT":
        serializer = StateSerializer(state, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        return Response({"success": False, "errors": serializer.errors}, status=400)

    if request.method == "DELETE":
        state.delete()
        return Response({"success": True, "message": "State deleted"})


# -----------------------
# FULL REPORT
# -----------------------
@api_view(['GET'])
def state_report(request):
    queryset = StateMas.objects.all().order_by("Name")
    serializer = StateSerializer(queryset, many=True)
    return Response({"success": True, "results": serializer.data})


# Allowed ordering keys (frontend may send these)
ALLOWED_ORDER_FIELDS = {
    'Code': 'Code',
    'Name': 'Name',
    'ShortName': 'ShortName',
    'State': 'StateCode__Name',    # frontend may request State sorting
    'StateCode__Name': 'StateCode__Name',
    'Active': 'Active',
    'CreatedDateTime': 'CreatedDateTime'
}


@api_view(['GET', 'POST'])
def city_list_add(request):
    """
    GET: list with search, column filters, ordering, pagination
    POST: create new city
    """
    # ---------------- POST -> create ----------------
    if request.method == 'POST':
        serializer = CitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # ---------------- GET -> list ----------------
    qs = CityMas.objects.select_related('StateCode', 'StateCode__CountryCode').all()

    # search (global - matches Name, ShortName, State name, Country name)
    search = request.GET.get('search', '').strip()
    if search:
        qs = qs.filter(
            Q(Name__icontains=search) |
            Q(ShortName__icontains=search) |
            Q(StateCode__Name__icontains=search) |
            Q(StateCode__CountryCode__Name__icontains=search)
        )

    # column filters: allow direct filters by Code, Name, ShortName, StateCode, Active
    code_filter = request.GET.get('Code')
    if code_filter:
        qs = qs.filter(Code=code_filter)

    name_filter = request.GET.get('Name')
    if name_filter:
        qs = qs.filter(Name__icontains=name_filter)

    short_filter = request.GET.get('ShortName')
    if short_filter:
        qs = qs.filter(ShortName__icontains=short_filter)

    state_filter = request.GET.get('StateCode') or request.GET.get('State')
    if state_filter:
        # allow either exact state code or name partial match
        if state_filter.isdigit():
            qs = qs.filter(StateCode__Code=int(state_filter))
        else:
            qs = qs.filter(StateCode__Name__icontains=state_filter)

    active_filter = request.GET.get('Active')
    if active_filter:
        if active_filter.lower() in ['true', '1', 'yes']:
            qs = qs.filter(Active=True)
        elif active_filter.lower() in ['false', '0', 'no']:
            qs = qs.filter(Active=False)

    # ordering (map incoming to allowed fields)
    ordering = request.GET.get('ordering', 'Name').strip()
    desc = False
    if ordering.startswith('-'):
        desc = True
        ordering_key = ordering[1:]
    else:
        ordering_key = ordering

    mapped = ALLOWED_ORDER_FIELDS.get(ordering_key) or ALLOWED_ORDER_FIELDS.get(ordering_key.capitalize())
    if not mapped:
        # default
        mapped = 'Name'

    order_by = f"-{mapped}" if desc else mapped
    qs = qs.order_by(order_by)

    # pagination
    try:
        page = int(request.GET.get('page', 1))
    except ValueError:
        page = 1
    try:
        page_size = int(request.GET.get('page_size', 10))
    except ValueError:
        page_size = 10

    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page)
    serializer = CitySerializer(page_obj, many=True)

    return Response({
        "success": True,
        "results": serializer.data,
        "total": paginator.count,
        "page": page_obj.number,
        "page_size": page_size,
        "total_pages": paginator.num_pages
    })


@api_view(['GET', 'PUT', 'DELETE'])
def city_detail(request, code):
    """
    GET: single city
    PUT: update
    DELETE: remove
    """
    try:
        city = CityMas.objects.get(Code=code)
    except CityMas.DoesNotExist:
        return Response({"success": False, "error": "City not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CitySerializer(city)
        return Response({"success": True, "data": serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = CitySerializer(city, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        city.delete()
        return Response({"success": True, "message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def city_report(request):
    """
    Return full list for reports (no pagination) — used by frontend report view & dropdown preload (if required)
    """
    qs = CityMas.objects.select_related('StateCode', 'StateCode__CountryCode').all().order_by('Name')
    serializer = CitySerializer(qs, many=True)
    return Response({
        "success": True,
        "results": serializer.data
    })


@api_view(['GET'])
def title_list(request):
    search = request.GET.get("search", "")
    ordering = request.GET.get("ordering", "Code")
    active = request.GET.get("active", "")

    valid_fields = ["Code", "Name", "ShortName", "Active", "CreatedDateTime"]

    if ordering.replace("-", "") not in valid_fields:
        ordering = "Code"

    qs = TitleMas.objects.filter(
        Q(Name__icontains=search) |
        Q(ShortName__icontains=search)
    )

    if active != "":
        qs = qs.filter(Active=active)

    qs = qs.order_by(ordering)
    serializer = TitleSerializer(qs, many=True)
    return Response({"status": 200, "data": serializer.data})


# -----------------------------------
# ADD
# -----------------------------------
@api_view(['POST'])
def title_add(request):
    serializer = TitleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": 200, "message": "Title added"})
    return Response(serializer.errors, status=400)


# -----------------------------------
# UPDATE
# -----------------------------------
@api_view(['PUT'])
def title_update(request, code):
    try:
        title = TitleMas.objects.get(Code=code)
    except TitleMas.DoesNotExist:
        return Response({"status": 404, "message": "Title not found"})

    serializer = TitleSerializer(title, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": 200, "message": "Updated"})
    return Response(serializer.errors, status=400)


# -----------------------------------
# DELETE
# -----------------------------------
@api_view(['DELETE'])
def title_delete(request, code):
    try:
        TitleMas.objects.get(Code=code).delete()
        return Response({"status": 200, "message": "Deleted"})
    except:
        return Response({"status": 404, "message": "Not found"})


# -----------------------------------
# REPORT (all titles)
# -----------------------------------
@api_view(['GET'])
def title_report(request):
    serializer = TitleSerializer(TitleMas.objects.all(), many=True)
    return Response({"status": 200, "data": serializer.data})



# ------------------------
# FULL REPORT (GET ALL)
# ------------------------
@api_view(['GET'])
def title_report(request):
    data = TitleMas.objects.all().order_by('Name')
    serializer = TitleSerializer(data, many=True)
    return Response(serializer.data)


# ------------------------
# CREATE & UPDATE
# ------------------------
@api_view(['POST'])
def title_insert_update(request):
    code = request.data.get("Code", None)

    # UPDATE
    if code:
        try:
            instance = TitleMas.objects.get(Code=code)
        except TitleMas.DoesNotExist:
            return Response({"error": "Title not found"}, status=404)

        instance.Name = request.data.get("Name")
        instance.ShortName = request.data.get("ShortName")
        instance.Active = request.data.get("Active", True)
        instance.UserID = 1  # default
        instance.save()

        return Response({"success": "Title updated successfully"})

    # INSERT
    TitleMas.objects.create(
        Name=request.data.get("Name"),
        ShortName=request.data.get("ShortName"),
        Active=request.data.get("Active", True),
        UserID=1,
    )

    return Response({"success": "Title added successfully"}, status=201)


# ------------------------
# DELETE
# ------------------------
@api_view(['DELETE'])
def title_delete(request, code):
    try:
        instance = TitleMas.objects.get(Code=code)
    except TitleMas.DoesNotExist:
        return Response({"error": "Title not found"}, status=404)

    instance.delete()
    return Response({"success": "Title Deleted Successfully"})



# ➤ Add or Update
@api_view(["POST"])
def grade_add(request):
    data = request.data
    code = data.get("Code", None)

    if code:
        try:
            grade = GradeMas.objects.get(Code=code)
            serializer = GradeSerializer(grade, data=data)
        except GradeMas.DoesNotExist:
            return Response({"error": "Grade not found"}, status=404)
    else:
        serializer = GradeSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response({"success": "Saved successfully!"})

    return Response(serializer.errors, status=400)


# ➤ Delete
@api_view(["DELETE"])
def grade_delete(request, code):
    try:
        grade = GradeMas.objects.get(Code=code)
        grade.delete()
        return Response({"success": "Deleted successfully!"})
    except GradeMas.DoesNotExist:
        return Response({"error": "Grade not found"}, status=404)


# ➤ Single Fetch
@api_view(["GET"])
def grade_get(request, code):
    try:
        grade = GradeMas.objects.get(Code=code)
        serializer = GradeSerializer(grade)
        return Response(serializer.data)
    except GradeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


# ➤ Full Report (used by React table)
@api_view(["GET"])
def grade_report(request):
    grades = GradeMas.objects.all().order_by("Name")
    serializer = GradeSerializer(grades, many=True)
    return Response(serializer.data)



ALLOWED_ORDER_FIELDS = ['Code','Name','ShortName','Active','CreatedDateTime']

@api_view(['GET','POST'])
def group_list_add(request):
    # POST -> create or update (if Code provided)
    if request.method == 'POST':
        code = request.data.get('Code', None)
        if code:
            try:
                inst = GroupMas.objects.get(Code=code)
            except GroupMas.DoesNotExist:
                return Response({"success": False, "error": "Group not found"}, status=404)
            serializer = GroupSerializer(inst, data=request.data, partial=True)
        else:
            serializer = GroupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        return Response({"success": False, "errors": serializer.errors}, status=400)

    # GET -> list with search, ordering, filters, pagination
    qs = GroupMas.objects.all()

    search = request.GET.get('search','').strip()
    if search:
        qs = qs.filter(Q(Name__icontains=search) | Q(ShortName__icontains=search))

    # column filters
    name_f = request.GET.get('Name')
    if name_f:
        qs = qs.filter(Name__icontains=name_f)
    short_f = request.GET.get('ShortName')
    if short_f:
        qs = qs.filter(ShortName__icontains=short_f)
    active_f = request.GET.get('Active')
    if active_f:
        if active_f.lower() in ['true','1','yes']:
            qs = qs.filter(Active=True)
        elif active_f.lower() in ['false','0','no']:
            qs = qs.filter(Active=False)

    ordering = request.GET.get('ordering','Name')
    desc = False
    if ordering.startswith('-'):
        desc = True
        ordering_field = ordering[1:]
    else:
        ordering_field = ordering

    if ordering_field not in ALLOWED_ORDER_FIELDS:
        ordering_field = 'Name'
    order_by = f"-{ordering_field}" if desc else ordering_field
    qs = qs.order_by(order_by)

    # pagination params
    try:
        page = int(request.GET.get('page',1))
    except:
        page = 1
    try:
        page_size = int(request.GET.get('page_size',10))
    except:
        page_size = 10

    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page)
    serializer = GroupSerializer(page_obj, many=True)
    return Response({
        "success": True,
        "results": serializer.data,
        "total": paginator.count,
        "page": page_obj.number,
        "page_size": page_size,
        "total_pages": paginator.num_pages
    })


@api_view(['GET','PUT','DELETE'])
def group_detail(request, code):
    try:
        inst = GroupMas.objects.get(Code=code)
    except GroupMas.DoesNotExist:
        return Response({"success": False, "error": "Not found"}, status=404)

    if request.method == 'GET':
        serializer = GroupSerializer(inst)
        return Response({"success": True, "data": serializer.data})

    if request.method in ['PUT','PATCH']:
        serializer = GroupSerializer(inst, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        return Response({"success": False, "errors": serializer.errors}, status=400)

    if request.method == 'DELETE':
        inst.delete()
        return Response({"success": True, "message": "Deleted"}, status=204)


@api_view(['GET'])
def group_report(request):
    qs = GroupMas.objects.all().order_by('Name')
    serializer = GroupSerializer(qs, many=True)
    return Response({"success": True, "results": serializer.data})


ALLOWED_ORDER_FIELDS = {
    'Code': 'Code',
    'Name': 'Name',
    'ShortName': 'ShortName',
    'Active': 'Active',
    'CreatedDateTime': 'CreatedDateTime'
}

@api_view(['GET','POST'])
def category_list_add(request):
    """
    GET -> list with search, filters, sorting, pagination
    POST -> create (or update when Code provided)
    """
    # POST: create or update
    if request.method == 'POST':
        code = request.data.get('Code', None)
        if code:
            try:
                inst = CategoryMas.objects.get(Code=code)
            except CategoryMas.DoesNotExist:
                return Response({"success": False, "error": "Category not found"}, status=404)
            serializer = CategorySerializer(inst, data=request.data, partial=True)
        else:
            serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        return Response({"success": False, "errors": serializer.errors}, status=400)

    # GET: list
    qs = CategoryMas.objects.all()

    # global search
    q = request.GET.get('search','').strip()
    if q:
        qs = qs.filter(Q(Name__icontains=q) | Q(ShortName__icontains=q))

    # column filters
    code_f = request.GET.get('Code')
    if code_f:
        if code_f.isdigit():
            qs = qs.filter(Code=int(code_f))

    name_f = request.GET.get('Name')
    if name_f:
        qs = qs.filter(Name__icontains=name_f)

    short_f = request.GET.get('ShortName')
    if short_f:
        qs = qs.filter(ShortName__icontains=short_f)

    active_f = request.GET.get('Active')
    if active_f:
        if active_f.lower() in ['true','1','yes']:
            qs = qs.filter(Active=True)
        elif active_f.lower() in ['false','0','no']:
            qs = qs.filter(Active=False)

    # ordering
    ordering = request.GET.get('ordering','Name').strip()
    desc = False
    if ordering.startswith('-'):
        desc = True
        ordering_key = ordering[1:]
    else:
        ordering_key = ordering

    mapped = ALLOWED_ORDER_FIELDS.get(ordering_key) or ALLOWED_ORDER_FIELDS.get(ordering_key.capitalize())
    if not mapped:
        mapped = 'Name'
    order_by = f"-{mapped}" if desc else mapped
    qs = qs.order_by(order_by)

    # pagination
    try:
        page = int(request.GET.get('page',1))
    except:
        page = 1
    try:
        page_size = int(request.GET.get('page_size',10))
    except:
        page_size = 10

    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page)
    serializer = CategorySerializer(page_obj, many=True)

    return Response({
        "success": True,
        "results": serializer.data,
        "total": paginator.count,
        "page": page_obj.number,
        "page_size": page_size,
        "total_pages": paginator.num_pages
    })


@api_view(['GET','PUT','DELETE'])
def category_detail(request, code):
    try:
        inst = CategoryMas.objects.get(Code=code)
    except CategoryMas.DoesNotExist:
        return Response({"success": False, "error": "Category not found"}, status=404)

    if request.method == 'GET':
        serializer = CategorySerializer(inst)
        return Response({"success": True, "data": serializer.data})

    if request.method in ['PUT','PATCH']:
        serializer = CategorySerializer(inst, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        return Response({"success": False, "errors": serializer.errors}, status=400)

    if request.method == 'DELETE':
        inst.delete()
        return Response({"success": True, "message": "Deleted"}, status=204)


@api_view(['GET'])
def category_report(request):
    qs = CategoryMas.objects.all().order_by('Name')
    serializer = CategorySerializer(qs, many=True)
    return Response({"success": True, "results": serializer.data})



@api_view(["POST","GET"])
def relation_add(request):
    data = request.data
    code = data.get("Code", None)

    if code:
        try:
            relation = RelationMas.objects.get(Code=code)
            serializer = RelationSerializer(relation, data=data)
        except RelationMas.DoesNotExist:
            return Response({"error": "Relation not found"}, status=404)
    else:
        serializer = RelationSerializer(data=data)

    if serializer.is_valid():
        saved = serializer.save()
        return Response({
            "success": "Saved successfully!",
            "data": RelationSerializer(saved).data
        }, status=201)
    else:
        return Response({"error": "Validation error", "details": serializer.errors}, status=400)



@api_view(["DELETE"])
def relation_delete(request, code):
    try:
        relation = RelationMas.objects.get(Code=code)
        relation.delete()
        return Response({"success": "Deleted successfully!"})
    except RelationMas.DoesNotExist:
        return Response({"error": "Relation not found"}, status=404)


@api_view(["GET"])
def relation_get(request, code):
    try:
        relation = RelationMas.objects.get(Code=code)
        serializer = RelationSerializer(relation)
        return Response(serializer.data)
    except RelationMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


@api_view(["GET"])
def relation_report(request):
    relations = RelationMas.objects.all().order_by("Name")
    serializer = RelationSerializer(relations, many=True)
    return Response(serializer.data)


@api_view(["POST","GET"])
def religion_add(request):
    data = request.data
    code = data.get("Code", None)

    if code:
        try:
            religion = ReligionMas.objects.get(Code=code)
            serializer = ReligionSerializer(religion, data=data)
        except ReligionMas.DoesNotExist:
            return Response({"error": "Religion not found"}, status=404)
    else:
        serializer = ReligionSerializer(data=data)

    if serializer.is_valid():
        saved = serializer.save()
        return Response({
            "success": "Saved successfully!",
            "data": ReligionSerializer(saved).data
        }, status=201)     # Explicit 201 for created
    else:
        return Response({"error": "Validation error", "details": serializer.errors}, status=400)



@api_view(["DELETE"])
def religion_delete(request, code):
    try:
        religion = ReligionMas.objects.get(Code=code)
        religion.delete()
        return Response({"success": "Deleted successfully!"})
    except ReligionMas.DoesNotExist:
        return Response({"error": "Religion not found"}, status=404)


@api_view(["GET"])
def religion_get(request, code):
    try:
        religion = ReligionMas.objects.get(Code=code)
        serializer = ReligionSerializer(religion)
        return Response(serializer.data)
    except ReligionMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


@api_view(["GET"])
def religion_report(request):
    religions = ReligionMas.objects.all().order_by("Name")
    serializer = ReligionSerializer(religions, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def occupation_add(request):
    data = request.data
    code = data.get("Code", None)
    if code:
        try:
            occ = OccupationMas.objects.get(Code=code)
            serializer = OccupationSerializer(occ, data=data)
        except OccupationMas.DoesNotExist:
            return Response({"error": "Occupation not found"}, status=404)
    else:
        serializer = OccupationSerializer(data=data)
    if serializer.is_valid():
        saved = serializer.save()
        return Response({
            "success": "Saved successfully!",
            "data": OccupationSerializer(saved).data
        }, status=201)
    else:
        return Response({"error": "Validation error", "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def occupation_delete(request, code):
    try:
        occ = OccupationMas.objects.get(Code=code)
        occ.delete()
        return Response({"success": "Deleted successfully!"})
    except OccupationMas.DoesNotExist:
        return Response({"error": "Occupation not found"}, status=404)

@api_view(["GET"])
def occupation_get(request, code):
    try:
        occ = OccupationMas.objects.get(Code=code)
        serializer = OccupationSerializer(occ)
        return Response(serializer.data)
    except OccupationMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(["GET"])
def occupationreport(request):
    occupations = OccupationMas.objects.all().order_by("Name")
    serializer = OccupationSerializer(occupations, many=True)
    return Response(serializer.data)

# ===== FIXED Supplier Views =====
@api_view(["GET"])
def supplier_list(request):
    qs = SupplierMas.objects.all().order_by("Name")
    return Response(SupplierSerializer(qs, many=True).data)

@api_view(["GET"])
def supplier_detail(request, code):
    try:
        obj = SupplierMas.objects.get(Code=code)
    except SupplierMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(SupplierSerializer(obj).data)

@api_view(["POST"])
def supplier_add(request):
    data = request.data.copy()
    code = data.get("Code")  # FIXED: "code" → "Code"
    if code:
        try:
            inst = SupplierMas.objects.get(Code=code)
        except SupplierMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = SupplierSerializer(inst, data=data)
    else:
        serializer = SupplierSerializer(data=data)
    if serializer.is_valid():
        sup = serializer.save()
        return Response({"success": True, "data": SupplierSerializer(sup).data})
    print("SUPPLIER ERRORS:", serializer.errors)
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def supplier_delete(request, code):
    try:
        obj = SupplierMas.objects.get(Code=code)
    except SupplierMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["POST"])
def bank_add(request):
    data = request.data.copy()
    data.pop("CreatedDateTime", None)
    code = data.get("Code", None)
    if code:
        try:
            bank = BankMas.objects.get(Code=code)
            serializer = BankSerializer(bank, data=data)
        except BankMas.DoesNotExist:
            return Response({"error": "Bank not found"}, status=404)
    else:
        serializer = BankSerializer(data=data)
    if serializer.is_valid():
        saved = serializer.save()
        return Response({
            "success": "Saved successfully!",
            "data": BankSerializer(saved).data
        }, status=201)
    else:
        print("Serializer errors:", serializer.errors)
        return Response({"error": "Validation error", "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def bank_delete(request, code):
    try:
        bank = BankMas.objects.get(Code=code)
        bank.delete()
        return Response({"success": "Deleted successfully!"})
    except BankMas.DoesNotExist:
        return Response({"error": "Bank not found"}, status=404)

@api_view(["GET"])
def bank_get(request, code):
    try:
        bank = BankMas.objects.get(Code=code)
        serializer = BankSerializer(bank)
        return Response(serializer.data)
    except BankMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(["GET"])
def bank_report(request):
    banks = BankMas.objects.all().order_by("Name")
    serializer = BankSerializer(banks, many=True)
    return Response(serializer.data)



@api_view(["GET"])
def employee_list(request):
    qs = EmployeeMas.objects.all().order_by("Name")
    return Response(EmployeeSerializer(qs, many=True).data)

@api_view(["GET"])
def employee_detail(request, code):
    try:
        emp = EmployeeMas.objects.get(Code=code)
    except EmployeeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(EmployeeSerializer(emp).data)

@api_view(["POST"])
def employee_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = EmployeeMas.objects.get(Code=code)
        except EmployeeMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = EmployeeSerializer(inst, data=data)
    else:
        serializer = EmployeeSerializer(data=data)

    if serializer.is_valid():
        emp = serializer.save()
        return Response({"success": True, "data": EmployeeSerializer(emp).data})
    print("EMPLOYEE SERIALIZER ERRORS:", serializer.errors)  # add this
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def employee_delete(request, code):
    try:
        emp = EmployeeMas.objects.get(Code=code)
    except EmployeeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    emp.delete()
    return Response({"success": True})



@api_view(["GET"])
def tax_type_list(request):
    qs = TaxTypeMas.objects.all().order_by("Name")
    return Response(TaxTypeSerializer(qs, many=True).data)

@api_view(["GET"])
def tax_type_detail(request, code):
    try:
        obj = TaxTypeMas.objects.get(Code=code)
    except TaxTypeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(TaxTypeSerializer(obj).data)

@api_view(["POST"])
def tax_type_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if not code:
        # new record – set created time if not provided
        if not data.get("CreatedDateTime"):
          data["CreatedDateTime"] = timezone.now()

    if code:
        try:
            inst = TaxTypeMas.objects.get(Code=code)
        except TaxTypeMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = TaxTypeSerializer(inst, data=data)
    else:
        serializer = TaxTypeSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": TaxTypeSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def tax_type_delete(request, code):
    try:
        obj = TaxTypeMas.objects.get(Code=code)
    except TaxTypeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def system_list(request):
    qs = SystemMas.objects.all().order_by("Name")
    return Response(SystemSerializer(qs, many=True).data)

@api_view(["GET"])
def system_detail(request, code):
    try:
        obj = SystemMas.objects.get(Code=code)
    except SystemMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(SystemSerializer(obj).data)

@api_view(["POST"])
def system_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = SystemMas.objects.get(Code=code)
        except SystemMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = SystemSerializer(inst, data=data)
    else:
        serializer = SystemSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": SystemSerializer(obj).data})
    print("SYSTEM SERIALIZER ERRORS:", serializer.errors)  # <-- add
    return Response({"error": True, "details": serializer.errors}, status=400)


@api_view(["DELETE"])
def system_delete(request, code):
    try:
        obj = SystemMas.objects.get(Code=code)
    except SystemMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})



@api_view(["GET"])
def counter_list(request):
    qs = CounterMas.objects.all().order_by("Name")
    return Response(CounterSerializer(qs, many=True).data)

@api_view(["GET"])
def counter_detail(request, code):
    try:
        obj = CounterMas.objects.get(Code=code)
    except CounterMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(CounterSerializer(obj).data)

@api_view(["POST"])
def counter_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = CounterMas.objects.get(Code=code)
        except CounterMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = CounterSerializer(inst, data=data)
    else:
        serializer = CounterSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": CounterSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def counter_delete(request, code):
    try:
        obj = CounterMas.objects.get(Code=code)
    except CounterMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def system_counter_list(request):
    qs = SystemCounterMas.objects.all().order_by("CounterCode")
    return Response(SystemCounterSerializer(qs, many=True).data)

@api_view(["GET"])
def system_counter_detail(request, code):
    try:
        obj = SystemCounterMas.objects.get(Code=code)
    except SystemCounterMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(SystemCounterSerializer(obj).data)

@api_view(["POST"])
def system_counter_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = SystemCounterMas.objects.get(Code=code)
        except SystemCounterMas.DoesNotExist:
        # editing existing
            return Response({"error": "Not found"}, status=404)
        serializer = SystemCounterSerializer(inst, data=data)
    else:
        serializer = SystemCounterSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": SystemCounterSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def system_counter_delete(request, code):
    try:
        obj = SystemCounterMas.objects.get(Code=code)
    except SystemCounterMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def counter_group_list(request):
    qs = CounterGroupMas.objects.all().order_by("Name")
    return Response(CounterGroupSerializer(qs, many=True).data)

@api_view(["GET"])
def counter_group_detail(request, code):
    try:
        obj = CounterGroupMas.objects.get(Code=code)
    except CounterGroupMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(CounterGroupSerializer(obj).data)

@api_view(["POST"])
def counter_group_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = CounterGroupMas.objects.get(Code=code)
        except CounterGroupMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = CounterGroupSerializer(inst, data=data)
    else:
        serializer = CounterGroupSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": CounterGroupSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def counter_group_delete(request, code):
    try:
        obj = CounterGroupMas.objects.get(Code=code)
    except CounterGroupMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def giftvoucher_list(request):
    qs = GiftvoucherMas.objects.all().order_by("Name")
    return Response(GiftvoucherSerializer(qs, many=True).data)

@api_view(["GET"])
def giftvoucher_detail(request, code):
    try:
        obj = GiftvoucherMas.objects.get(Code=code)
    except GiftvoucherMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(GiftvoucherSerializer(obj).data)

@api_view(["POST"])
def giftvoucher_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = GiftvoucherMas.objects.get(Code=code)
        except GiftvoucherMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = GiftvoucherSerializer(inst, data=data)
    else:
        serializer = GiftvoucherSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": GiftvoucherSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def giftvoucher_delete(request, code):
    try:
        obj = GiftvoucherMas.objects.get(Code=code)
    except GiftvoucherMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def paymentmode_list(request):
    qs = PaymentModeMas.objects.all().order_by("Name")
    return Response(PaymentModeSerializer(qs, many=True).data)

@api_view(["GET"])
def paymentmode_detail(request, code):
    try:
        obj = PaymentModeMas.objects.get(Code=code)
    except PaymentModeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(PaymentModeSerializer(obj).data)

@api_view(["POST"])
def paymentmode_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = PaymentModeMas.objects.get(Code=code)
        except PaymentModeMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = PaymentModeSerializer(inst, data=data)
    else:
        serializer = PaymentModeSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": PaymentModeSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def paymentmode_delete(request, code):
    try:
        obj = PaymentModeMas.objects.get(Code=code)
    except PaymentModeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def discounttype_list(request):
    qs = DiscountTypeMas.objects.all().order_by("Name")
    return Response(DiscountTypeSerializer(qs, many=True).data)

@api_view(["GET"])
def discounttype_detail(request, code):
    try:
        obj = DiscountTypeMas.objects.get(Code=code)
    except DiscountTypeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(DiscountTypeSerializer(obj).data)

@api_view(["POST"])
def discounttype_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = DiscountTypeMas.objects.get(Code=code)
        except DiscountTypeMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = DiscountTypeSerializer(inst, data=data)
    else:
        serializer = DiscountTypeSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": DiscountTypeSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def discounttype_delete(request, code):
    try:
        obj = DiscountTypeMas.objects.get(Code=code)
    except DiscountTypeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def incomeexpense_list(request):
    qs = IncomeAndExpenseMas.objects.all().order_by("Name")
    return Response(IncomeExpenseSerializer(qs, many=True).data)

@api_view(["GET"])
def incomeexpense_detail(request, code):
    try:
        obj = IncomeAndExpenseMas.objects.get(Code=code)
    except IncomeAndExpenseMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(IncomeExpenseSerializer(obj).data)

@api_view(["POST"])
def incomeexpense_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = IncomeAndExpenseMas.objects.get(Code=code)
        except IncomeAndExpenseMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = IncomeExpenseSerializer(inst, data=data)
    else:
        serializer = IncomeExpenseSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": IncomeExpenseSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def incomeexpense_delete(request, code):
    try:
        obj = IncomeAndExpenseMas.objects.get(Code=code)
    except IncomeAndExpenseMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})





@api_view(["GET"])
def department_detail(request, code):
    try:
        obj = DepartmentMas.objects.get(Code=code)
    except DepartmentMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(DepartmentSerializer(obj).data)

@api_view(["GET"])
def department_list(request):
    qs = DepartmentMas.objects.all().order_by("Name")
    return Response(DepartmentSerializer(qs, many=True).data)

@api_view(["POST"])
def department_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = DepartmentMas.objects.get(Code=code)
        except DepartmentMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = DepartmentSerializer(inst, data=data)
    else:
        serializer = DepartmentSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": DepartmentSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)


@api_view(["DELETE"])
def department_delete(request, code):
    try:
        obj = DepartmentMas.objects.get(Code=code)
    except DepartmentMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})

@api_view(["GET"])
def floor_list(request):
    qs = FloorMas.objects.all().order_by("LocationCode", "Name")
    return Response(FloorSerializer(qs, many=True).data)

@api_view(["GET"])
def floor_detail(request, code):
    try:
        obj = FloorMas.objects.get(Code=code)
    except FloorMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(FloorSerializer(obj).data)

@api_view(["POST"])
def floor_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = FloorMas.objects.get(Code=code)
        except FloorMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = FloorSerializer(inst, data=data)
    else:
        serializer = FloorSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": FloorSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def floor_delete(request, code):
    try:
        obj = FloorMas.objects.get(Code=code)
    except FloorMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def transfermode_list(request):
    qs = TransferModeMas.objects.all().order_by("Name")
    return Response(TransferModeSerializer(qs, many=True).data)

@api_view(["GET"])
def transfermode_detail(request, code):
    try:
        obj = TransferModeMas.objects.get(Code=code)
    except TransferModeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(TransferModeSerializer(obj).data)

@api_view(["POST"])
def transfermode_add(request):
    data = request.data.copy()
    code = data.get("Code")

    if code:
        try:
            inst = TransferModeMas.objects.get(Code=code)
        except TransferModeMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = TransferModeSerializer(inst, data=data)
    else:
        serializer = TransferModeSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": TransferModeSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def transfermode_delete(request, code):
    try:
        obj = TransferModeMas.objects.get(Code=code)
    except TransferModeMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})


@api_view(["GET"])
def star_list(request):
    qs = Starmas.objects.all().order_by("Starname")  # FIXED: Starname
    return Response(StarSerializer(qs, many=True).data)

@api_view(["GET"])
def star_detail(request, code):
    try:
        obj = Starmas.objects.get(Code=code)  # FIXED: Code
    except Starmas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(StarSerializer(obj).data)

@api_view(["POST"])
def star_add(request):
    data = request.data.copy()
    code = data.get("Code")  # FIXED: Code

    if code:
        try:
            inst = Starmas.objects.get(Code=code)  # FIXED: Code
        except Starmas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = StarSerializer(inst, data=data)
    else:
        serializer = StarSerializer(data=data)

    if serializer.is_valid():
        obj = serializer.save()
        return Response({"success": True, "data": StarSerializer(obj).data})
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def star_delete(request, code):
    try:
        obj = Starmas.objects.get(Code=code)  # FIXED: Code
    except Starmas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})

# ---------- Lookup APIs ----------

@api_view(["GET"])
def title_list(request):
    qs = TitleMas.objects.all().order_by("Name")
    return Response(TitleSerializer(qs, many=True).data)

@api_view(["GET"])
def supplier_group_list(request):
    qs = GroupMas.objects.all().order_by("Name")
    return Response(GroupSerializer(qs, many=True).data)

@api_view(["GET"])
def supplier_grade_list(request):
    qs = GradeMas.objects.all().order_by("Name")
    return Response(GradeSerializer(qs, many=True).data)

@api_view(["GET"])
def supplier_category_list(request):
    qs = CategoryMas.objects.all().order_by("Name")
    return Response(CategorySerializer(qs, many=True).data)

@api_view(["GET"])
def city_lookup_list(request):
    qs = CityMas.objects.all().order_by("Name")
    return Response(CitySerializer(qs, many=True).data)

@api_view(["GET"])
def location_lookup_list(request):
    qs = LocationMas.objects.all().order_by("Name")
    return Response(LocationSerializer(qs, many=True).data)

@api_view(["GET"])
def bank_list(request):
    qs = BankMas.objects.all().order_by("Name")
    return Response(BankSerializer(qs, many=True).data)

# ---------- Supplier CRUD ----------

@api_view(["GET"])
def supplier_list(request):
    qs = SupplierMas.objects.all().order_by("Name")  # FIXED: "name" → "Name"
    return Response(SupplierSerializer(qs, many=True).data)

@api_view(["GET"])
def supplier_detail(request, code):
    try:
        obj = SupplierMas.objects.get(Code=code)  # FIXED: code → Code
    except SupplierMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(SupplierSerializer(obj).data)

@api_view(["POST"])
def supplier_add(request):
    data = request.data.copy()
    code = data.get("Code")  # FIXED: "code" → "Code"

    if code:
        try:
            inst = SupplierMas.objects.get(Code=code)  # FIXED: code → Code
        except SupplierMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = SupplierSerializer(inst, data=data)
    else:
        serializer = SupplierSerializer(data=data)

    if serializer.is_valid():
        sup = serializer.save()
        return Response({"success": True, "data": SupplierSerializer(sup).data})
    print("SUPPLIER ERRORS:", serializer.errors)
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def supplier_delete(request, code):
    try:
        obj = SupplierMas.objects.get(Code=code)  # FIXED: code → Code
    except SupplierMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    obj.delete()
    return Response({"success": True})





# ===== Cities API for dropdown (with State & Country) =====
@api_view(["GET"])
def city_list(request):
    qs = CityMas.objects.all().order_by("Name")
    serializer = CitySerializer(qs, many=True)
    return Response(serializer.data)


# ===== Location APIs =====
@api_view(["GET"])
def location_list(request):
    qs = LocationMas.objects.all().order_by("Name")
    return Response(LocationSerializer(qs, many=True).data)

@api_view(["GET"])
def location_detail(request, code):
    try:
        loc = LocationMas.objects.get(Code=code)
    except LocationMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(LocationSerializer(loc).data)

@api_view(["POST"])
def location_add(request):
    data = request.data.copy()
    code = data.get("Code")

    # Code present → update, else create
    if code:
        try:
            inst = LocationMas.objects.get(Code=code)
        except LocationMas.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
        serializer = LocationSerializer(inst, data=data)
    else:
        serializer = LocationSerializer(data=data)

    if serializer.is_valid():
        loc = serializer.save()
        return Response({"success": True, "data": LocationSerializer(loc).data})
    # for debugging, you can temporarily print errors:
    # print("LOCATION ERRORS:", serializer.errors)
    return Response({"error": True, "details": serializer.errors}, status=400)

@api_view(["DELETE"])
def location_delete(request, code):
    try:
        loc = LocationMas.objects.get(Code=code)
    except LocationMas.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    loc.delete()
    return Response({"success": True})