# textile/models/master/tally.py
from django.db import models


class GroupHeadMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    group_head_code = models.IntegerField(null=True, blank=True, default=0, db_column='GroupHeadCode')
    is_primary = models.BooleanField(default=False, db_column='isPrimary')
    type = models.CharField(max_length=1, null=True, blank=True, db_column='Type')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = "GroupHeadMas"
        managed = False

    def __str__(self):
        return self.name


class AccountHeadMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    head_type = models.IntegerField(null=True, blank=True, default=0, db_column='HeadType')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    group_head_id = models.IntegerField(null=True, blank=True, default=0, db_column='Groupheadcode')
    classification_name = models.CharField(max_length=50, null=True, blank=True, db_column='ClassificationName')
    accessible_value = models.BooleanField(default=False, db_column='AccessibleValue')

    class Meta:
        app_label = 'textile'
        db_table = "AccountHeadMas"
        managed = False

    def __str__(self):
        return self.name
