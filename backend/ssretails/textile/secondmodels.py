from django.db import models

class ItemCategoryMas1(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas1"

    def __str__(self):
        return self.name


class ItemCategoryMas2(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas2"

    def __str__(self):
        return self.name


class ItemCategoryMas3(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas3"

    def __str__(self):
        return self.name


class ItemCategoryMas4(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas4"

    def __str__(self):
        return self.name


class ItemCategoryMas5(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas5"

    def __str__(self):
        return self.name


class ItemCategoryMas6(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas6"

    def __str__(self):
        return self.name


class ItemCategoryMas7(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas7"

    def __str__(self):
        return self.name


class ItemCategoryMas8(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas8"

    def __str__(self):
        return self.name


class ItemCategoryMas9(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas9"

    def __str__(self):
        return self.name


class ItemCategoryMas10(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, unique=True)
    shortname = models.CharField(max_length=25, unique=True)
    active = models.BooleanField(default=False)
    admin_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ItemCategoryMas10"

    def __str__(self):
        return self.name
