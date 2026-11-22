# textile/serializers/master/accounts.py
from rest_framework import serializers
from textile.models import GroupHead, Naration, TransactionHead, AccountSide


class AccountSideSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountSide
        fields = ["id", "side"]


class AgentLookupSerializer(serializers.ModelSerializer):
    city_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        from textile.models import AgentMas
        model = AgentMas
        fields = ["id", "name", "shortname", "city_id", "city_name", "active"]

    def get_city_name(self, obj):
        if getattr(obj, "city_id", None):
            from textile.models import CityMas
            city = CityMas.objects.filter(id=obj.city_id).first()
            if city:
                return city.name
        return ""


class AccountsGroupHeadSerializer(serializers.ModelSerializer):
    parent_group_name = serializers.SerializerMethodField(read_only=True)
    account_side_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = GroupHead
        fields = [
            "id", "location_code", "name", "shortname", "group_head_code",
            "parent_group_name", "ac_type", "head_type", "sort_by",
            "need_detail_report", "account_side", "account_side_name",
            "active", "admin_id", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def get_parent_group_name(self, obj):
        if obj.group_head_code:
            parent = GroupHead.objects.filter(id=obj.group_head_code).first()
            if parent:
                return parent.name
        return ""

    def get_account_side_name(self, obj):
        if obj.account_side:
            side = AccountSide.objects.filter(id=obj.account_side).first()
            if side:
                return side.side
        return ""

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Group Head name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Group Head name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val


class NarationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Naration
        fields = ["id", "location_code", "naration", "active", "admin_id", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_naration(self, value):
        val = (value or "").strip()
        if not val:
            raise serializers.ValidationError("Naration is required.")
        if len(val) > 200:
            raise serializers.ValidationError("Naration cannot exceed 200 characters.")
        return val


class TransactionHeadSerializer(serializers.ModelSerializer):
    group_head_name = serializers.SerializerMethodField(read_only=True)
    active = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TransactionHead
        fields = [
            "id", "location_code", "name", "shortname", "group_head_code",
            "group_head_name", "ac_type", "head_type", "cancel", "active",
            "ssretail_code", "admin_id", "created_at"
        ]
        read_only_fields = ["id", "created_at"]

    def get_group_head_name(self, obj):
        if obj.group_head_code:
            gh = GroupHead.objects.filter(id=obj.group_head_code).first()
            if gh:
                return gh.name
        return ""

    def get_active(self, obj):
        return not obj.cancel

    def validate_name(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Transaction Head name is required.")
        if len(val) > 50:
            raise serializers.ValidationError("Transaction Head name cannot exceed 50 characters.")
        return val

    def validate_shortname(self, value):
        val = (value or "").strip().upper()
        if not val:
            raise serializers.ValidationError("Short name is required.")
        if len(val) > 25:
            raise serializers.ValidationError("Short name cannot exceed 25 characters.")
        return val
