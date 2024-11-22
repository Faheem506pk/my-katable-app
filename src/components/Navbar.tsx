import React from "react";
import { AppBar, Toolbar, IconButton, Typography, TextField } from "@mui/material";
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from "@mui/icons-material";
import DrawerNav from "./Drawer";

interface NavbarProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, darkMode }) => {
  const [pageName, setPageName] = React.useState(localStorage.getItem("pageName") || "qotion");
  const [isEditingPageName, setIsEditingPageName] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem("pageName", pageName);
    document.title = pageName;
  }, [pageName]);

  const handleTaskClick = () => setIsEditingPageName(true);
  const handleTaskBlur = () => setIsEditingPageName(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPageName(e.target.value);

  return (
    <AppBar position="static" color="default" style={{ background: "none", boxShadow: "none" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between"}}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DrawerNav  />
          {isEditingPageName ? (
            <TextField
              value={pageName}
              onChange={handleInputChange}
              onBlur={handleTaskBlur}
              autoFocus
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                  textDecoration: "underline",
                },
              }}
            />
          ) : (
            <Typography
              variant="h3"
              onClick={handleTaskClick}
              style={{ fontSize: "14px", cursor: "pointer", fontWeight: "bold" }}
            >
              {pageName}
            </Typography>
          )}
        </div>
        {/* Make sure the button icon color is theme-aware */}
        <IconButton onClick={toggleDarkMode}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
