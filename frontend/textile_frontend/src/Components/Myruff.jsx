import React, { useState, useMemo } from "react";
import "./Navbar2.css";
import Navbar1 from "./Navbar1";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar2({ admin_id }) {
  const [activePanel, setActivePanel] = useState(null); // main menu index
  const [activeChildPanel, setActiveChildPanel] = useState(null); // child index for nested children
  const [searchTerm, setSearchTerm] = useState("");

  const handleNavigation = (label) => {
    // Normalize label text: remove extra HTML entities and spaces
    let routeLabel =
      typeof label === "string" ? label : label.props?.children || label;
    routeLabel = routeLabel
      .toString()
      .replace(/[\s&]+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
    navigate(`/${admin_id}/${routeLabel}`);
  };

  const menuData = useMemo(
    () => [
      {
        label: "Master",
        children: [
          {
            label: <>General &emsp;&emsp;&emsp;&emsp;&emsp; &#x25B6;</>,
            children: [
              "Country",
              "State",
              "City",
              "Title",
              "Grade",
              "Group",
              "Category",
              "Relation",
              "Religion",
              "Occupation",
              "Bank",
              "Employee",
              "Tax Type",
              "System",
              "Counter",
              "System Counter Integration 2",
              "Counter Group 1",
              "Gift Voucher",
              "Payment Mode",
              "Discount Type",
              "Income and Expenses 3",
              "Department",
              "Floor",
              "Transfer Mode",
              "Star",
            ],
          },
          {
            label: <>Intractors &emsp;&emsp;&emsp;&emsp; &#x25B6;</>,
            children: [
              "Supplier",
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
                  "Floor",
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
          { label: "Location" },
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

  // Search functionality
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

  return (
    <>
      <Navbar1 />
      <div className="menu-bar">
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
        </div>
        // Main Menu Panel
        {filteredMenuData.map((menu, idx) => (
          <div
            key={idx}
            className={`panel-label${activePanel === idx ? " active" : ""}`}
            onMouseEnter={() => setActivePanel(idx)}
            onMouseLeave={() => setActivePanel(null)}
            onClick={() => !menu.children && handleNavigation(menu.label)}
            style={{ cursor: menu.children ? "pointer" : "pointer" }}
          >
            {typeof menu === "string" ? menu : menu.label}

            {/* Sub Panel */}
            {activePanel === idx && menu.children && (
              <div
                className="panel-menu-card"
                onMouseEnter={() => setActivePanel(idx)}
                onMouseLeave={() => setActivePanel(null)}
              >
                {menu.children.map((child, childIdx) => (
                  <div
                    key={childIdx}
                    className={`panel-child-label${
                      activeChildPanel === childIdx ? " selected" : ""
                    }`}
                    onMouseEnter={() => setActiveChildPanel(childIdx)}
                    onMouseLeave={() => setActiveChildPanel(null)}
                    onClick={() =>
                      typeof child === "string" && handleNavigation(child)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {typeof child === "string" ? child : child.label}

                    {/* Nested Sub Panel */}
                    {activeChildPanel === childIdx &&
                      typeof child !== "string" &&
                      child.children && (
                        <div
                          className="panel-child-card"
                          onMouseEnter={() => setActiveChildPanel(childIdx)}
                          onMouseLeave={() => setActiveChildPanel(null)}
                        >
                          {child.children.map((sub, subIdx) => (
                            <div
                              className="panel-child-sub-label"
                              key={subIdx}
                              onClick={() => handleNavigation(sub)}
                              style={{ cursor: "pointer" }}
                            >
                              {typeof sub === "string" ? sub : sub.label}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
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
                path: `/country`,
              },
              { name: "State", label: "State", path: `/state` },
              { name: "City", label: "City", path: `/city` },
              "Title",
              "Grade",
              "Group",
              "Category",
              "Relation",
              "Religion",
              "Occupation",
              "Bank",
              "Employee",
              "Tax Type",
              "System",
              "Counter",
              "System Counter Integration 2",
              "Counter Group 1",
              "Gift Voucher",
              "Payment Mode",
              "Discount Type",
              "Income and Expenses 3",
              "Department",
              "Floor",
              "Transfer Mode",
              "Star",
            ],
          },
          {
            label: <>Intractors &emsp;&emsp;&emsp;&emsp; &#x25B6;</>,
            children: [
              {
                name: "Supplier",
                label: "Supplier",
                path: `/supplier`,
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
                  "Floor",
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
          { label: "Location" },
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
