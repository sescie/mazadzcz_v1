import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountBalanceWallet, ShowChart, Mail } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

export default function InvestorSidebar() {
  return (
    <List sx={{ width: 250 }}>
      <ListItem button component={RouterLink} to="/investor/portfolio">
        <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
        <ListItemText primary="My Portfolio" />
      </ListItem>
      <ListItem button component={RouterLink} to="/investor/market">
        <ListItemIcon><ShowChart /></ListItemIcon>
        <ListItemText primary="Market Data" />
      </ListItem>
    </List>
  );
}