# textile/views/master/general.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.utils import timezone

from textile.models import (
    CountryMas, StateMas, CityMas, TitleMas, GradeMas, GroupMas, CategoryMas,
    RelationMas, ReligionMas, OccupationMas, BankMas, EmployeeMas, TaxTypeMas,
    SystemMas, CounterMas, SystemCounterIntegrationMas, CounterGroupMas,
    GiftvoucherMas, PaymentModeMas, DiscountTypeMas, IncomeAndExpenseMas,
    DepartmentMas, FloorMas, TransferModeMas, StarMas
)
from textile.serializers import (
    CountrySerializer, StateSerializer, CitySerializer, TitleSerializer, GradeSerializer,
    GroupSerializer, CategorySerializer, RelationSerializer, ReligionSerializer,
    OccupationSerializer, BankSerializer, EmployeeSerializer, TaxTypeSerializer,
    SystemMasSerializer, CounterSerializer, SystemCounterIntegrationSerializer,
    CounterGroupSerializer, GiftvoucherSerializer, PaymentModeSerializer,
    DiscountTypeSerializer, IncomeAndExpenseSerializer, DepartmentSerializer,
    FloorSerializer, TransferModeSerializer, StarSerializer
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
        serializer.save(altered_at=timezone.now())


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = EmployeeMas.objects.all().order_by("-created_at")
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]


class TaxTypeViewSet(viewsets.ModelViewSet):
    queryset = TaxTypeMas.objects.all().order_by("-created_at")
    serializer_class = TaxTypeSerializer
    permission_classes = [AllowAny]


class SystemMasViewSet(viewsets.ModelViewSet):
    queryset = SystemMas.objects.all().order_by("-created_at")
    serializer_class = SystemMasSerializer
    permission_classes = [AllowAny]


class CounterViewSet(viewsets.ModelViewSet):
    queryset = CounterMas.objects.all().order_by("-created_at")
    serializer_class = CounterSerializer
    permission_classes = [AllowAny]


class SystemCounterIntegrationViewSet(viewsets.ModelViewSet):
    queryset = SystemCounterIntegrationMas.objects.all().order_by("-created_at")
    serializer_class = SystemCounterIntegrationSerializer
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


class IncomeAndExpenseViewSet(viewsets.ModelViewSet):
    queryset = IncomeAndExpenseMas.objects.all().order_by("-created_at")
    serializer_class = IncomeAndExpenseSerializer
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

