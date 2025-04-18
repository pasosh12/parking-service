import { Box, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export const ParkingSpots = ({ token, API }: { token: string, API: string }) => {
  const [spots, setSpots] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    if (!token) return;
    axios.get(`${API}/parking-spots`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setSpots(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setError('Spots loading error')
      });
  }, [token]);



  return (
    <Container>
      <Typography variant="h5" gutterBottom align="center">Parking Spots</Typography>

      {error && <Typography align="center" color="error">{error}</Typography>}

      {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} /> : (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
          <TableContainer  component={Paper} sx={{ mt: 2 }}>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell sx={{ textAlign: 'left', pl: 3, pr: 3 }}>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {spots.map(spot => (
                  <TableRow key={spot.id}>
                    <TableCell>{spot.id}</TableCell>
                    <TableCell sx={{ textAlign: 'left', pl: 3, pr: 3 }}>{spot.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="body1" sx={{ mt: 2, mr:2 }} gutterBottom align="right">{spots.length} parking spots available</Typography>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
}