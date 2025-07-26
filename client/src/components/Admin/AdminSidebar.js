import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Drawer,
  useTheme,
  Toolbar
} from '@mui/material';
import { 
  People, 
  AccountBalance, 
  Dashboard,
  Settings,
  BarChart,
  Link as LinkIcon,
  ReceiptLong as RequestsIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const theme = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: 'none',
          boxShadow: theme.shadows[1]
        },
      }}
    >
      <Toolbar /> {/* Spacer for TopNav */}
      <Divider />
      <List>
        <ListItem 
          button 
          component={RouterLink} 
          to="/admin/dashboard"
          sx={ isActive('/admin/dashboard') && {
              backgroundColor: theme.palette.action.selected,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }
          }
        >
          <ListItemIcon sx={{ minWidth: 40 }}><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/admin/users"
          sx={ isActive('/admin/users') && {
              backgroundColor: theme.palette.action.selected,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }
          }
        >
          <ListItemIcon sx={{ minWidth: 40 }}><People /></ListItemIcon>
          <ListItemText primary="User Management" />
        </ListItem>
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/admin/investments"
          sx={ isActive('/admin/investments') && {
              backgroundColor: theme.palette.action.selected,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }
          }
        >
          <ListItemIcon sx={{ minWidth: 40 }}><AccountBalance /></ListItemIcon>
          <ListItemText primary="Investments" />
        </ListItem>
        
        <ListItem 
          button 
          component={RouterLink} 
          to="/admin/assignments"
          sx={ isActive('/admin/assignments') && {
              backgroundColor: theme.palette.action.selected,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }
          }
        >
          <ListItemIcon sx={{ minWidth: 40 }}><LinkIcon /></ListItemIcon>
          <ListItemText primary="Assignments" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="/admin/requests"
          sx={ isActive('/admin/requests') && {
              backgroundColor: theme.palette.action.selected,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }
          }
        >
          <ListItemIcon sx={{ minWidth: 40 }}><RequestsIcon /></ListItemIcon>
          <ListItemText primary="Manage Requests" />
        </ListItem>
        <ListItem 
          button 
          component={RouterLink} 
          to="/admin/reports"
          sx={ isActive('/admin/reports') && {
              backgroundColor: theme.palette.action.selected,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }
          }
        >
          <ListItemIcon sx={{ minWidth: 40 }}><BarChart /></ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem 
          button 
          component={RouterLink} 
          to="/admin/settings"
          sx={ isActive('/admin/settings') && {
              backgroundColor: theme.palette.action.selected,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }
          }
        >
          <ListItemIcon sx={{ minWidth: 40 }}><Settings /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
}
