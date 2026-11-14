# textile/models/master/tally.py
from django.db import models


class GroupHeadMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    group_head_code = models.IntegerField(null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    type = models.CharField(max_length=1, null=True, blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'textile'
        db_table = "GroupHeadMas"

    def __str__(self):
        return self.name


class AccountHeadMas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    short_name = models.CharField(max_length=25)
    head_type = models.IntegerField(null=True, blank=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    group_head_id = models.IntegerField(null=True, blank=True)
    classification_name = models.CharField(max_length=50, null=True, blank=True)
    accessible_value = models.BooleanField(default=False)

    class Meta:
        app_label = 'textile'
        db_table = "AccountHeadMas"

    def __str__(self):
        return self.name

