import { Flex, Icon, List, ListItem, ListItemIcon, ListTitle, Menu, MenuDivider, MenuItem, Toast } from '@vibe/core'
import { Activity, CreditCard, Email, Files, MoveArrowRightNarrow, NotificationChecked, Settings, Team } from '@vibe/icons'
import React, { useRef, useState } from 'react'
import './MenuBar.css'
import { useLocation, useNavigate } from 'react-router-dom'
const MenuBar = () => {



  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");


  const items = [
    { label: "Email", type: "parent" },
    { label: "Email Center" },
    { label: "Customer Email Template" },
    { label: "Email Marketing" },
  ];

  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    type: "positive",
    message: "",
    actions: []
  });
  const location = useLocation();

  const logoutUser = () => {
    setToast({
      open: true,
      type: "warning",
      message: "Are you sure you want to Sign out?",
      actions: [
        {
          type: "button",
          content: "Sign out",
          onClick: () => {
            localStorage.removeItem("UserToken");
            setToast({ open: false });
            navigate("/signin");
          },
        },

      ],
    });
  };

  return (
    <div className='nav-bar-container'>

      <Flex direction="column" align='start' style={{ padding: "10px" }} gap={15}  >

        <Menu className='listmenu' size='small' >
          <MenuItem title="Customer" icon={Team} className={`list-item-menu ${location.pathname === "/" ? "active" : ""
            }`} onClick={() => navigate("/")} />
          <MenuItem title="Plans & Billing" icon={CreditCard} className={`list-item-menu ${location.pathname === "/plananddetails" ? "active" : ""
            }`} onClick={() => navigate("/plananddetails")} />
          <MenuItem title="Reports & Analytics" icon={Files} className='list-item-menu' />
          {/* <MenuItem title="Email Center" icon={Email}
            className={`list-item-menu ${location.pathname === "/emailcenter" ? "active" : ""
              }`} onClick={() => navigate("/emailcenter")}
          /> */}

        </Menu>
        <div className="menu-wrapper">

          {/* PARENT */}
          <div
           className={`menu-item parent ${location.pathname === "/emailcenter"  ? "active" : ""
            }`}
  // className={`menu-item parent ${open === true ? "active" : ""}`}
  onClick={() => {
     setActive("Email Center");
    setOpen(prev => !prev);
    navigate("/emailcenter");
  }}
>
  <span className="icon">
    <Icon icon={Email} />
  </span>
  <span className="text">Email </span>
</div>

          {/* CHILD ITEMS */}
          {open && (
            <div className="submenu">

              <div
                className={`menu-item child ${active === "Email Center" ? "active" : ""}`}
                onClick={() => {
                  setActive("Email Center");
                  navigate("/emailcenter");
                }}
              >
                <span className="icon">➜</span>
                <span className="text">Email Center</span>
              </div>

              <div
                className={`menu-item child ${active === "Customer Email Template" ? "active" : ""}`}
                onClick={() => {
                  setActive("Customer Email Template");
                  navigate("/customeremailtemplate");
                }}
              >
                <span className="icon">➜</span>
                <span className="text">Customer Email Template</span>
              </div>

              <div
                className={`menu-item child ${active === "Email Marketing" ? "active" : ""}`}
                onClick={() => {
                  setActive("Email Marketing");
                  navigate("/emailmarketing");
                }}
              >
                <span className="icon">➜</span>
                <span className="text">Email Marketing</span>
              </div>

            </div>
          )}

        </div>

        {/* <div style={{ width: 1, height: 245, backgroundColor: "#030000ff" }} /> */}

        <Menu className='listmenu' size='small'>
          <MenuItem title="SignOut" icon={Email}
            className={`list-item-menu ${location.pathname === "/signin" ? "active" : ""
              }`} onClick={logoutUser}
          />

          <MenuItem title="Alerts" icon={NotificationChecked} className='list-item-menu' />
          <MenuItem title="Setting" icon={Settings} className='list-item-menu' />
        </Menu>

        {/* <div className="menu-wrapper">
      {items.map((item, index) => (
        <div
          key={index}
          className={`menu-item 
            ${item.type === "parent" ? "parent" : "child"} 
            ${active === item.label ? "active" : ""}`}
          onClick={() => setActive(item.label)}
        >
          <span className="icon">
            {item.type === "parent" ? "" : "➜"}
          </span>
          <span className="text">{item.label}</span>
        </div>
      ))}
    </div> */}




        <Toast
          open={toast.open}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          actions={toast.actions}

        >
          {toast.message}
        </Toast>
      </Flex>
    </div>
  )
}

export default MenuBar