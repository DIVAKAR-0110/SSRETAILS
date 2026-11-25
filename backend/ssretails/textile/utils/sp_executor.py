# backend/ssretails/textile/utils/sp_executor.py
"""
Universal Microsoft SQL Server Stored Procedure Executor for SSRetails ERP.
Connects Django REST Framework ViewSets to GANESHSSRETAIL DB Programmability Stored Procedures.
Supports standard 6-Mode pattern:
  MODE 0: INSERT (returns new CODE via @CODE OUTPUT)
  MODE 1: UPDATE (updates WHERE CODE = @CODE)
  MODE 2: DELETE (deletes WHERE CODE = @CODE)
  MODE 3: SELECT ALL
  MODE 4: SELECT BY ID
  MODE 5: LOOKUP / DROPDOWN
"""
import logging
from django.db import connection, connections
from rest_framework import exceptions, status
from rest_framework.response import Response

logger = logging.getLogger(__name__)

# Cache for SP parameters: { ("default", "SPCOUNTRYMAS"): [ ("@NAME", "varchar"), ... ] }
_SP_PARAM_CACHE = {}


def _get_connection(database=None, proc_name=""):
    """Returns the appropriate database connection (default: GANESHSSRETAIL, transaction: GANESHSSRETAILTRAN)."""
    if database:
        return connections[database]
    clean_proc = (proc_name or "").upper()
    if clean_proc.startswith("SPTRANS_") or "LR" in clean_proc and "ENTRY" in clean_proc:
        return connections["transaction"] if "transaction" in connections else connection
    return connection


