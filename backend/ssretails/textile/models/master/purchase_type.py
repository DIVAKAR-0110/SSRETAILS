# textile/models/master/purchase_type.py
from django.db import models


class PurchaseTypeMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, null=True, blank=True, db_column='Shortname')
    maximumamount = models.DecimalField(
        max_digits=18,
        decimal_places=5,
        default=0.00000,
        db_column='MaximumAmount'
    )
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        app_label = 'textile'
        db_table = 'PurchaseTypeMas'

    def __str__(self):
        return self.name
