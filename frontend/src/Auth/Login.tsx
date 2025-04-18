import { Button, Container, Link, TextField, Typography, Box, Paper } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom"

export const Login = ({ setToken, setUser, API }: { setToken: (t: string) => void, setUser: (user: any) => void, API: string }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      setToken(res.data.access_token);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setError('');
      navigate('/spots');
    } catch (err: any) {
      setError('Authorization error');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', bgcolor: 'background.paper', color: 'text.primary' }}>
          <Typography variant="h5" gutterBottom align="center">Sign in</Typography>
          <form onSubmit={handleLogin}>
            <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" InputLabelProps={{ style: { color: 'inherit' } }} />
            <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" InputLabelProps={{ style: { color: 'inherit' } }} />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Sign in</Button>
          </form>
          <Button component={RouterLink} fullWidth sx={{ mt: 2 }} to="/register">Sign up</Button>
        </Paper>
      </Box>
    </Container>
  );
}