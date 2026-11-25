# backend/ssretails/textile/models/transaction/LR.py
from django.db import models
from django.utils import timezone


class LREntryTypeMas(models.Model):
    """LR Entry Types (Purchase, Sales, Stock Transfer, etc.) in GANESHSSRETAIL."""
    code = models.IntegerField(primary_key=True, db_column="Code")
    name = models.CharField(max_length=50, db_column="Name")
    shortname = models.CharField(max_length=25, blank=True, null=True, db_column="Shortname")
    active = models.BooleanField(default=True, db_column="Active")
    user_id = models.IntegerField(default=1, db_column="UserID")
    created_at = models.DateTimeField(auto_now_add=True, db_column="CreatedDateTime")

    class Meta:
        managed = False
        db_table = "LREntryTypeMas"
        ordering = ["code"]

    def __str__(self):
        return self.name


class LRChargeModeMas(models.Model):
    """LR Charge Modes (Per Weight, Per Bundle, Fixed, etc.) in GANESHSSRETAIL."""
    code = models.IntegerField(primary_key=True, db_column="Code")
    name = models.CharField(max_length=50, db_column="Name")
    shortname = models.CharField(max_length=25, blank=True, null=True, db_column="Shortname")
    active = models.BooleanField(default=True, db_column="Active")
    user_id = models.IntegerField(default=1, db_column="UserID")
    created_at = models.DateTimeField(auto_now_add=True, db_column="CreatedDateTime")

    class Meta:
        managed = False
        db_table = "LRChargeModeMas"
        ordering = ["code"]

    def __str__(self):
        return self.name


class TransLRMas(models.Model):
    """Header Table for LR Entry in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, primary_key=True, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(default=timezone.now, db_column="EntryDate")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    company_id = models.IntegerField(default=0, db_column="CompanyCode")
    lr_entry_type_id = models.IntegerField(default=0, db_column="LREntryTypeCode")
    agent_id = models.IntegerField(default=0, db_column="AgentCode")
    actual_weight = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="ActualWeight")
    charged_weight = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="ChargedWeight")
    total_bundles = models.DecimalField(max_digits=18, decimal_places=0, default=0, db_column="TotalBundles")
    recvd_bundles = models.DecimalField(max_digits=18, decimal_places=0, default=0, db_column="RecvdBundles")
    total_freight_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="TotalFreightAmount")
    total_lu_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="TotalLUAmount")
    total_other_charge_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="TotalOtherChargeAmount")
    total_invoice_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="TotalInvoiceAmount")
    remarks = models.CharField(max_length=500, blank=True, null=True, db_column="Remarks")
    lr_no = models.CharField(max_length=50, default="", blank=True, db_column="LRNo")
    lr_date = models.DateTimeField(default=timezone.now, db_column="LRDate")
    from_city_id = models.IntegerField(default=0, db_column="FromCityCode")
    to_city_id = models.IntegerField(default=0, db_column="ToCityCode")
    transport_id = models.IntegerField(default=0, db_column="TransportCode")
    lr_issue_no = models.CharField(max_length=50, blank=True, null=True, db_column="LRIssueNo")
    lr_issue_date = models.DateTimeField(blank=True, null=True, db_column="LRIssueDate")
    lr_receipt_no = models.CharField(max_length=50, blank=True, null=True, db_column="LRReceiptNo")
    lr_receipt_date = models.DateTimeField(blank=True, null=True, db_column="LRReceiptDate")
    system_name = models.CharField(max_length=50, blank=True, null=True, db_column="SystemName")
    user_id = models.IntegerField(default=1, db_column="UserID")
    user_entry_datetime = models.DateTimeField(auto_now_add=True, db_column="UserEntryDateTime")
    update_user_id = models.IntegerField(default=0, db_column="UpdateUserID")
    update_user_entry_datetime = models.DateTimeField(blank=True, null=True, db_column="UpdateUserEntryDateTime")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    cancel_user_id = models.IntegerField(default=0, db_column="CancelUserID")
    cancel_user_entry_datetime = models.DateTimeField(blank=True, null=True, db_column="CancelUserEntryDateTime")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")
    to_location_id = models.IntegerField(default=0, db_column="ToLocationCode")
    from_location_id = models.IntegerField(default=0, db_column="FromLocationCode")
    transfered = models.IntegerField(default=0, db_column="Transfered")
    lr_entry_id = models.CharField(max_length=30, blank=True, null=True, db_column="LrEntryId")
    lr_entry_no = models.CharField(max_length=15, blank=True, null=True, db_column="LrEntryNo")
    lr_entry_date = models.DateTimeField(blank=True, null=True, db_column="LrEntryDate")
    opened_bundles = models.DecimalField(max_digits=18, decimal_places=0, default=0, db_column="OpenedBundles")

    class Meta:
        managed = False
        db_table = "Trans_LR_Mas"
        ordering = ["-entry_date", "-entry_no"]

    def __str__(self):
        return f"{self.entry_no} ({self.entry_id})"


class TransLRInvoiceDet(models.Model):
    """Tab 1 (Invoice 1) Detail rows in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(db_column="EntryDate")
    entry_order_id = models.IntegerField(primary_key=True, db_column="EntryOrderID")
    supplier_id = models.IntegerField(db_column="SupplierCode")
    invoice_no = models.CharField(max_length=50, db_column="InvoiceNo")
    invoice_date = models.DateTimeField(db_column="InvoiceDate")
    bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="Bundles")
    amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="Amount")
    supplier_bundle_no = models.CharField(max_length=50, blank=True, null=True, db_column="SupplierBundleNo")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")
    accounts_entry_id = models.CharField(max_length=30, blank=True, null=True, db_column="AccountsEntryID")

    class Meta:
        managed = False
        db_table = "Trans_LRInvoice_Det"
        ordering = ["entry_order_id"]


