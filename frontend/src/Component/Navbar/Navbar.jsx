// src/Component/Layout/Navbar.jsx
import React, { useState, useMemo } from "react";
import "./Navbar.css";

const MENU = [
  {
    key: "master",
    label: "Master",
    groups: [
      {
        label: "General",
        items: [
          {
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
              "Gift voucher",
              "Payment Mode",
              "Discount Type",
              "Income and Expenses 3",
              "Department",
              "Floor",
              "Transfer Mode",
              "Star",
            ],
          },
        ],
      },
      {
        label: "Intractors",
        items: [
          {
            children: [
              "Supplier",
              "Agent",
              "Manufacture",
              "Customer",
              "Courier",
              "Transport",
            ],
          },
        ],
      },
      {
        label: "Item Definition",
        items: [
          {
            label: "Item Categories ▶",
            children: [
              "Brand",
              "Type",
              "Style",
              "Pattern",
              "Color",
              "Hsn Code",
              "Floor",
              "Section",
              "Section Group",
              "Size Order",
            ],
          },
          { label: "Item", children: [] },
          { label: "UOM", children: [] },
          { label: "Product", children: [] },
          { label: "ROL", children: [] },
          { label: "Commodity Code", children: [] },
        ],
      },
      {
        label: "Location",
        items: [
          {
            children: ["Location"],
          },
        ],
      },
      { label: "Company", items: [] },
      { label: "Purchase Type", items: [] },
      { label: "Document Type", items: [] },
      { label: "Courier Type", items: [] },
      {
        label: "Job Work",
        items: [
          {
            children: [
              "Job Work Charged Header",
              "Tailor Mas",
              "Consumption Master",
            ],
          },
        ],
      },
      {
        label: "Accounts",
        items: [
          {
            children: ["Accounts Group Head", "Naration", "Transaction Head"],
          },
        ],
      },
      {
        label: "Tally",
        items: [
          {
            children: ["Group Head", "Account Head"],
          },
        ],
      },
    ],
  },
  {
    key: "transaction",
    label: "Transaction",
    groups: [],
  },
  {
    key: "reports",
    label: "Reports",
    groups: [],
  },
  {
    key: "mis",
    label: "MIS",
    groups: [],
  },
  {
    key: "setup",
    label: "SetUp",
    groups: [],
  },
  {
    key: "tools",
    label: "Tools",
    groups: [
      {
        label: "Windows",
        items: [
          {
            children: ["Log off", "Close All", "Exit"],
          },
        ],
      },
      {
        label: "Skin: Caramel",
        items: [
          {
            children: [
              "Caramel",
              "Money Twins",
              "Lilian",
              "The Asphalt World",
              "Imaginary",
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
              "Summar 2008",
              "Office 2007",
              "Office 2007 Blue",
              "Office 2007 Black",
              "Office 2007 Silver",
              "Office 2007 Green",
              "Office 2007 Pink",
            ],
          },
        ],
      },
      { label: "User Password Change", items: [] },
      { label: "Exceptions", items: [] },
      { label: "Paymode Change", items: [] },
      { label: "Denomination", items: [] },
      { label: "DB Convertion", items: [] },
      { label: "Hole Code Update", items: [] },
      { label: "item change", items: [] },
      { label: "City Change", items: [] },
      { label: "Port Mapping", items: [] },
      { label: "EXEV Version", items: [] },
      {
        label: "DataBase",
        items: [
          {
            children: ["Structure Check", "Backup Database", "Index Updation"],
          },
        ],
      },
      {
        label: "Offline",
        items: [
          {
            children: ["Offline Creation", "Offline System Master"],
          },
        ],
      },
      { label: "SMS", items: [] },
    ],
  },
];

