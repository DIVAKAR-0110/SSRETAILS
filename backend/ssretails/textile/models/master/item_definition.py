# textile/models/master/item_definition.py
from django.db import models


class ItemCategoryBase(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=150, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    active = models.BooleanField(default=False, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class ItemCategoryMas1(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas1"


class ItemCategoryMas2(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas2"


class ItemCategoryMas3(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas3"


class ItemCategoryMas4(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas4"


class ItemCategoryMas5(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas5"


class ItemCategoryMas6(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas6"


class ItemCategoryMas7(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas7"


class ItemCategoryMas8(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas8"


class ItemCategoryMas9(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas9"


class ItemCategoryMas10(ItemCategoryBase):
    class Meta:
        app_label = 'textile'
        db_table = "ItemCategoryMas10"

