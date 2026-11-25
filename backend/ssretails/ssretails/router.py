# ssretails/router.py
"""
Database Router for SSRetails ERP.
Routes all transactional tables (starting with Trans_ or LR/Daily/Denomination)
to the GANESHSSRETAILTRAN ('transaction') database, and all Master tables to 'default'.
"""

class TransactionRouter:
    TRANSACTION_TABLES = {
        "trans_lr_mas", "trans_lr_det", "trans_lrinvoice_det",
        "trans_lraddless_det", "trans_lrinvoiceitem_det", "trans_lrtransfer_mas",
        "trans_lrreceipt_mas", "trans_lrissue_mas", "trans_lrinward_det",
        "trans_purchase_mas", "trans_purchase_det", "trans_purchasereturn_mas",
        "trans_creditdebitnote_mas", "trans_purchasetemplate_mas",
        "trans_sales_mas", "trans_sales_det", "trans_salesreturn_mas",
        "trans_customerorder_mas", "trans_salesinvoice_mas", "trans_salesapproval_mas",
        "trans_settlement_mas", "trans_san_mas", "trans_stn_mas",
        "trans_stockcheck_mas", "trans_jobworkissue_mas", "trans_giftvoucher_mas",
        "trans_loyaltycard_mas", "trans_payment_mas", "trans_advance_mas",
        "dailyexpenses", "denomination", "lrmas", "lrdet", "lrinvoicedet"
    }

    def _is_transaction_model(self, model):
        table = getattr(model._meta, "db_table", "").lower()
        if table.startswith("trans_") or table in self.TRANSACTION_TABLES:
            return True
        return False

    def db_for_read(self, model, **hints):
        if self._is_transaction_model(model):
            return "transaction"
        return "default"

    def db_for_write(self, model, **hints):
        if self._is_transaction_model(model):
            return "transaction"
        return "default"

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return True
