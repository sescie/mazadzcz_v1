// client/src/components/Error/AppErrorBoundary.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 💡 Jargon: Error Logging Service (ELK/Sentry)
    console.error('Error Boundary:', error, info);
  }

  handleReset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Application Error
          </Typography>
          <Typography paragraph>
            Something went wrong. Our team has been notified.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={this.handleReset}
          >
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}