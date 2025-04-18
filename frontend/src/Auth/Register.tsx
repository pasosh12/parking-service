import { Container, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from '../api';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/register`, { email, password });
      setSuccess('Registration success!');
      setError('');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setError('Registration error');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>Register</Typography>
      <form onSubmit={handleRegister}>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        {success && <Typography color="success.main">{success}</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Register</Button>
        <Button fullWidth sx={{ mt: 2 }} component={Link} to="/">Back</Button>
      </form>
    </Container>
  );
} 