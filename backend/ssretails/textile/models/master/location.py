# textile/models/master/location.py
from django.db import models


class LocationMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    name = models.CharField(max_length=50, unique=True, db_column='Name')
    shortname = models.CharField(max_length=25, unique=True, db_column='ShortName')
    code = models.CharField(max_length=10, blank=True, null=True, db_column='LocCode')
    company_id = models.IntegerField(null=True, blank=True, db_column='CompanyCode')
    address = models.CharField(max_length=400, blank=True, null=True, db_column='Address')
    city_id = models.IntegerField(null=True, blank=True, db_column='CityCode')
    phoneno = models.CharField(max_length=50, blank=True, null=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, blank=True, null=True, db_column='Mobile')
    fax = models.CharField(max_length=50, blank=True, null=True, db_column='Fax')
    email = models.CharField(max_length=50, blank=True, null=True, db_column='Email')
    website = models.CharField(max_length=50, blank=True, null=True, db_column='WebSite')
    tinno = models.CharField(max_length=50, blank=True, null=True, db_column='TinNo')
    tindate = models.DateTimeField(blank=True, null=True, db_column='TinDate')
    areaid = models.CharField(max_length=50, blank=True, null=True, db_column='AreaCode')
    cstno = models.CharField(max_length=50, blank=True, null=True, db_column='CstNo')
    cstdate = models.DateTimeField(blank=True, null=True, db_column='CstDate')
    active = models.BooleanField(default=True, db_column='Active')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    admin_id = models.IntegerField(null=True, blank=True, db_column='UserID')
    pinid = models.CharField(max_length=50, blank=True, null=True, db_column='Pincode')
    servername = models.CharField(max_length=50, blank=True, null=True, db_column='ServerName')
    serveruid = models.CharField(max_length=25, blank=True, null=True, db_column='ServerUID')
    dbname = models.CharField(max_length=50, blank=True, null=True, db_column='DbName')
    serverpwd = models.CharField(max_length=25, blank=True, null=True, db_column='ServerPwd')
    servermode = models.CharField(max_length=25, blank=True, null=True, db_column='ServerMode')
    protocol = models.CharField(max_length=25, blank=True, null=True, db_column='Protocol')
    mainserver = models.BooleanField(default=False, db_column='MainServer')
    accdbname = models.CharField(max_length=50, blank=True, null=True, db_column='AccDbName')
    ipaddress = models.CharField(max_length=50, blank=True, null=True, db_column='IPAddress')
    uploaddata = models.BooleanField(default=False, db_column='UploadData')

    class Meta:
        app_label = 'textile'
        db_table = 'LocationMas'

    def __str__(self):
        return self.name

