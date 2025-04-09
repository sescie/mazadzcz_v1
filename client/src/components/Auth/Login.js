// client/src/components/Auth/Login.js
import { Container, TextField, Button, Typography } from '@mui/material';

export default function Login() {
  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Mazadzicz Portal</Typography>
      <form>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          sx={{ mt: 3 }}
        >
          Sign In
        </Button>
      </form>
    </Container>
  );
}

