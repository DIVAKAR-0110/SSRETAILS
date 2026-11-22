# textile/models/master/company.py
from django.db import models


class CompanyMas(models.Model):
    id = models.AutoField(primary_key=True, db_column='Code')
    title_id = models.IntegerField(default=0, db_column='TitleCode')
    name = models.CharField(max_length=50, db_column='Name')
    shortname = models.CharField(max_length=25, db_column='ShortName')
    print_name = models.CharField(max_length=50, null=True, blank=True, db_column='PrintName')
    address = models.CharField(max_length=400, null=True, blank=True, db_column='Address')
    print_address = models.CharField(max_length=400, null=True, blank=True, db_column='PrintAddress')
    city_id = models.IntegerField(default=0, db_column='CityCode')
    phoneno = models.CharField(max_length=50, null=True, blank=True, db_column='Phoneno')
    mobile = models.CharField(max_length=50, null=True, blank=True, db_column='Mobile')
    fax = models.CharField(max_length=50, null=True, blank=True, db_column='Fax')
    email = models.CharField(max_length=50, null=True, blank=True, db_column='Email')
    website = models.CharField(max_length=50, null=True, blank=True, db_column='Website')
    tin_no = models.CharField(max_length=50, null=True, blank=True, db_column='TinNo')
    tin_date = models.DateTimeField(null=True, blank=True, db_column='TinDate')
    area_code = models.CharField(max_length=50, null=True, blank=True, db_column='AreaCode')
    cst_no = models.CharField(max_length=50, null=True, blank=True, db_column='CstNo')
    cst_date = models.DateTimeField(null=True, blank=True, db_column='CstDate')
    pan_no = models.CharField(max_length=50, null=True, blank=True, db_column='PanNo')
    tan_no = models.CharField(max_length=50, null=True, blank=True, db_column='TanNo')
    esi_no = models.CharField(max_length=50, null=True, blank=True, db_column='EsiNo')
    pf_no = models.CharField(max_length=50, null=True, blank=True, db_column='PfNo')
    ie_code = models.CharField(max_length=50, null=True, blank=True, db_column='IECode')
    active = models.BooleanField(default=True, db_column='Active')
    admin_id = models.IntegerField(null=True, blank=True, default=0, db_column='UserID')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CreatedDateTime')
    pincode = models.CharField(max_length=50, null=True, blank=True, db_column='Pincode')
    greetings = models.CharField(max_length=500, null=True, blank=True, db_column='Greetings')
    ret_greetings = models.CharField(max_length=500, null=True, blank=True, db_column='RetGreetings')
    set_greetings = models.CharField(max_length=500, null=True, blank=True, db_column='SetGreetings')
    gst_no = models.CharField(max_length=30, null=True, blank=True, db_column='GstNo')

    class Meta:
        app_label = 'textile'
        db_table = 'CompanyMas'

    def __str__(self):
        return self.name