class TransLRDet(models.Model):
    """Tab 2 (LR 2) Transport Detail rows in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(db_column="EntryDate")
    entry_order_id = models.IntegerField(primary_key=True, db_column="EntryOrderID")
    transport_id = models.IntegerField(default=0, db_column="TransportCode")
    from_city_id = models.IntegerField(default=0, db_column="FromCityCode")
    to_city_id = models.IntegerField(default=0, db_column="ToCityCode")
    transfer_mode_id = models.IntegerField(default=0, db_column="TransferModeCode")
    lr_no = models.CharField(max_length=50, blank=True, null=True, db_column="LRNo")
    lr_date = models.DateTimeField(blank=True, null=True, db_column="LRDate")
    is_paid = models.BooleanField(default=False, db_column="isPaid")
    paid_by = models.CharField(max_length=25, blank=True, null=True, db_column="PaidBy")
    lr_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="LrAmount")
    other_charge_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="OtherChargeAmount")
    freight_charge_mode_id = models.IntegerField(default=0, db_column="FreightChargeModeCode")
    freight_charge_per_mode = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="FreightChargePerMode")
    freight_charge = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="FreightCharge")
    lu_charge_mode_id = models.IntegerField(default=0, db_column="LUChargeModeCode")
    lu_charge_per_mode = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="LUChargePerMode")
    lu_charge = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="LUCharge")
    total = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="Total")
    is_primary = models.BooleanField(default=True, db_column="isPrimary")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")
    actual_weight = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="ActualWeight")
    charged_weight = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="ChargedWeight")
    issue_bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="IssueBundles")
    noof_bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="NoofBundles")
    rcvd_bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="RCVDBundles")
    total_pcs = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="TotalPcs")

    class Meta:
        managed = False
        db_table = "Trans_LR_Det"
        ordering = ["entry_order_id"]


# =========================================================================
# LR Issue Models (GANESHSSRETAILTRAN)
# =========================================================================

class TransLRIssueMas(models.Model):
    """Header Table for LR Issue in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, primary_key=True, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(default=timezone.now, db_column="EntryDate")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    issued_to_id = models.IntegerField(default=0, db_column="IssuedToCode")
    posted_by_id = models.IntegerField(default=0, db_column="PostedByCode")
    remarks = models.CharField(max_length=500, blank=True, null=True, db_column="Remarks")
    system_name = models.CharField(max_length=50, blank=True, null=True, db_column="SystemName")
    user_id = models.IntegerField(default=1, db_column="UserID")
    user_entry_datetime = models.DateTimeField(auto_now_add=True, db_column="UserEntryDateTime")
    update_user_id = models.IntegerField(default=0, db_column="UpdateUserID")
    update_user_entry_datetime = models.DateTimeField(blank=True, null=True, db_column="UpdateUserEntryDateTime")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    cancel_user_id = models.IntegerField(default=0, db_column="CancelUserID")
    cancel_user_entry_datetime = models.DateTimeField(blank=True, null=True, db_column="CancelUserEntryDateTime")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")

    class Meta:
        managed = False
        db_table = "Trans_LRIssue_Mas"
        ordering = ["-entry_date", "-entry_no"]

    def __str__(self):
        return f"Issue {self.entry_no} ({self.entry_id})"


