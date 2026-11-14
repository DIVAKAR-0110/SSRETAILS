# textile/views/auth.py
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from textile.models import Administrator
from textile.serializers import AdministratorSerializer, AdministratorLoginSerializer
from textile.utils import send_login_mail


def errorpage(request):
    return render(request, "404Error.html")


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_login(request):
    serializer = AdministratorLoginSerializer(data=request.data)

    if not serializer.is_valid():
        email = request.data.get("email")

        if email:
            send_login_mail(
                email=email,
                subject="SSRetails Login Failed",
                message=(
                    "Dear User,\n\n"
                    "There was a failed login attempt to your SSRetails account.\n"
                    "If this was not you, please secure your account.\n\n"
                    "Regards,\nSSRetails Team"
                ),
            )

        return Response(
            {"message": "Invalid credentials", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    admin = serializer.validated_data["admin"]

    send_login_mail(
        email=admin.email,
        subject="SSRetails Login Successful",
        message=(
            f"Dear {admin.username},\n\n"
            "You have successfully logged in to SSRetails.\n\n"
            "If this was not you, please contact support immediately.\n\n"
            "Regards,\nSSRetails Team"
        ),
    )

    data = AdministratorSerializer(admin).data
    data.pop("password", None)

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

