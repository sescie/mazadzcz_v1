// src/components/dashboard/InvestorDashboardContent.js

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  useTheme,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Cancel,
  AddCircle,
  AttachMoney,
  TrendingUp,
  PieChart,
  ShowChart,
  AccountBalance,
  MonetizationOn,
  BarChart,
  FiberManualRecord,
  Autorenew
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchUserInvestments,
  fetchAllInvestments,
  assignInvestmentToUser,
  unassignInvestmentFromUser,
} from '../../services/api';
import { Chart } from 'react-google-charts';
import {
  fetchDashboardSummary,
  fetchPerformanceData,
  fetchAllocationData,
  fetchRecentActivity
} from '../../services/dashboardService';

export default function InvestorDashboardContent() {
  const { auth } = useAuth();
  const theme = useTheme();
  const [invested, setInvested] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const [allocationData, setAllocationData] = useState([]);
  const [cardsData, setCardsData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    async function loadAll() {
      setLoading(true);
      try {
        const [
          userInv,
          allInv,
          summary,
          perf,
          alloc,
          activity
        ] = await Promise.all([
          fetchUserInvestments(auth.user.id, auth.token),
          fetchAllInvestments(auth.token),
          fetchDashboardSummary(auth.user.id, auth.token),
          fetchPerformanceData(auth.user.id, auth.token),
          fetchAllocationData(auth.user.id, auth.token),
          fetchRecentActivity(auth.user.id, auth.token)
        ]);

        const invIds = new Set(userInv.map(i => i.id));
        setInvested(userInv);
        setAvailable(allInv.filter(i => !invIds.has(i.id)));
        setCardsData(summary);
        setPerformanceData(perf);
        setAllocationData(alloc);
        setRecentActivity(activity);
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [auth]);

  const handleRequest = async row => {
    try {
      await assignInvestmentToUser(auth.user.id, row.id, auth.token);
      setInvested(prev => [...prev, row]);
      setAvailable(prev => prev.filter(i => i.id !== row.id));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCancel = async row => {
    try {
      await unassignInvestmentFromUser(auth.user.id, row.id, auth.token);
      setAvailable(prev => [...prev, row]);
      setInvested(prev => prev.filter(i => i.id !== row.id));
    } catch (e) {
      setError(e.message);
    }
  };

  // Define DataGrid columns
  const investedCols = [
    { field: 'name', headerName: 'Investment', flex: 1.5 },
    { field: 'type', headerName: 'Type', flex: 1 },
    {
      field: 'currentValue',
      headerName: 'Current Value',
      flex: 1,
      valueFormatter: params => {
        const num = Number.isFinite(params?.value) ? params.value : 0;
        return `$${num.toLocaleString()}`;
      }
    },
    {
      field: 'returnRate',
      headerName: 'Return %',
      flex: 0.8,
      renderCell: params => (
        <span style={{
          color: params.value > 0
            ? theme.palette.success.main
            : theme.palette.error.main
        }}>
          {params.value}%
        </span>
      )
    },
    {
      field: 'riskLevel',
      headerName: 'Risk',
      flex: 0.8,
      renderCell: params => {
        const color =
          params.value === 'High'
            ? theme.palette.error.main
            : params.value === 'Moderate'
            ? theme.palette.warning.main
            : theme.palette.success.main;
        return <span style={{ color }}>{params.value}</span>;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      renderCell: params => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<Cancel />}
          onClick={() => handleCancel(params.row)}
        >
          Sell
        </Button>
      )
    }
  ];

  const availableCols = [
    { field: 'name', headerName: 'Opportunity', flex: 1.5 },
    { field: 'type', headerName: 'Type', flex: 1 },
    {
      field: 'minAmount',
      headerName: 'Min. Invest',
      flex: 1,
      valueFormatter: params => {
        const num = Number.isFinite(params?.value) ? params.value : 0;
        return `$${num.toLocaleString()}`;
      }
    },
    {
      field: 'potentialReturn',
      headerName: 'Est. Return',
      flex: 0.8,
      renderCell: params => (
        <span style={{ color: theme.palette.success.main }}>
          {params.value}%
        </span>
      )
    },
    { field: 'timeHorizon', headerName: 'Horizon', flex: 0.8 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      renderCell: params => (
        <Button
          variant="contained"
          size="small"
          startIcon={<AddCircle />}
          onClick={() => handleRequest(params.row)}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33,203,243,.3)'
          }}
        >
          Invest
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh'
        }}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: theme.palette.primary.main }}
        >
          Investment Portfolio Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
          Welcome back, {auth.user?.name || 'Investor'}
        </Typography>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {/* Portfolio Value */}
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: theme.shadows[4], borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney
                  sx={{ fontSize: 40, color: theme.palette.primary.main }}
                />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Portfolio Value
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ${cardsData?.totalValue?.toLocaleString() || '0'}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1,
                  color: theme.palette.success.main
                }}
              >
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                +{cardsData?.monthlyReturn || '0'}% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Return */}
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: theme.shadows[4], borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <MonetizationOn
                  sx={{ fontSize: 40, color: theme.palette.success.main }}
                />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Monthly Return
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {cardsData?.monthlyReturn || '0'}%
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: 'block', mt: 1 }}
              >
                vs. market average 3.2%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Annual Return */}
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: theme.shadows[4], borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AccountBalance
                  sx={{ fontSize: 40, color: theme.palette.warning.main }}
                />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Annual Return
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {cardsData?.annualReturn || '0'}%
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                Projected based on current holdings
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Diversification */}
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: theme.shadows[4], borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <PieChart sx={{ fontSize: 40, color: theme.palette.info.main }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Diversification
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {cardsData?.diversificationScore || '0'}/100
                  </Typography>
                </Box>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={cardsData?.diversificationScore || 0}
                sx={{ height: 6, borderRadius: 3, mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={4}>
        {/* Performance Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
               width: {
                xs: '100%',    // full width on small screens
                sm: '500px',    
                md: '700px',     // roughly half width on medium and larger screens
              },
              boxShadow: theme.shadows[2],
              height: '100%'
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
            >
              <ShowChart sx={{ mr: 1, color: theme.palette.primary.main }} /> Portfolio Performance
              <Box sx={{ flexGrow: 1 }} />
              <Chip
                label="Live"
                size="small"
                color="success"
                variant="outlined"
                icon={<FiberManualRecord sx={{ fontSize: 14 }} />}
              />
            </Typography>
            {performanceData?.length > 0 ? (
              <Chart
                chartType="LineChart"
                width="100%"
                height="300px"
                data={performanceData}
                loader={<CircularProgress />}
                options={{
                  hAxis: { title: 'Month' },
                  vAxis: { title: 'Value ($)', format: 'currency' },
                  legend: { position: 'bottom' },
                  curveType: 'function',
                  backgroundColor: 'transparent',
                  chartArea: { width: '85%', height: '75%' }
                }}
              />
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography>No performance data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Allocation Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
               width: {
                xs: '100%',    // full width on small screens
                sm: '500px',    
                md: '700px',     // roughly half width on medium and larger screens
              },
              boxShadow: theme.shadows[2],
              height: '100%'
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
            >
              <PieChart sx={{ mr: 1, color: theme.palette.primary.main }} /> Asset Allocation
              <Box sx={{ flexGrow: 1 }} />
              <Chip
                label="Updated"
                size="small"
                color="info"
                variant="outlined"
                icon={<Autorenew sx={{ fontSize: 14 }} />}
              />
            </Typography>
            {allocationData?.length > 1 ? (
              <Chart
                chartType="PieChart"
                width="100%"
                height="300px"
                data={allocationData}
                loader={<CircularProgress />}
                options={{
                  pieHole: 0.4,
                  pieSliceText: 'value',
                  legend: { position: 'bottom' },
                  backgroundColor: 'transparent',
                  chartArea: { width: '90%', height: '70%' }
                }}
              />
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography>No allocation data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity & Quick Actions Row */}
      <Grid container spacing={3} mb={4}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
              p: 2, 
              borderRadius: 2, 
              boxShadow: theme.shadows[2],                
              width: {
                    xs: '100%',    // full width on small screens
                    sm: '500px',    
                    md: '700px',     // roughly half width on medium and larger screens
                  }, }}>
            <Typography variant="h6" mb={2} sx={{ fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Stack spacing={2}>
              {recentActivity?.length > 0 ? (
                recentActivity.map(a => (
                  <Box
                    key={a.id}
                    sx={{
                      p: 1.5,
                      borderLeft: `4px solid ${
                        a.amount > 0 ? theme.palette.success.main : theme.palette.error.main
                      }`
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2">
                          {a.action} in {a.asset}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(a.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: a.amount > 0 ? theme.palette.success.main : theme.palette.error.main
                        }}
                      >
                        {a.amount > 0 ? '+' : ''}
                        {a.amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </Typography>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography>No recent activity</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: theme.shadows[2] }}>
            <Typography variant="h6" mb={2} sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddCircle />}
                  sx={{ py: 2, background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' }}
                >
                  Add Funds
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AttachMoney />}
                  sx={{ py: 2, background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)' }}
                >
                  Withdraw
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShowChart />}
                  sx={{ py: 2, background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)' }}
                >
                  Market Trends
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<BarChart />}
                  sx={{ py: 2, background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)' }}
                >
                  Portfolio Analysis
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Tables Row */}

    </Box>
  );
}