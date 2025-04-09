import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { People, AccountBalance, Mail } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <List sx={{ width: 250 }}>
      <ListItem button component={RouterLink} to="/admin/users">
        <ListItemIcon><People /></ListItemIcon>
        <ListItemText primary="User Management" />
      </ListItem>
      <ListItem button component={RouterLink} to="/admin/investments">
        <ListItemIcon><AccountBalance /></ListItemIcon>
        <ListItemText primary="Investments" />
      </ListItem>
    </List>
  );
}