def get_sp_parameters(proc_name, database=None):
    """
    Introspects and caches stored procedure parameters from INFORMATION_SCHEMA.
    Returns a list of dicts: [{'name': '@NAME', 'data_type': 'varchar', 'mode': 'IN'}, ...]
    """
    clean_name = proc_name.upper().strip().replace("[", "").replace("]", "").replace("DBO.", "")
    conn = _get_connection(database, clean_name)
    db_name = conn.alias
    cache_key = (db_name, clean_name)
    if cache_key in _SP_PARAM_CACHE:
        return _SP_PARAM_CACHE[cache_key]

    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT PARAMETER_NAME, DATA_TYPE, PARAMETER_MODE
            FROM INFORMATION_SCHEMA.PARAMETERS
            WHERE SPECIFIC_NAME = %s
            ORDER BY ORDINAL_POSITION
        """, [clean_name])
        rows = cursor.fetchall()
        params = [
            {
                "name": r[0],
                "clean_name": r[0].lstrip("@").upper(),
                "data_type": r[1].lower(),
                "mode": r[2].upper(),
            }
            for r in rows
        ]
        _SP_PARAM_CACHE[cache_key] = params
        return params


def _normalize_key(key):
    """Normalize dictionary or model field names for matching SP parameter names."""
    return key.replace("_", "").replace("-", "").upper()


def _extract_param_value(data_dict, param_clean_name, param_data_type):
    """
    Finds matching value in data_dict for the given SP parameter name.
    Handles common aliases, e.g.:
      @USERID -> admin_id, user_id, userid
      @SHORTNAME -> short_name, shortname
      @COUNTRYCODE -> country_id, country_code, countrycode
    """
    p_norm = _normalize_key(param_clean_name)

    # 1. Direct match
    for k, v in data_dict.items():
        if _normalize_key(k) == p_norm:
            return v

    # 2. Common ERP aliases
    alias_map = {
        "USERID": ["ADMINID", "USERID", "ADMIN_ID", "USER_ID"],
        "COUNTRYCODE": ["COUNTRYID", "COUNTRYCODE", "COUNTRY_ID"],
        "STATECODE": ["STATEID", "STATECODE", "STATE_ID"],
        "CITYCODE": ["CITYID", "CITYCODE", "CITY_ID"],
        "LOCATIONCODE": ["LOCATIONID", "LOCATIONCODE", "LOCATION_ID"],
        "FLOORCODE": ["FLOORID", "FLOORCODE", "FLOOR_ID"],
        "COUNTERGROUPCODE": ["COUNTERGROUPID", "COUNTERGROUPCODE", "COUNTER_GROUP_ID"],
        "CATEGORYCODE": ["CATEGORYID", "CATEGORYCODE", "CATEGORY_ID"],
        "GROUPCODE": ["GROUPID", "GROUPCODE", "GROUP_ID"],
        "GRADECODE": ["GRADEID", "GRADECODE", "GRADE_ID"],
        "TITLECODE": ["TITLEID", "TITLECODE", "TITLE_ID"],
        "BANKCODE": ["BANKID", "BANKCODE", "BANK_ID"],
        "AGENTCODE": ["AGENTID", "AGENTCODE", "AGENT_ID"],
        "ACCOUNTHEADCODE": ["ACCOUNTHEADID", "ACCOUNTHEADCODE", "ACCOUNT_HEAD_ID"],
        "SYSTEMCODE": ["SYSTEMID", "SYSTEMCODE", "SYSTEM_ID"],
        "COUNTERCODE": ["COUNTERID", "COUNTERCODE", "COUNTER_ID"],
        "UOMCODE": ["UOMID", "UOMCODE", "UOM_ID"],
        "ITEMCODE": ["ITEMID", "ITEMCODE", "ITEM_ID"],
        "SHORTNAME": ["SHORT_NAME", "SHORTNAME"],
        "ACTIVE": ["ACTIVE", "IS_ACTIVE"],
    }

    aliases = alias_map.get(p_norm, [])
    for alias in aliases:
        for k, v in data_dict.items():
            if _normalize_key(k) == alias:
                return v

    return None


def execute_master_sp(proc_name, mode, code=0, data=None, database=None):
    """
    Executes a Master / Transaction Stored Procedure for DML operations.
    Modes:
      0: INSERT (returns new integer Code)
      1: UPDATE (updates record matching Code, returns Code)
      2: DELETE (deletes record matching Code, returns True)

    Raises rest_framework.exceptions.ValidationError if @ERR <> 0 or SQL failure.
    """
    clean_proc = proc_name.upper().strip().replace("[", "").replace("]", "").replace("DBO.", "")
    params_meta = get_sp_parameters(clean_proc, database=database)
    data = data or {}
    conn = _get_connection(database, clean_proc)

    exec_params = []
    param_bindings = []

    # Filter parameters excluding @MODE, @CODE, @ERR
    has_code_param = False
    has_err_param = False

    for p in params_meta:
        p_name = p["name"]
        p_clean = p["clean_name"]

        if p_clean == "MODE":
            continue
        elif p_clean == "CODE":
            has_code_param = True
            continue
        elif p_clean == "ERR":
            has_err_param = True
            continue

        # In DELETE mode (mode=2), only @CODE and @MODE are required, plus @ACTIVE=0 for soft-delete SPs
        if mode == 2:
            if p_clean == "ACTIVE":
                exec_params.append(f"{p_name} = %s")
                param_bindings.append(False)
            continue

        val = _extract_param_value(data, p_clean, p["data_type"])

        # Default handling for nulls / missing fields
        if val is None:
            if "int" in p["data_type"] or "numeric" in p["data_type"] or "decimal" in p["data_type"]:
                val = 0
            elif "bit" in p["data_type"]:
                val = True if p_clean == "ACTIVE" else False
            elif "date" in p["data_type"]:
                val = None
            else:
                val = ""

        exec_params.append(f"{p_name} = %s")
        param_bindings.append(val)

    # Build T-SQL call with output parameters
    initial_code = int(code or 0)
    sql_lines = [
        "SET NOCOUNT ON;",
        f"DECLARE @CODE_OUT INT = {initial_code}, @ERR_OUT INT = 0;",
        f"EXEC [dbo].[{clean_proc}]",
        f"    @MODE = {int(mode)}",
    ]

    for ep in exec_params:
        sql_lines.append(f"    ,{ep}")

    if has_code_param:
        sql_lines.append("    ,@CODE = @CODE_OUT OUTPUT")
    if has_err_param:
        sql_lines.append("    ,@ERR = @ERR_OUT OUTPUT")

    sql_lines.append(";")
    sql_lines.append("SELECT @CODE_OUT AS Code, @ERR_OUT AS Err;")

    full_sql = "\n".join(sql_lines)

    try:
        with conn.cursor() as cursor:
            cursor.execute(full_sql, param_bindings)
            while cursor.description is None:
                if not cursor.nextset():
                    break
            row = cursor.fetchone()
            if not row:
                raise exceptions.ValidationError(f"Stored Procedure {clean_proc} returned no result.")

            new_code, err_code = row[0], row[1]
            if err_code and int(err_code) != 0:
                raise exceptions.ValidationError(
                    f"Stored Procedure {clean_proc} failed with database error code {err_code}."
                )

            if mode == 0:
                return new_code or initial_code
            elif mode == 1:
                return initial_code
            elif mode == 2:
                return True
            return new_code
    except exceptions.ValidationError:
        raise
    except Exception as exc:
        logger.error(f"Error executing stored procedure {clean_proc}: {exc}")
        raise exceptions.ValidationError(f"Failed to execute {clean_proc}: {str(exc)}")


def execute_sp_select(proc_name, mode=3, code=0, database=None):
    """
    Executes a Stored Procedure in SELECT mode (e.g. MODE 3 = All, MODE 4 = By Code, MODE 5 = Lookup).
    Returns a list of dicts.
    """
    clean_proc = proc_name.upper().strip().replace("[", "").replace("]", "").replace("DBO.", "")
    conn = _get_connection(database, clean_proc)

    if int(mode) == 4:
        sql = f"EXEC [dbo].[{clean_proc}] @MODE = 4, @CODE = %s;"
        bindings = [int(code)]
    else:
        sql = f"EXEC [dbo].[{clean_proc}] @MODE = {int(mode)};"
        bindings = []

    with conn.cursor() as cursor:
        cursor.execute(sql, bindings)
        if cursor.description is None:
            return []
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        return [dict(zip(columns, row)) for row in rows]


def execute_custom_sp(proc_name, params=None, database=None):
    """
    Executes an arbitrary stored procedure with named parameters.
    Returns results as list of dicts or True.
    """
    clean_proc = proc_name.upper().strip().replace("[", "").replace("]", "").replace("DBO.", "")
    conn = _get_connection(database, clean_proc)
    params = params or {}

    param_clauses = []
    bindings = []
    for k, v in params.items():
        p_name = k if k.startswith("@") else f"@{k}"
        param_clauses.append(f"{p_name} = %s")
        bindings.append(v)

    sql = f"EXEC [dbo].[{clean_proc}] " + ", ".join(param_clauses)
    with conn.cursor() as cursor:
        cursor.execute(sql, bindings)
        if cursor.description:
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        return True


class StoredProcedureMasterViewSetMixin:
    """
    Mixin for DRF ViewSets to automatically route create, update, and destroy actions
    through the designated Microsoft SQL Server Stored Procedure.
    """
    stored_proc_name = None
    sp_database = None

    def perform_create(self, serializer):
        if not self.stored_proc_name:
            return super().perform_create(serializer)

        new_code = execute_master_sp(
            self.stored_proc_name,
            mode=0,
            data=serializer.validated_data,
            database=self.sp_database
        )
        serializer.instance = self.get_queryset().get(pk=new_code)

    def perform_update(self, serializer):
        if not self.stored_proc_name:
            return super().perform_update(serializer)

        instance = serializer.instance
        execute_master_sp(
            self.stored_proc_name,
            mode=1,
            code=instance.pk,
            data=serializer.validated_data,
            database=self.sp_database
        )
        instance.refresh_from_db()

    def perform_destroy(self, instance):
        if not self.stored_proc_name:
            return super().perform_destroy(instance)

        execute_master_sp(
            self.stored_proc_name,
            mode=2,
            code=instance.pk,
            database=self.sp_database
        )

