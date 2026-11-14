// src/Component/Navbar/menuConfig.js
// Central Menu Configuration reflecting the complete SSRetail ERP structure

export const TOP_MENUS = [
  {
    key: "master",
    label: "Master",
    accelerator: "a",
    items: [
      {
        label: "General",
        hasSubmenu: true,
        isLongList: true,
        items: [
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
        label: "Intractors",
        hasSubmenu: true,
        items: [
          "Supplier",
          "Agent",
          "Manufacture",
          "Customer",
          "Courier",
          "Transport",
        ],
      },
      {
        label: "Item Definition",
        hasSubmenu: true,
        items: [
          {
            label: "Item Categories",
            hasSubmenu: true,
            items: [
              "Brand",
              "Type",
              "Style",
              "Pattern",
              "Color",
              "Hsn Code",
              { label: "Floor", target: "Floor Category" },
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
      "Location",
      "Company",
      "Purchase Type",
      "Document Type",
      "Courier Type",
      {
        label: "Job Work",
        hasSubmenu: true,
        items: [
          "Job Work Charged Header",
          "Tailor Mas",
          "Consumption Master",
        ],
      },
      {
        label: "Accounts",
        hasSubmenu: true,
        items: [
          "Accounts Group Head",
          "Naration",
          "Transaction Head",
        ],
      },
      {
        label: "Tally",
        hasSubmenu: true,
        items: [
          "Group Head",
          "Account Head",
        ],
      },
    ],
  },
  {
    key: "transaction",
    label: "Transaction",
    accelerator: "T",
    items: [
      {
        label: "Sales",
        hasSubmenu: true,
        items: ["POS Billing", "Sales Return", "Sales Quotation"],
      },
      {
        label: "Purchase",
        hasSubmenu: true,
        items: ["Purchase Invoice", "Purchase Return", "Purchase Order"],
      },
      {
        label: "Inventory",
        hasSubmenu: true,
        items: ["Stock Adjustment", "Stock Transfer", "Physical Stock Check"],
      },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    accelerator: "R",
    items: [
      {
        label: "Sales Reports",
        hasSubmenu: true,
        items: ["Daily Sales Summary", "Bill-wise Sales", "Salesman Commission"],
      },
      {
        label: "Stock Reports",
        hasSubmenu: true,
        items: ["Stock Ledger", "Reorder Level Status", "Slow Moving Stock"],
      },
      {
        label: "Financial Reports",
        hasSubmenu: true,
        items: ["Day Book", "Tax Summary", "Outstanding Balance"],
      },
    ],
  },
  {
    key: "mis",
    label: "MIS",
    accelerator: "I",
    items: [
      {
        label: "Analytics",
        hasSubmenu: true,
        items: ["Executive Summary", "Category-wise Sales Analysis", "Profit Margins"],
      },
    ],
  },
  {
    key: "setup",
    label: "Setup",
    accelerator: "S",
    items: [
      {
        label: "System Configuration",
        hasSubmenu: true,
        items: ["Company Profile", "Financial Year Setup", "User Rights & Roles", "Barcode Settings"],
      },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    accelerator: "l",
    items: [
      "Log Off",
      "Close Active Screen",
      "Exit Application",
    ],
  },
];