class TransLRIssueDet(models.Model):
    """Detail rows for LR Issue in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(db_column="EntryDate")
    entry_order_id = models.IntegerField(primary_key=True, db_column="EntryOrderID")
    lr_entry_id = models.CharField(max_length=30, db_column="LREntryID")
    bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="Bundles")
    entry_time = models.DateTimeField(default=timezone.now, db_column="EntryTime")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")
    lr_entry_order_id = models.IntegerField(default=0, db_column="LREntryOrderID")
    receipt_bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="ReceiptBundles")
    rcvd_bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="RcvdBundles")

    class Meta:
        managed = False
        db_table = "Trans_LRIssue_Det"
        ordering = ["entry_order_id"]


# =========================================================================
# LR Receipt Models (GANESHSSRETAILTRAN)
# =========================================================================

class TransLRReceiptMas(models.Model):
    """Header Table for LR Receipt in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, primary_key=True, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(default=timezone.now, db_column="EntryDate")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="Bundles")
    charged_weight = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="ChargedWeight")
    tax_type_id = models.IntegerField(default=0, db_column="TaxTypeCode")
    tax_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="TaxAmount")
    wages_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="WagesAmount")
    addless_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="AddlessAmount")
    posted_by_id = models.IntegerField(default=0, db_column="PostedByCode")
    remarks = models.CharField(max_length=500, blank=True, null=True, db_column="Remarks")
    system_name = models.CharField(max_length=50, blank=True, null=True, db_column="SystemName")
    user_id = models.IntegerField(default=1, db_column="UserID")
    user_entry_datetime = models.DateTimeField(auto_now_add=True, db_column="UserEntryDateTime")
    update_user_id = models.IntegerField(default=0, db_column="UpdateUserID")
    update_user_entry_datetime = models.DateTimeField(blank=True, null=True, db_column="UpdateUserEntryDateTime")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    cancel_user_id = models.IntegerField(default=0, db_column="CancelUserID")
    cancel_user_entry_datetime = models.DateTimeField(blank=True, null=True, db_column="CancelUserEntryDateTime")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")
    receipt_no = models.CharField(max_length=50, blank=True, null=True, db_column="ReceiptNo")
    receipt_date = models.DateTimeField(blank=True, null=True, db_column="ReceiptDate")

    class Meta:
        managed = False
        db_table = "Trans_LRReceipt_Mas"
        ordering = ["-entry_date", "-entry_no"]

    def __str__(self):
        return f"Receipt {self.entry_no} ({self.entry_id})"


