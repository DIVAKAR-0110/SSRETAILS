# textile/views/master/general.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db import transaction

from textile.models import (
    CountryMas, StateMas, CityMas, TitleMas, GradeMas, GroupMas, CategoryMas,
    RelationMas, ReligionMas, OccupationMas, BankMas, EmployeeMas, TaxTypeMas,
    SystemMas, CounterMas, SystemCounterIntegrationMas, SystemCounterMas, SystemCounterDet,
    CounterGroupMas, PrintFunctionMas,
    GiftvoucherMas, PaymentModeMas, DiscountTypeMas, IncomeAndExpenseMas,
    DepartmentMas, FloorMas, TransferModeMas, StarMas, UserGroup, EmployeeIncentiveMas
)
from textile.serializers import (
    CountrySerializer, StateSerializer, CitySerializer, TitleSerializer, GradeSerializer,
    GroupSerializer, CategorySerializer, RelationSerializer, ReligionSerializer,
    OccupationSerializer, BankSerializer, EmployeeSerializer, TaxTypeSerializer,
    SystemMasSerializer, CounterSerializer, SystemCounterIntegrationSerializer,
    SystemCounterDetSerializer, CounterGroupSerializer, PrintFunctionSerializer,
    GiftvoucherSerializer, PaymentModeSerializer,
    DiscountTypeSerializer, IncomeAndExpenseSerializer, DepartmentSerializer,
    FloorSerializer, TransferModeSerializer, StarSerializer, UserGroupSerializer,
    EmployeeIncentiveSerializer
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
    queryset = GradeMas.objects.all().order_by("-created_at")
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
    queryset = EmployeeMas.objects.all().order_by("name")
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=["get"])
    def incentives(self, request, pk=None):
        incentives = EmployeeIncentiveMas.objects.filter(employee_code=pk).order_by("id")
        serializer = EmployeeIncentiveSerializer(incentives, many=True)
        return Response(serializer.data)


class UserGroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserGroup.objects.filter(active=True).order_by("name")
    serializer_class = UserGroupSerializer
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
    queryset = SystemCounterMas.objects.all().order_by("-created_at")
    serializer_class = SystemCounterIntegrationSerializer
    permission_classes = [AllowAny]

    def _attach_child_data(self, instance, data):
        child_rows = SystemCounterDet.objects.filter(
            location_id=instance.location_id,
            counter_id=instance.counter_id,
            counter_type=instance.counter_type
        )
        data["systems"] = SystemCounterDetSerializer(child_rows, many=True).data
        return data

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        data = []
        for obj, s_data in zip(queryset, serializer.data):
            row_dict = dict(s_data)
            self._attach_child_data(obj, row_dict)
            data.append(row_dict)
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = dict(serializer.data)
        data = self._attach_child_data(instance, data)
        return Response(data)

    def _sync_child_records(self, instance, raw_data):
        systems_data = raw_data.get("systems")
        if systems_data is not None:
            SystemCounterDet.objects.filter(
                location_id=instance.location_id,
                counter_id=instance.counter_id,
                counter_type=instance.counter_type
            ).delete()
            for item in systems_data:
                sys_id = item.get("system_id") or item.get("id")
                if sys_id:
                    SystemCounterDet.objects.create(
                        location_id=instance.location_id,
                        counter_id=instance.counter_id,
                        system_id=int(sys_id),
                        counter_type=instance.counter_type
                    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            instance = serializer.save()
            self._sync_child_records(instance, request.data)

        headers = self.get_success_headers(serializer.data)
        data = dict(serializer.data)
        data = self._attach_child_data(instance, data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            instance = serializer.save()
            self._sync_child_records(instance, request.data)

        data = dict(serializer.data)
        data = self._attach_child_data(instance, data)
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        with transaction.atomic():
            SystemCounterDet.objects.filter(
                location_id=instance.location_id,
                counter_id=instance.counter_id,
                counter_type=instance.counter_type
            ).delete()
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PrintFunctionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PrintFunctionMas.objects.all().order_by("name")
    serializer_class = PrintFunctionSerializer
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
    queryset = IncomeAndExpenseMas.objects.all().order_by("name")
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

