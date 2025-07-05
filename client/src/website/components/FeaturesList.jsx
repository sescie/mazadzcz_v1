import React from 'react';
import { Container, Grid } from '@mui/material';
import FeatureCard from './FeatureCard';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  ShowChart as ShowChartIcon
} from '@mui/icons-material';

const features = [
  {
    icon: <TrendingUpIcon />,
    title: 'Diversify Easily',
    description: 'Access a broad range of asset classes to build a resilient portfolio.'
  },
  {
    icon: <SecurityIcon />,
    title: 'Top‑Tier Security',
    description: 'Bank‑grade encryption and two‑factor authentication keep your assets safe.'
  },
  {
    icon: <ShowChartIcon />,
    title: 'Real‑Time Insights',
    description: 'Live market data and charts to make informed investment decisions.'
  }
];

export default function FeaturesList() {
  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {features.map((f, i) => (
          <Grid item xs={12} md={4} key={i}>
            <FeatureCard {...f} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
