# textile/models/master/accounts.py
from django.db import models


class GroupHead(models.Model):
    """
    Accounts Group Head model mapped to table [GroupHead] in GANESHSSRETAIL.
    Used by stored procedure spGroupHead.
    """
    id = models.AutoField(primary_key=True, db_column='Code')
    location_code = models.IntegerField(null=True, blank=True, default=0, db_column='LocationCode')
    name = models.CharField(max_length=50, null=True, blank=True, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='ShortName')
    group_head_code = models.IntegerField(null=True, blank=True, default=0, db_column='GroupHeadCode')
    ac_type = models.CharField(max_length=10, null=True, blank=True, db_column='AC_Type')
    head_type = models.IntegerField(null=True, blank=True, default=0, db_column='HeadType')
    sort_by = models.DecimalField(max_digits=18, decimal_places=2, default=0, db_column='SortBy')
    need_detail_report = models.BooleanField(default=False, db_column='NeedDetailReport')
    account_side = models.IntegerField(null=True, blank=True, default=0, db_column='AccountSide')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    update_user_id = models.IntegerField(null=True, blank=True, default=0, db_column='UpdateUserID')
    update_date_time = models.DateTimeField(null=True, blank=True, db_column='UpdateUserEntryDateTime')
    cancel_user_id = models.IntegerField(null=True, blank=True, default=0, db_column='CancelUserID')
    cancel_date_time = models.DateTimeField(null=True, blank=True, db_column='CancelUserEntryDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'GroupHead'
        managed = False

    def __str__(self):
        return self.name or f"GroupHead #{self.id}"


class Naration(models.Model):
    """
    Naration Master model mapped to table [Naration] in GANESHSSRETAIL.
    Used by stored procedure spNaration.
    """
    id = models.AutoField(primary_key=True, db_column='Code')
    location_code = models.IntegerField(null=True, blank=True, default=0, db_column='LocationCode')
    naration = models.CharField(max_length=200, db_column='Naration')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    update_user_id = models.IntegerField(null=True, blank=True, default=0, db_column='UpdateUserID')
    update_date_time = models.DateTimeField(null=True, blank=True, db_column='UpdateUserEntryDateTime')
    cancel_user_id = models.IntegerField(null=True, blank=True, default=0, db_column='CancelUserID')
    cancel_date_time = models.DateTimeField(null=True, blank=True, db_column='CancelUserEntryDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'Naration'
        managed = False

    def __str__(self):
        return self.naration


class TransactionHead(models.Model):
    """
    Transaction Head model mapped to table [TransactionHead] in GANESHSSRETAIL.
    Used by stored procedure SPTRANSACTIONHEAD.
    """
    id = models.AutoField(primary_key=True, db_column='Code')
    location_code = models.IntegerField(null=True, blank=True, default=0, db_column='LocationCode')
    name = models.CharField(max_length=50, null=True, blank=True, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='ShortName')
    group_head_code = models.IntegerField(null=True, blank=True, default=0, db_column='GroupHeadCode')
    ac_type = models.CharField(max_length=10, null=True, blank=True, db_column='AC_Type')
    head_type = models.IntegerField(null=True, blank=True, default=0, db_column='HeadType')
    cancel = models.BooleanField(default=False, db_column='Cancel')
    ssretail_code = models.IntegerField(null=True, blank=True, default=0, db_column='SSretailCode')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    update_user_id = models.IntegerField(null=True, blank=True, default=0, db_column='UpdateUserID')
    update_date_time = models.DateTimeField(null=True, blank=True, db_column='UpdateUserEntryDateTime')
    cancel_user_id = models.IntegerField(null=True, blank=True, default=0, db_column='CancelUserID')
    cancel_date_time = models.DateTimeField(null=True, blank=True, db_column='CancelUserEntryDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'TransactionHead'
        managed = False

    def __str__(self):
        return self.name or f"TransactionHead #{self.id}"


class AccountSide(models.Model):
    """
    AccountSide lookup model mapped to table [AccountSide] in GANESHSSRETAIL.
    """
    id = models.AutoField(primary_key=True, db_column='Code')
    side = models.CharField(max_length=50, null=True, blank=True, db_column='Side')

    class Meta:
        app_label = 'textile'
        db_table = 'AccountSide'
        managed = False

    def __str__(self):
        return self.side or f"Side #{self.id}"
