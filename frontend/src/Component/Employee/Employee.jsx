// src/pages/Employee.jsx
import { useEffect, useMemo, useState } from "react";
import Tools from "../Tools";

export default function Employee({ adminId, onExit }) {
  const [locations, setLocations] = useState([]);
  const [floors, setFloors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);

  useEffect(() => {
    async function loadMasters() {
      try {
        setLoadingMasters(true);
        const [locRes, floorRes, depRes, cityRes, stateRes, countryRes] =
          await Promise.all([
            fetch("http://localhost:8000/locations/"),
            fetch("http://localhost:8000/floors/"),
            fetch("http://localhost:8000/departments/"),
            fetch("http://localhost:8000/cities/"),
            fetch("http://localhost:8000/states/"),
            fetch("http://localhost:8000/countries/"),
          ]);

        const [locData, floorData, depData, cityData, stateData, countryData] =
          await Promise.all([
            locRes.json(),
            floorRes.json(),
            depRes.json(),
            cityRes.json(),
            stateRes.json(),
            countryRes.json(),
          ]);

        setLocations(locData);
        setFloors(floorData);
        setDepartments(depData);
        setCities(cityData);
        setStates(stateData);
        setCountries(countryData);
      } catch (e) {
        console.error("Failed to load employee masters", e);
      } finally {
        setLoadingMasters(false);
      }
    }
    loadMasters();
  }, []);

  const columns = useMemo(() => {
    return [
      {
        name: "location_code",
        label: "Location",
        type: "select",
        options: locations.map((l) => ({ value: l.id, label: l.name })),
        disableWhileLoading: loadingMasters,
      },
      {
        name: "department_code",
        label: "Department",
        type: "select",
        options: departments.map((d) => ({ value: d.id, label: d.name })),
        disableWhileLoading: loadingMasters,
      },
      {
        name: "floor_code",
        label: "Floor",
        type: "select",
        options: floors.map((f) => ({ value: f.id, label: f.name })),
        disableWhileLoading: loadingMasters,
      },

      { name: "title_code", label: "Title Code", type: "number", step: "1" },
      { name: "name", label: "Name", required: true, maxLength: 50 },
      { name: "short_name", label: "Short Name", maxLength: 25 },
      { name: "address", label: "Address", maxLength: 400 },

      // City dropdown; when changed, Tools.jsx should auto-fill state/country
      {
        name: "city_code",
        label: "City",
        type: "select",
        options: cities.map((c) => ({
          value: c.id,
          label: c.name,
          state_id: c.state_id,
        })),
        disableWhileLoading: loadingMasters,
      },

      { name: "pincode", label: "Pincode", maxLength: 50 },

      // Dates
      { name: "dob", label: "DOB", type: "date" },
      { name: "doj", label: "DOJ", type: "date" },
      { name: "dol", label: "DOL", type: "date" },

      // Contacts
      { name: "phoneno", label: "Phone", maxLength: 50 },
      { name: "mobile", label: "Mobile", maxLength: 50 },
      { name: "fax", label: "Fax", maxLength: 50 },
      { name: "email", label: "Email", maxLength: 50 },
      { name: "website", label: "Website", maxLength: 50 },
      { name: "panno", label: "PAN No", maxLength: 50 },

      // Commission / incentive
      {
        name: "commission_allowed",
        label: "Commission Allowed",
        type: "boolean",
      },
      {
        name: "commission_percent",
        label: "Commission %",
        type: "number",
        step: "0.00001",
      },

      {
        name: "salesman_incentive",
        label: "Salesman Incentive",
        type: "boolean",
      },
      {
        name: "incentive_qty_based",
        label: "Incentive Qty Based",
        type: "boolean",
      },
      {
        name: "incentive_percentage",
        label: "Incentive %",
        type: "number",
        step: "0.00001",
      },
      {
        name: "incentive_amount",
        label: "Incentive Amount",
        type: "number",
        step: "0.00001",
      },

      // Login / rights
      { name: "login_user", label: "Login User", type: "boolean" },
      {
        name: "user_group_code",
        label: "User Group Code",
        type: "number",
        step: "1",
      },
      { name: "password", label: "Password", maxLength: 50 },

      {
        name: "editing_no_of_days",
        label: "Editing Days",
        type: "number",
        step: "1",
      },
      { name: "profit_from_cost", label: "Profit From Cost", type: "boolean" },

      {
        name: "access_time_from",
        label: "Access From",
        type: "date",
      },
      { name: "access_time_to", label: "Access To", type: "date" },

      { name: "system_restrict", label: "System Restrict", type: "boolean" },
      {
        name: "sales_less_cost_in_pur",
        label: "Sales < Cost in Purchase",
        type: "boolean",
      },
      {
        name: "sales_less_cost_in_sales",
        label: "Sales < Cost in Sales",
        type: "boolean",
      },
      { name: "old_bill_cancel", label: "Old Bill Cancel", type: "boolean" },

      { name: "default_page", label: "Default Page", maxLength: 50 },
      { name: "desc_edit", label: "Description Edit", type: "boolean" },
      {
        name: "change_emp_rights",
        label: "Change Emp Rights",
        type: "boolean",
      },

      {
        name: "allow_sales_discount",
        label: "Allow Sales Discount",
        type: "boolean",
      },
      { name: "active", label: "Active", type: "boolean" },
      { name: "skin_name", label: "Skin Name", maxLength: 25 },

      {
        name: "allow_change_location",
        label: "Allow Change Location",
        type: "boolean",
      },
      {
        name: "allow_view_actual_sales",
        label: "Allow View Actual Sales",
        type: "boolean",
      },
      { name: "allow_lock_date", label: "Allow Lock Date", type: "boolean" },
      {
        name: "stock_verification",
        label: "Stock Verification",
        type: "boolean",
      },
      {
        name: "report_column_change",
        label: "Report Column Change",
        type: "boolean",
      },

      {
        name: "day_based_incentive",
        label: "Day Based Incentive",
        type: "boolean",
      },
      {
        name: "day_based_incentive_amount",
        label: "Day Based Incentive Amount",
        type: "number",
        step: "0.00001",
      },

      { name: "allow_all_user", label: "Allow All User", type: "boolean" },
      { name: "print_name", label: "Print Name", maxLength: 50 },

      {
        name: "max_advance",
        label: "Max Advance",
        type: "number",
        step: "0.00001",
      },

      { name: "allow_view_cost", label: "Allow View Cost", type: "boolean" },
      { name: "is_admin", label: "Is Admin", type: "boolean" },
      { name: "approved", label: "Approved", type: "boolean" },

      {
        name: "allow_multi_systems",
        label: "Allow Multi Systems",
        type: "boolean",
      },
      {
        name: "no_of_systems",
        label: "No Of Systems",
        type: "number",
        step: "1",
      },

      {
        name: "display_company_form",
        label: "Display Company Form",
        type: "boolean",
      },
      {
        name: "target_amount",
        label: "Target Amount",
        type: "number",
        step: "0.00001",
      },
    ];
  }, [locations, floors, departments, cities, loadingMasters]);

  const extraPayload = {
    admin_id: adminId,
  };

  return (
    <Tools
      title="Employee Master"
      columns={columns}
      apiBase="http://localhost:8000/employees/"
      extraPayload={extraPayload}
      onExit={onExit}
      // custom hook to auto-fill state/country when city changes
      cityStateCountryMeta={{ cities, states, countries }}
    />
  );
}
