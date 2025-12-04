import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar1";
import { Search, X } from "lucide-react";
import "./Navbar2.css";

export default function Navbar2({ admin_id }) {
  const [activePath, setActivePath] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openOnClickPanels, setOpenOnClickPanels] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const hideTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (Object.values(openOnClickPanels).some(Boolean)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [openOnClickPanels]);

  const extractString = (label) => {
    if (typeof label === "string") return label;
    if (typeof label === "object") {
      if (label.props && label.props.children) {
        return Array.isArray(label.props.children)
          ? label.props.children.map(extractString).join("")
          : extractString(label.props.children);
      }
      if (label.label) return extractString(label.label);
    }
    return "";
  };

  // Navigation + close all
  const handleNavigation = (label) => {
    let routeLabel = extractString(label)
      .replace(/[\s&]+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
    navigate(`/${admin_id}/${routeLabel}`);
    setActivePath([]);
    setOpenOnClickPanels({});
  };

  const scheduleHideMenus = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setActivePath([]);
    }, 300);
  };

  const cancelHideMenus = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const togglePanelClick = (pathStr) => {
    setOpenOnClickPanels((prev) => ({
      ...prev,
      [pathStr]: !prev[pathStr],
    }));
  };

  // For highlighting route
  const isCurrentRoute = (label) => {
    const pathSegment = extractString(label)
      .replace(/[\s&]+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
    return location.pathname.toLowerCase().includes(pathSegment);
  };

  // Breadcrumb from activePath
  const generateBreadcrumb = () => {
    let breadcrumb = [];
    if (!activePath.length) return "";
    let items = filteredMenuData;
    for (let idx of activePath) {
      if (items[idx]) {
        breadcrumb.push(extractString(items[idx].label || items[idx]));
        items = items[idx].children || [];
      }
    }
    return breadcrumb.join(" > ");
  };

  // Icons for menu
  const iconsMap = {
    Master: "🗂️",
    Transaction: "🔄",
    Report: "📊",
    MIS: "📈",
    Setup: "⚙️",
    Tools: "🧰",
    Purchase: "🛒",
    Sales: "💰",
    Accounts: "🏦",
  };

  // Recursive menu rendering
  const renderMenuItems = (items, level = 0, path = []) => {
    return items.map((item, idx) => {
      const hasChildren =
        typeof item === "object" && item.children && item.children.length > 0;
      const currentPath = [...path, idx];
      const pathStr = currentPath.join("-");
      const isActive = activePath[level] === idx;
      const isOpenClick = openOnClickPanels[pathStr];
      const isOpen = isActive || isOpenClick;

      return (
        <div
          key={idx}
          className={`menu-item menu-item-level-${level}${
            isActive ? " active" : ""
          }${isCurrentRoute(item.label || item) ? " current-route" : ""}`}
          onMouseEnter={() => {
            cancelHideMenus();
            setActivePath(currentPath);
          }}
          onMouseLeave={scheduleHideMenus}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) togglePanelClick(pathStr);
            else handleNavigation(item.label || item);
          }}
          tabIndex={0}
          role="menuitem"
          aria-haspopup={hasChildren}
          aria-expanded={isOpen}
          aria-controls={hasChildren ? `submenu-${pathStr}` : undefined}
        >
          <span className="menu-icon" aria-hidden="true">
            {iconsMap[extractString(item.label || item)]}
          </span>
          {/* Render label */}
          {typeof item === "string" ? item : item.label}
          {/* X Icon for top-level */}
          {level === 0 && isOpen && (
            <span
              className="menu-close-icon"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                setActivePath([]);
                setOpenOnClickPanels({});
              }}
              style={{
                float: "right",
                cursor: "pointer",
                marginLeft: "12px",
                fontSize: "1.26rem",
                color: "#e55050",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <X size={18} />
            </span>
          )}
          {/* Children: recursively render submenu */}
          {hasChildren && isOpen && (
            <div
              id={`submenu-${pathStr}`}
              className={`submenu-card submenu-card-level-${level + 1}`}
            >
              {renderMenuItems(item.children, level + 1, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  // Menu Data (use your full menu structure)
  const menuData = useMemo(
    () => [
      {
        label: "Master",
        children: [
          {
            label: <>General &emsp;&emsp;&emsp;&emsp;&emsp; &#x25B6;</>,
            children: [
              {
                name: "Country",
                label: "Country",
                path: `/${admin_id}/country`,
              },
              { name: "State", label: "State", path: `/${admin_id}/state` },
              { name: "City", label: "City", path: `${admin_id}/city` },
              { name: "Title", label: "Title", path: `/${admin_id}/title` },
              { name: "Grade", label: "Grade", path: `/${admin_id}/grade` },
              { name: "Group", label: "Group", path: `/${admin_id}/group` },
              {
                name: "Category",
                label: "Category",
                path: `/${admin_id}/category`,
              },
              {
                name: "Relation",
                label: "Relation",
                path: `/${admin_id}/relation`,
              },
              {
                name: "Religion",
                label: "Religion",
                path: `/${admin_id}/religion`,
              },
              {
                name: "Occupation",
                label: "Occupation",
                path: `/${admin_id}/occupation`,
              },
              { name: "Bank", label: "Bank", path: `/${admin_id}/bank` },
              {
                name: "Employee",
                label: "Employee",
                path: `/${admin_id}/employee`,
              },
              {
                name: "Tax Type",
                label: "Tax Type",
                path: `/${admin_id}/tax-type`,
              },
              {
                name: "System",
                label: "System",
                path: `/${admin_id}/system`,
              },
              {
                name: "Counter",
                label: "Counter",
                path: `/${admin_id}/counter`,
              },
              {
                name: "System Counter Integration 2",
                label: "System Counter Integration 2",
                path: `/${admin_id}/system-counter-integration-2`,
              },
              {
                name: "Counter Group 1",
                label: "Counter Group 1",
                path: `/${admin_id}/counter-group-1`,
              },
              {
                name: "Gift Voucher",
                label: "Gift Voucher",
                path: `/${admin_id}/gift-voucher`,
              },
              {
                name: "Payment Mode",
                label: "Payment Mode",
                path: `/${admin_id}/payment-mode`,
              },
              {
                name: "Discount Type",
                label: "Discount Type",
                path: `/${admin_id}/discount-type`,
              },
              {
                name: "Income and Expenses 3",
                label: "Income and Expenses 3",
                path: `/${admin_id}/income-and-expenses-3`,
              },
              {
                name: "Department",
                label: "Department",
                path: `/${admin_id}/department`,
              },
              {
                name: "Floor",
                label: "Floor",
                path: `/${admin_id}/floor`,
              },
              {
                name: "Transfer Mode",
                label: "Transfer Mode",
                path: `/${admin_id}/transfer-mode`,
              },
              "Star",
            ],
          },
          {
            label: <>Intractors &emsp;&emsp;&emsp;&emsp; &#x25B6;</>,
            children: [
              {
                name: "Supplier",
                label: "Supplier",
                path: `/:${admin_id}/supplier`,
              },
              "Agent",
              "Manufacture",
              "Customer",
              "Courier",
              "Transport",
            ],
          },
          {
            label: <>Item Definition &emsp;&nbsp;&nbsp; &#x25B6;</>,
            children: [
              {
                label: <>Item Categories &emsp;&nbsp; &#x25B6;</>,
                children: [
                  "Brand",
                  "Type",
                  "Style",
                  "Pattern",
                  "Color",
                  "HSN Code",
                  {
                    name: "Floor",
                    label: "Floor",
                    path: `/${admin_id}/floor`,
                  },
                  "Section",
                  "Section Group",
                  "Size Order",
                ],
              },
              "Item",
              "UOM",
              "Product",
              "ROL",
              "Commodity Code",
            ],
          },
          {
            name: "Location",
            label: "Location",
            path: `/${admin_id}/location`,
          },
          { label: "Company" },
          { label: "Purchase Type" },
          { label: "Document Type" },
          { label: "Courier Type" },
          {
            label: <>Job Work &emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; &#x25B6;</>,
            children: [
              "Job Work Charged Head",
              "Tailor Mas",
              "Consumption Master",
            ],
          },
          {
            label: <>Accounts &emsp;&emsp;&emsp;&emsp;&nbsp; &#x25B6;</>,
            children: ["Accounts Group Head", "Naration", "Transaction Head"],
          },
          {
            label: (
              <>Tally &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; &#x25B6;</>
            ),
            children: ["Group Head", "Account Head"],
          },
        ],
      },
      {
        label: <>Transaction</>,
        children: [
          {
            label: <>Purchase Order&emsp;&emsp;&#x25B6;</>,
            children: ["Price List", "Purchase Order", "Purchase Order Cancel"],
          },
          {
            label: (
              <>
                LR&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;&#x25B6;
              </>
            ),
            children: [
              "LR Entry",
              "LR Issue",
              "LR Receipt",
              "LR Transfer",
              "LR Export",
              "LR Inward",
              "LR Account Post",
            ],
          },
          {
            label: <>Purchase&emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: [
              "Purchase Entry",
              "Purchase Return",
              "Credit/Debit/Rate Difference",
              "Purchase Template",
              "Festival Offer",
              "Bit Conversion",
              "Purchase Updation",
              "Purchase Inward",
              "PurchaseReturn Dc",
            ],
          },
          {
            label: <>Sales&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Sales",
              "Sales Return",
              "Sales Cancel",
              "Sales Return Cancel",
              "Sales Discount Less",
              "Customer Order",
              "Sales Return Verification",
              {
                label: <>Invoice&emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
                children: [
                  "Sales Invoice",
                  "Sales Invoice Edit",
                  "Sales Invoice Manual Edit",
                  "Sales Invoice Return",
                  "Sales Invoice Cancel",
                  "Sales Invoice Return Cancel",
                ],
              },
              {
                label: <>Approval&emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
                children: [
                  "Sales Approval",
                  "Sales Approval Return",
                  "Sales Approval Cancel",
                  "Sales Approval Return Cancel",
                ],
              },
              "Sales Check",
              "Sales Edit",
              "Barcode Match",
            ],
          },
          {
            label: <>Settlement&emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: [
              "Settlement",
              "Balance Settlement",
              "Settlement Cancel",
              "Manual Voucher Cancel",
              "Bulk Settlement",
            ],
          },
          {
            label: <>Others&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: [
              "Day Book",
              "Courier Outward",
              "Courier Inward",
              "Advance Entry",
              "Cash Drawer Denomination",
              "Courier Verification",
              "Sales Man Edit",
              "Template Clear Off",
            ],
          },
          {
            label: <>Stock&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: [
              "Stock Adjustment Note",
              "Stock Transfer",
              "Manual Stock Transfer",
              "Export",
              "Stock Inward",
              "Stock Inward Verification",
              {
                label: <>Options&emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
                children: [
                  "Stock Check Clear",
                  "Stock Check",
                  "Year Stock Check",
                  "Stock Item Change",
                  "Stock Merge",
                  "Apply Discount",
                ],
              },
              "Branch Export",
            ],
          },
          {
            label: <>Job Work &emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: ["Job Work Issue"],
          },
          {
            label: <>Gift Voucher &emsp;&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Gift Voucher Entry",
              "Gift Voucher Issue",
              "Gift Voucher Issue Cancel",
            ],
          },
          {
            label: <>Loyality Card &emsp;&emsp;&#x25B6;</>,
            children: [
              "Loyality Card Entry",
              "Loyality Slab Entry",
              "Loyality Redumtion",
              "Loyality Block",
              "ManualEnter Cancel",
            ],
          },
          {
            label: <>Accounts &emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: [
              {
                label: <>Cash</>,
                children: ["Payment", "Receipt"],
              },
              {
                label: <>Bank</>,
                children: ["Payment", "Receipt"],
              },
              "Journal",
              "Other Credit Bill",
              {
                label: <>Payment</>,
                children: ["Supplier Payment"],
              },
              "Receipt",
              {
                label: <>C-Form</>,
                children: ["C-Form Entry"],
              },
            ],
          },
          {
            label: <>Payemnt &emsp;&emsp;&emsp;&emsp;&nbsp;&#x25B6;</>,
            children: ["Payment Entry"],
          },
        ],
      },
      {
        label: <>Report&emsp;&nbsp;&#x25B6;</>,
        children: [
          {
            label: <>Sales&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Bill Copy",
              {
                label: <>Statements&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Multi-View",
                  "Consolidate Counter Bill",
                  "Consolidate System Bill",
                  "Sales MULTI-Column",
                  "Total Sales",
                  "Date-Wise Sales Register",
                  "Section-Wise Sales",
                  "Daily Sales",
                  "Counter-Section Sales",
                  "Day-Wise Profit",
                  "Floor-Wise Sales",
                  "Combined Sales Report",
                  "Status Statement",
                  "Employee Target Report",
                  "Profit/Loss Report",
                  "Monthwise Sales",
                  "Bill Reference",
                ],
              },
              {
                label: <>Tax Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "E-Sales",
                  "Taxwise",
                  "Counter-Wise Tax Sales",
                  "Product Wise Sales Tax Report",
                  "Month Wise Sales Tax Report",
                  "GST Tax Report",
                  "GST R1 Report",
                  "eINVOICE BILL",
                ],
              },
              {
                label: <>Commission Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Employee Commission",
                  "Fixed Commission Report",
                  "Sectionwise Commission Report",
                  "New Commission Report",
                  "Employee Commission Preparation",
                ],
              },
              {
                label: <>Discount Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Sales Discount",
                  "Final Discount",
                  "Discount Verification Report",
                ],
              },
              {
                label: <>Invoice&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Sales Invoice",
                  "Sales Invoice Return",
                  "Sales Invoice Tax Report",
                  "Sales Invoice Return Tax Report",
                  "Sales Invoice Statement",
                  "Sales Manufature Invoice",
                ],
              },
              {
                label: <>Approval&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Sales Approval",
                  "Sales Approval Return",
                  "Sales Approval Statement",
                ],
              },
              {
                label: <>Loyalty Report&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Loyality Discount Report",
                  "Manual / Redemption Report",
                  "Daily Loyality Report",
                ],
              },
            ],
          },
          {
            label: <>Purchase&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Purchase",
              "Purchase Return",
              "Purchase/Purchase Return Taxwise",
              "Credit/Debit/RateDiff",
              "Credit/Debit/RateDiff Summary",
              "Purchase Summary",
              "Purchase Analysis Document",
              "Purchase Statement",
              "Bill Pass System",
              "Purchase Due Date Summary",
            ],
          },
          {
            label: <>Purchase Order&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Purchase Order Document/Summary",
              "Purchases Order Pending Report",
            ],
          },
          {
            label: <>Purchase Inward&emsp;&nbsp;&#x25B6;</>,
            children: ["Purchase Inward DocSummary"],
          },
          {
            label: <>Stock Adjustment&emsp;&nbsp;&#x25B6;</>,
            children: ["Stock Adjustment Document/Summary"],
          },
          {
            label: <>Job Work Reports&emsp;&nbsp;&#x25B6;</>,
            children: ["Job Work Issue Report"],
          },
          {
            label: <>Other Reports&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Cash Balance",
              "Courier Report",
              "Cash Counter Summary Report",
              "Daily Expenses Report",
              "Product ROL Report",
            ],
          },
          {
            label: <>Sales Return&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Return Bill Copy",
              "Bill-Wise",
              "Register",
              "Sales Return Verification Report",
            ],
          },
          {
            label: <>Stock Reports&emsp;&nbsp;&#x25B6;</>,
            children: ["Item History", "Stock As On", "TurnOverReport"],
          },
          {
            label: <>Sticker Printing&emsp;&nbsp;&#x25B6;</>,
            children: ["Sticker Printing", "Employee Printing"],
          },
          {
            label: <>Cashier Reports&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Settlement Document/Summary",
              "Un-Settled Sales Bill",
              "Cashier Wise",
              "Settlement Bill Copy",
              "Settlement Sales Report",
              "Manual Voucher Copy",
              "Manual Voucher Document/Summary",
              "Sales Vs Settlement",
              "Balance Settlement Report",
              "Settlement Abstraction Report",
            ],
          },
          {
            label: <>LR Reports&emsp;&nbsp;&#x25B6;</>,
            children: [
              "LR Entry Report",
              "LR Issue Report",
              "LR Receipt Report",
              "LR Pending Issue Report",
              "Purchase-LR Comparision",
            ],
          },
          {
            label: <>STN Reports &emsp;&nbsp;&#x25B6;</>,
            children: [
              "Stock Transfer Report",
              "STN Document Report",
              "Stock Inward Verification",
              "Manual Stock Transfer Report",
            ],
          },
          {
            label: <>Festival Reports&emsp;&nbsp;&#x25B6;</>,
            children: [
              "Festival Summary",
              "FestProfitLossRpt",
              "FestivalStockReport",
            ],
          },
          {
            label: <>Stock Check Reports&emsp;&nbsp;&#x25B6;</>,
            children: ["Year Stock Report", "Stock Check Reports"],
          },
          {
            label: <>Master&emsp;&nbsp;&#x25B6;</>,
            children: ["Customer / Supplier"],
          },
          {
            label: <>Accounts&emsp;&nbsp;&#x25B6;</>,
            children: [
              {
                label: <>Accounts Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Partywise Report",
                  "Trial Balance Report",
                  "Ledger Report",
                  "All Ledger Report",
                  "Final Accounts Report",
                ],
              },
              {
                label: <>Supplier Payment Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Cheque Printing",
                  "General Cheque List Report",
                  "Supplier Payment Slip Print",
                  "Supplier Payment Pending",
                  "Address Print",
                  "Supplier Payment Group List",
                  "Supplier Payment Details",
                  "Cheque Cancel",
                  "Companywise Pending Report",
                ],
              },
              {
                label: <>Daily Reports&emsp;&nbsp;&#x25B6;</>,
                children: ["Day Book", "Cash Book", "Bank Book"],
              },
              {
                label: <>Analysis Reports&emsp;&nbsp;&#x25B6; </>,
                children: [
                  "Daywise Analysis",
                  "Monthwise Analysis",
                  "Yearwise Analysis",
                  "Custome Head Analysis",
                ],
              },
              {
                label: <>Verification Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Purchase Verification Report",
                  "Transaction Head Verification Report",
                ],
              },
              {
                label: <>Master Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Group Transaction Head List",
                  "Agent For Transaction Head",
                ],
              },
              {
                label: <>Combine Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Combine Group Balance Report",
                  "Combine Ledger Report",
                  "Combine Monthwise Report",
                  "Company Consolidate Report",
                  "Combine Trial Balance Report",
                  "Combine Group Ledger Report",
                  "Combine T_P_L_Balance Report",
                ],
              },
              {
                label: <>Other Reports&emsp;&nbsp;&#x25B6;</>,
                children: [
                  "Season Head Report",
                  "C Form Preparation",
                  "C Form Print",
                  "VAT Report",
                ],
              },
            ],
          },
          {
            label: <>Payment Report&emsp;&nbsp;&#x25B6;</>,
            children: ["Payment Pending", "Payment Summary", "Cheque Printing"],
          },
        ],
      },
      {
        label: <>MIS</>,
        children: [
          "Sales Analysis",
          "SectionWise Sales Analysis",
          "Sales Statement",
          "Day Wise Sales Graph",
          "Weekly Sales",
          "Stock Statement",
          "Stock Analysis",
          "Purchase Vs Sales",
          "Sales Vs Purchase",
          "Stock Matrix Report",
          "Sales Matrix Report",
          "Purchase Analysis",
          "Stock Ageing Report",
          "Sales Liquidation Report",
          "Stock Comparison",
          "PurchaseOrder Analysis",
        ],
      },
      {
        label: <>Setup</>,
        children: [
          {
            label: <>General&emsp;&nbsp; &#x25B6;</>,
            children: [
              "Date Change",
              "General",
              "Common Setup",
              "Opening Balance",
              "User Rights",
              "Item Category",
              "Entry Setup",
              "Export Setup",
              "Stock Merge Setup",
              "Master Export Setup",
            ],
          },
          {
            label: <>Purchase &emsp;&nbsp; &#x25B6;</>,
            children: [
              "Purchase",
              "Purchase Entry Number",
              "Purchase Group Entry Number",
              "Cost Encryption",
              "Barcode",
              "Barcode Print",
              "Barcode Print Old",
              "Margin",
            ],
          },
          {
            label: <>Sales &emsp;&nbsp; &#x25B6;</>,
            children: [
              "Sales",
              "Sales Prefix",
              "Sales Return Prefix",
              "Settlement Prefix",
              "Scheme Definition",
              "Sales UnAccountable Prefix",
              "Employee Commision",
              "Counter-Section",
              "Denomination Setup",
              "Location Based Incentive",
              "Product Incentive Setup",
              "Employee Mapping Setup",
              "Bulk Sales",
            ],
          },
          "LR Setup",
          "Master Export",
          "Master Import",
          {
            label: <>Accounts &emsp;&nbsp; &#x25B6;</>,
            children: ["Export To Accounts", "C Form", "Accounts Import"],
          },
          {
            label: <>Payment &emsp;&nbsp; &#x25B6;</>,
            children: ["Payment-Setup"],
          },
          "StockTakingOnly",
        ],
      },
      {
        label: <>Tools</>,
        children: [
          {
            label: <>Windows &emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: ["Logoff", "Close All", "Exit"],
          },
          {
            label: <>Skin: Caramel &emsp;&emsp;&#x25B6;</>,
            children: [
              "Caramel",
              "Money Twins",
              "Lilian",
              "The Asphalt World",
              "iMaginary",
              "Black",
              "Blue",
              "Coffee",
              "Liquid Sky",
              "London Liquid Sky",
              "Glass Oceans",
              "Stardust",
              "Xmas 2008 Blue",
              "Valentine",
              "McSkin",
              "Summer 2008",
              "Office 2007 Blue",
              "Office 2007 Black",
              "Office 2007 Silver",
              "Office 2007 Green",
              "Office 2007 Pink",
            ],
          },
          "User Password Change",
          "Exceptions",
          "Pay Mode Change",
          "Denomination",
          "DB Conversion",
          "Hole Code Update",
          "Item Change",
          "City Merge",
          "Port Mapping",
          "EXEVersion",
          {
            label: <>Database &emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: ["Structure Check", "Backup Database", "Index Updation"],
          },
          {
            label: <>OffLine &emsp;&emsp;&emsp;&emsp;&emsp;&#x25B6;</>,
            children: ["Offline Creation", "Offline System Master"],
          },
          "SMS",
        ],
      },
    ],
    []
  );

  const filterMenu = (menuList, term) => {
    if (!term.trim()) return menuList;
    return menuList
      .map((menu) => {
        if (typeof menu === "string") {
          return menu.toLowerCase().includes(term.toLowerCase()) ? menu : null;
        } else {
          const filteredChildren = menu.children
            ? filterMenu(menu.children, term)
            : [];
          if (
            menu.label?.toString().toLowerCase().includes(term.toLowerCase()) ||
            filteredChildren.length > 0
          ) {
            return { ...menu, children: filteredChildren };
          }
        }
        return null;
      })
      .filter(Boolean);
  };
  const filteredMenuData = filterMenu(menuData, searchTerm);

  // Dark mode toggle
  const toggleDarkMode = () => setDarkMode((d) => !d);

  return (
    <>
      <Navbar1 />
      <div className={`menu-bar${darkMode ? " dark" : ""}`}>
        <div className="menu-header">
          <div className="menu-title-logo">🧵 SSRetails</div>
          <div className="menu-search">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              className="search-box"
              name="search-box"
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search menu"
            />
            {searchTerm && (
              <button
                className="clear-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✖
              </button>
            )}
          </div>
          <button
            className={`darkmode-toggle${darkMode ? " active" : ""}`}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
        <div className="menu-breadcrumb" aria-live="polite" aria-atomic="true">
          {generateBreadcrumb()}
        </div>
        <nav className="menu-panel-row" role="menubar">
          {renderMenuItems(filteredMenuData, 0, [])}
        </nav>
      </div>
    </>
  );
}
