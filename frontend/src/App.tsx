import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Header } from './Components/common/Header';
import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Login } from './Auth/Login';
import { ParkingSpots } from './ParkingSpots/ParkingSpots';
import { Register } from './Auth/Register';
import './App.css';
import {Reservation} from './reservation/Reservation';
import {MyBookings} from './Bookings/MyBookings';

import { API } from './api';


export const App = ()=> {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = createTheme({ palette: { mode } });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);


  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuth = !!token && !!user;
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header isAuth={isAuth} mode={mode} setMode={setMode} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Login setToken={setToken} setUser={setUser} API={API} />} />
          <Route path="/register" element={<Register />} />
          {isAuth ? (
            <>
              <Route path="/spots" element={<ParkingSpots token={token} API={API} />} />
              <Route path="/reservations" element={<Reservation token={token} user={user} />} />
              <Route path="/my-bookings" element={<MyBookings token={token} user={user} />} />
            </>
          ) : (
            <>
              <Route path="/spots" element={<Navigate to="/" />} />
              <Route path="/reservations" element={<Navigate to="/" />} />
              <Route path="/my-bookings" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

 