class TransLRReceiptDet(models.Model):
    """Grid 1 (LR RECEIPT DETAILS) in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(db_column="EntryDate")
    entry_order_id = models.IntegerField(primary_key=True, db_column="EntryOrderID")
    lr_entry_id = models.CharField(max_length=30, db_column="LREntryID")
    bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="Bundles")
    recvd_bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="RecvdBundles")
    receipt_return = models.BooleanField(default=False, db_column="ReceiptReturn")
    is_paid = models.BooleanField(default=False, db_column="isPaid")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")
    lr_entry_order_id = models.IntegerField(default=0, db_column="LREntryOrderID")
    lr_issue_entry_order_id = models.IntegerField(default=0, db_column="LRIssueEntryOrderID")
    lr_issue_entry_id = models.CharField(max_length=30, blank=True, null=True, db_column="LRIssueEntryID")

    class Meta:
        managed = False
        db_table = "Trans_LRReceipt_Det"
        ordering = ["entry_order_id"]


class TransLRReceiptAddLessDet(models.Model):
    """Grid 2 (ADD / LESS DETAILS) in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(db_column="EntryDate")
    mas_entry_order_id = models.IntegerField(default=0, db_column="MasEntryOrderID")
    entry_order_id = models.IntegerField(primary_key=True, db_column="EntryOrderID")
    tax_type_id = models.IntegerField(default=0, db_column="TaxTypeCode")
    add_or_less_type = models.BooleanField(default=False, db_column="AddorLessType")
    tax_percent = models.DecimalField(max_digits=10, decimal_places=5, default=0, db_column="TaxPercent")
    tax_on_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="TaxonAmount")
    amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="Amount")
    round_off = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="RoundOff")
    net_amount = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="NetAmount")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")

    class Meta:
        managed = False
        db_table = "Trans_LRReceiptAddLess_Det"
        ordering = ["entry_order_id"]


# =========================================================================
# LR Transfer / Export Models (GANESHSSRETAILTRAN)
# =========================================================================

class TransLRTransferMas(models.Model):
    """Header Table for LR Transfer / Export in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, primary_key=True, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(default=timezone.now, db_column="EntryDate")
    location_id = models.IntegerField(default=0, db_column="LocationCode")
    from_or_to_location_id = models.IntegerField(default=0, db_column="FromOrToLocationCode")
    company_id = models.IntegerField(default=0, db_column="CompanyCode")
    noof_bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="NoofBundles")
    remarks = models.CharField(max_length=500, blank=True, null=True, db_column="Remarks")
    entry_type = models.CharField(max_length=100, default="DIRECT", db_column="EntryType")
    system_name = models.CharField(max_length=50, blank=True, null=True, db_column="SystemName")
    user_id = models.IntegerField(default=1, db_column="UserID")
    user_entry_datetime = models.DateTimeField(auto_now_add=True, db_column="UserEntryDateTime")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    exported = models.IntegerField(default=0, db_column="Exported")
    uploaded = models.IntegerField(default=0, db_column="Uploaded")

    class Meta:
        managed = False
        db_table = "Trans_LRTransfer_Mas"
        ordering = ["-entry_date", "-entry_no"]

    def __str__(self):
        return f"Transfer {self.entry_no} ({self.entry_id})"


class TransLRTransferDet(models.Model):
    """Detail rows for LR Transfer / Export in GANESHSSRETAILTRAN."""
    entry_id = models.CharField(max_length=30, db_column="EntryID")
    entry_no = models.CharField(max_length=15, db_column="Entryno")
    entry_date = models.DateTimeField(db_column="EntryDate")
    entry_order_id = models.IntegerField(primary_key=True, db_column="EntryOrderID")
    lr_entry_id = models.CharField(max_length=30, db_column="LREntryID")
    bundles = models.DecimalField(max_digits=18, decimal_places=5, default=0, db_column="Bundles")
    cancel = models.BooleanField(default=False, db_column="Cancel")
    location_id = models.IntegerField(default=0, db_column="LocationCode")

    class Meta:
        managed = False
        db_table = "Trans_LRTransfer_Det"
        ordering = ["entry_order_id"]

