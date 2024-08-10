// components/Sidebar.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export default function Sidebar({ mobileOpen, handleDrawerToggle, setCurrentView, currentView, drawerWidth }) {
  const menuItems = [
    { text: 'Inventory', icon: <InventoryIcon />, view: 'inventory' },
    { text: 'Categories', icon: <CategoryIcon />, view: 'categories' },
    { text: 'Settings', icon: <SettingsIcon />, view: 'settings' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => setCurrentView(item.view)}
            selected={currentView === item.view}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          width: drawerWidth,
          flexShrink: 0,
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}