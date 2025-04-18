import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Container } from '@mui/material';

import { API } from '../api';

type Booking = {
  id: number;
  reserved_date: string;
  reserved_time: string;
  status: 'booked' | 'cancelled';
  parkingSpot: { location: string };
}
type MyBookingsProps = {
  token: string;
  user: { id: number };
}

export const MyBookings = ({ token, user }: MyBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/reservations/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch(err) {
        setError(`Error loading bookings with ${err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token, user.id]);

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    try {
      await axios.delete(`${API}/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookingsToSet:Booking[] = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
      setBookings(bookingsToSet);
    } catch (err) {
      setError(`Error canceling booking with ${err}`);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Container>

      <Typography variant="h5" gutterBottom align="center">My bookings</Typography>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        {error && <Typography color="error" align="center" sx={{ mt: 2, mb: 2 }}>{error}</Typography>}
        {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} /> : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map(booking => {
                  const dateObj = new Date(booking.reserved_date);
                  const isFuture = dateObj > new Date();
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.parkingSpot.location || '—'}</TableCell>
                      <TableCell>{dateObj.toLocaleDateString()}</TableCell>
                      <TableCell>{booking.reserved_time}</TableCell>
                      <TableCell>{booking.status === 'booked' ? 'booked' : 'canceled'}</TableCell>
                      <TableCell>
                        {booking.status === 'booked' && isFuture && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            disabled={cancellingId === booking.id}
                            onClick={() => handleCancel(booking.id)}
                          >
                            {cancellingId === booking.id ? 'Canceling...' : 'Cancel'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}
