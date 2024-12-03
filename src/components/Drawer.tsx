import React, { useState } from "react";
import { Drawer, IconButton, List, ListItem, ListItemText, AppBar, Toolbar } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

function DrawerNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <>
      <AppBar position="static"  style={{ background: "none", boxShadow: "none", width: "30px"}}>
        <Toolbar style={{ padding:"0"}}>
          <IconButton onClick={toggleDrawer(true)} edge="start"  aria-label="menu" >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{ width: 250 }}
        >
          <List>
            <ListItem>
              <ListItemText primary="Basic Drawer" style={{ fontWeight: "bold", borderBottom: "1px solid #ccc", paddingBottom: "8px" }} />
            </ListItem>
            <ListItem >
              <ListItemText primary="Some contents..." />
            </ListItem>
            <ListItem >
              <ListItemText primary="Some contents..." />
            </ListItem>
            <ListItem >
              <ListItemText primary="Some contents..." />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
}

export default DrawerNav;
