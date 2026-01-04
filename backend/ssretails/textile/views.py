# backend/ssretails/textile/views.py
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Administrator
from .secondmodels import ItemCategoryMas4, ItemCategoryMas3, ItemCategoryMas2
from .serializers import *
from .utils import send_login_mail

def errorpage(request):
    return render(request,"404Error.html",status=503)

@api_view(["POST"])
@permission_classes([AllowAny])
def admin_login(request):
    serializer = AdministratorLoginSerializer(data=request.data)

    if not serializer.is_valid():
        email = request.data.get("email")

        if email:
            pass

        return Response(
            {"message": "Invalid credentials", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    admin = serializer.validated_data["admin"]


    data = AdministratorSerializer(admin).data
    data.pop("password", None)  # extra safety

    return Response(
        {"message": "Login success", "data": data},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_register(request):
    serializer = AdministratorSerializer(data=request.data)

    if serializer.is_valid():
        admin = serializer.save()

        send_login_mail(
            email=admin.email,
            subject="Welcome to SSRetails",
            message=(
                f"Dear {admin.username},\n\n"
                "Your administrator account has been created successfully.\n\n"
                "Regards,\nSSRetails Team"
            ),
        )

        return Response(
            {"message": "Administrator created"},
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {"message": "Validation error", "errors": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )



class CountryViewSet(viewsets.ModelViewSet):
    queryset = CountryMas.objects.all().order_by('-created_at')
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]


class StateViewSet(viewsets.ModelViewSet):
    queryset = StateMas.objects.all().order_by("-created_at")
    serializer_class = StateSerializer
    permission_classes = [AllowAny]


class CityViewSet(viewsets.ModelViewSet):
    queryset = CityMas.objects.all().order_by("-created_at")
    serializer_class = CitySerializer
    permission_classes = [AllowAny]


class TitleViewSet(viewsets.ModelViewSet):
    queryset = TitleMas.objects.all().order_by("-created_at")
    serializer_class = TitleSerializer
    permission_classes = [AllowAny]


class GradeViewSet(viewsets.ModelViewSet):
    queryset = GradeMas.objects.all().order_by("created_at")
    serializer_class = GradeSerializer
    permission_classes = [AllowAny]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = GroupMas.objects.all().order_by("-created_at")
    serializer_class = GroupSerializer
    permission_classes = [AllowAny]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = CategoryMas.objects.all().order_by("-created_at")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class RelationViewSet(viewsets.ModelViewSet):
    queryset = RelationMas.objects.all().order_by("-created_at")
    serializer_class = RelationSerializer
    permission_classes = [AllowAny]

class ReligionViewSet(viewsets.ModelViewSet):
    queryset = ReligionMas.objects.all().order_by("-created_at")
    serializer_class = ReligionSerializer
    permission_classes = [AllowAny]

class OccupationViewSet(viewsets.ModelViewSet):
    queryset = OccupationMas.objects.all().order_by("-created_at")
    serializer_class = OccupationSerializer
    permission_classes = [AllowAny]

class BankViewSet(viewsets.ModelViewSet):
    queryset = BankMas.objects.all().order_by("-created_at")
    serializer_class = BankSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        from django.utils import timezone
        serializer.save(altered_at=timezone.now())


class SystemCounterIntegrationViewSet(viewsets.ModelViewSet):
    queryset = SystemCounterIntegrationMas.objects.all().order_by("-created_at")
    serializer_class = SystemCounterIntegrationSerializer
    permission_classes = [AllowAny]


class SystemMasViewSet(viewsets.ModelViewSet):
    queryset = SystemMas.objects.all().order_by("-created_at")
    serializer_class = SystemMasSerializer
    permission_classes = [AllowAny]

class TaxTypeViewSet(viewsets.ModelViewSet):
    queryset = TaxTypeMas.objects.all().order_by("-created_at")
    serializer_class = TaxTypeSerializer
    permission_classes = [AllowAny]


class CounterViewSet(viewsets.ModelViewSet):
    queryset = CounterMas.objects.all().order_by("-created_at")
    serializer_class = CounterSerializer
    permission_classes = [AllowAny]

class IncomeAndExpenseViewSet(viewsets.ModelViewSet):
    queryset = IncomeAndExpenseMas.objects.all().order_by("-created_at")
    serializer_class = IncomeAndExpenseSerializer
    permission_classes = [AllowAny]


class CounterGroupViewSet(viewsets.ModelViewSet):
    queryset = CounterGroupMas.objects.all().order_by("-created_at")
    serializer_class = CounterGroupSerializer
    permission_classes = [AllowAny]

class GiftvoucherViewSet(viewsets.ModelViewSet):
    queryset = GiftvoucherMas.objects.all().order_by("-created_at")
    serializer_class = GiftvoucherSerializer
    permission_classes = [AllowAny]

class PaymentModeViewSet(viewsets.ModelViewSet):
    queryset = PaymentModeMas.objects.all().order_by("-created_at")
    serializer_class = PaymentModeSerializer
    permission_classes = [AllowAny]

class DiscountTypeViewSet(viewsets.ModelViewSet):
    queryset = DiscountTypeMas.objects.all().order_by("-created_at")
    serializer_class = DiscountTypeSerializer
    permission_classes = [AllowAny]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = DepartmentMas.objects.all().order_by("-created_at")
    serializer_class = DepartmentSerializer
    permission_classes = [AllowAny]

class FloorViewSet(viewsets.ModelViewSet):
    queryset = FloorMas.objects.all().order_by("-created_at")
    serializer_class = FloorSerializer
    permission_classes = [AllowAny]

class TransferModeViewSet(viewsets.ModelViewSet):
    queryset = TransferModeMas.objects.all().order_by("-created_at")
    serializer_class = TransferModeSerializer
    permission_classes = [AllowAny]

class StarViewSet(viewsets.ModelViewSet):
    queryset = StarMas.objects.all().order_by("-created_at")
    serializer_class = StarSerializer
    permission_classes = [AllowAny]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = LocationMas.objects.all().order_by("-created_at")
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]


class GroupHeadViewSet(viewsets.ModelViewSet):
    queryset = GroupHeadMas.objects.all().order_by("-created_at")
    serializer_class = GroupHeadSerializer
    permission_classes = [AllowAny]

class AccountHeadViewSet(viewsets.ModelViewSet):
    queryset = AccountHeadMas.objects.all().order_by("-created_at")
    serializer_class = AccountHeadSerializer
    permission_classes = [AllowAny]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = EmployeeMas.objects.all().order_by("-created_at")
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]


class BrandViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas1.objects.all().order_by('-created_at')
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]

class TypeViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas2.objects.all().order_by('-created_at')
    serializer_class = TypeSerializer
    permission_classes = [AllowAny]

class StyleViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas3.objects.all().order_by('-created_at')
    serializer_class = StyleSerializer
    permission_classes = [AllowAny]

class PatternViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas4.objects.all().order_by('-created_at')
    serializer_class = PatternSerializer
    permission_classes = [AllowAny]

class ColorViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas5.objects.all().order_by('-created_at')
    serializer_class = ColorSerializer
    permission_classes = [AllowAny]

class HsnCodeViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas6.objects.all().order_by('-created_at')
    serializer_class = HsnCodeSerializer
    permission_classes = [AllowAny]

class FloorsViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas7.objects.all().order_by('-created_at')
    serializer_class = FloorsSerializer
    permission_classes = [AllowAny]

class SectionViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas8.objects.all().order_by('-created_at')
    serializer_class = SectionSerializer
    permission_classes = [AllowAny]

class SectionGroupViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas9.objects.all().order_by('-created_at')
    serializer_class = SectionGroupSerializer
    permission_classes = [AllowAny]

class SizeOrderViewSet(viewsets.ModelViewSet):
    queryset = ItemCategoryMas10.objects.all().order_by('-created_at')
    serializer_class = SizeOrderSerializer
    permission_classes = [AllowAny]
