import { Outlet } from "react-router-dom";
import { Box } from "@vibe/core";
import NavBar from "./Components/Navbar/NavBar.jsx";
import MenuBar from "./Components/Navbar/MenuBar.jsx";

export default function ProtectedLayout() {
  return (
    <Box style={{ backgroundColor: "#F6F7FB" }}>
      <NavBar />

      <Box style={{ display: "flex", gap: "10px", padding: "20px" }}>
        <MenuBar />

        <Box
          style={{
            flex: 1,
            padding: "12px",
            background: "#fff",
            minHeight: "100vh",
          }}
        >
          <Outlet /> {/* 👈 YAHAN page inject hota hai */}
        </Box>
      </Box>
    </Box>
  );
}