export default function Navbar({ onNavigate }) {
  const [openTop, setOpenTop] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);
  const [openChild, setOpenChild] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleTopClick = (key) => {
    if (openTop === key) {
      setOpenTop(null);
      setOpenGroup(null);
      setOpenChild(null);
    } else {
      setOpenTop(key);
      setOpenGroup(null);
      setOpenChild(null);
    }
  };

  const closeAll = () => {
    setOpenTop(null);
    setOpenGroup(null);
    setOpenChild(null);
  };

  const handleLeafClick = (label) => {
    if (onNavigate) onNavigate(label);
    closeAll();
    setMobileOpen(false);
  };

  const currentTop = useMemo(
    () => MENU.find((m) => m.key === openTop) || null,
    [openTop]
  );

  const filteredGroups = useMemo(() => {
    if (!currentTop) return [];
    const q = search.trim().toLowerCase();
    if (!q) return currentTop.groups;

    return currentTop.groups
      .map((g) => {
        const items = (g.items || []).map((it, idx) => {
          const label = it.label || `View ~>> ${idx + 1}`;
          const labelMatch = label.toLowerCase().includes(q);
          const children = (it.children || []).filter((leaf) =>
            leaf.toLowerCase().includes(q)
          );
          if (!labelMatch && children.length === 0) return null;
          return { ...it, label, children };
        });
        const cleaned = items.filter(Boolean);
        if (g.label.toLowerCase().includes(q) || cleaned.length > 0) {
          return { ...g, items: cleaned };
        }
        return null;
      })
      .filter(Boolean);
  }, [currentTop, search]);

  return (
    <div className="nav-root">
      {/* top strip */}
      <div className="nav-strip">
        <div className="nav-left">
          <button
            className={mobileOpen ? "nav-burger nav-burger-open" : "nav-burger"}
            onClick={() => setMobileOpen((p) => !p)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="nav-top-list">
            {MENU.map((m) => (
              <button
                key={m.key}
                className={
                  openTop === m.key
                    ? "nav-top-item nav-top-item-active"
                    : "nav-top-item"
                }
                onClick={() => handleTopClick(m.key)}
              >
                <span>{m.label}</span>
                {openTop === m.key && (
                  <span className="nav-close-badge">×</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-right">
          <input
            type="text"
            className="nav-search"
            placeholder="Search menu…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {openTop && (
            <button className="nav-close-all" onClick={closeAll}>
              Close All ×
            </button>
          )}
        </div>
      </div>

      {/* desktop mega panel */}
      {openTop && (
        <div className="nav-panel nav-panel-desktop">
          {filteredGroups.map((g) => {
            const isGroupOpen = openGroup === g.label;
            return (
              <div
                key={g.label}
                className={isGroupOpen ? "nav-col nav-col-active" : "nav-col"}
                onClick={() =>
                  setOpenGroup((prev) => (prev === g.label ? null : g.label))
                }
              >
                <div className="nav-col-title">
                  {g.label}
                  {isGroupOpen && <span className="nav-col-x">×</span>}
                </div>

                {isGroupOpen && g.items?.length > 0 && (
                  <div className="nav-subcol-wrap">
                    {g.items.map((it, idx) => {
                      const label = it.label || `View ~>> ${idx + 1}`;
                      const isChildOpen = openChild === label;
                      return (
                        <div
                          key={label}
                          className={
                            isChildOpen
                              ? "nav-subcol nav-subcol-active"
                              : "nav-subcol"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenChild((prev) =>
                              prev === label ? null : label
                            );
                          }}
                        >
                          <div className="nav-subcol-title">
                            {label}
                            {isChildOpen && (
                              <span className="nav-subcol-x">×</span>
                            )}
                          </div>

                          {isChildOpen && (
                            <ul className="nav-leaf-list">
                              {it.children.map((leaf) => (
                                <li
                                  key={leaf}
                                  className="nav-leaf-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLeafClick(leaf);
                                  }}
                                >
                                  {leaf}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="nav-panel nav-panel-mobile">
          {MENU.map((top) => (
            <div key={top.key} className="nav-mobile-section">
              <button
                className={
                  openTop === top.key
                    ? "nav-mobile-top nav-mobile-top-active"
                    : "nav-mobile-top"
                }
                onClick={() => handleTopClick(top.key)}
              >
                {top.label}
                {openTop === top.key ? " ×" : " ›"}
              </button>

              {openTop === top.key &&
                (top.key === openTop ? filteredGroups : top.groups).map((g) => {
                  const isGroupOpen = openGroup === g.label;
                  return (
                    <div key={g.label} className="nav-mobile-group">
                      <button
                        className={
                          isGroupOpen
                            ? "nav-mobile-group-title nav-mobile-group-title-active"
                            : "nav-mobile-group-title"
                        }
                        onClick={() =>
                          setOpenGroup((prev) =>
                            prev === g.label ? null : g.label
                          )
                        }
                      >
                        {g.label}
                        {isGroupOpen ? " ×" : " ›"}
                      </button>

                      {isGroupOpen &&
                        (g.items || []).map((it, idx) => {
                          const label = it.label || `View ~>> ${idx + 1}`;
                          const isChildOpen = openChild === label;
                          return (
                            <div key={label} className="nav-mobile-child">
                              <button
                                className={
                                  isChildOpen
                                    ? "nav-mobile-child-title nav-mobile-child-title-active"
                                    : "nav-mobile-child-title"
                                }
                                onClick={() =>
                                  setOpenChild((prev) =>
                                    prev === label ? null : label
                                  )
                                }
                              >
                                {label}
                                {isChildOpen ? " ×" : " ›"}
                              </button>

                              {isChildOpen && (
                                <ul className="nav-mobile-leaf-list">
                                  {(it.children || []).map((leaf) => (
                                    <li
                                      key={leaf}
                                      className="nav-mobile-leaf-item"
                                      onClick={() => handleLeafClick(leaf)}
                                    >
                                      {leaf}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
