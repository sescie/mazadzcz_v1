// client/src/components/Layout/DashboardLayout.js
import { Grid } from '@mui/material';

function DashboardLayout() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Sidebar /> {/* Navigation */}
      </Grid>
      <Grid item xs={12} md={9}>
        <MainContent /> {/* Data grids/forms */}
      </Grid>
    </Grid>
  );
}