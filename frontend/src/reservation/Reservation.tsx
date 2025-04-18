import { useState, useEffect } from 'react';
import { TimeSlots } from './TimeSlots';
import axios from 'axios';

import { API } from '../api';

import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { ReservationFormControl } from './ReservationFormControl';
import { ReservationCalendar } from './ReservationCalendar';

type ReservationProps = {
  token: string;
  user: { id: number };
}

export const Reservation = ({ token, user }: ReservationProps) => {
  const [parkingSpots, setParkingSpots] = useState<{ id: number; location: string }[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<{ time: string, available: boolean }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/parking-spots/`, { headers: { Authorization: `Bearer ${token}` } });
        setParkingSpots(res.data);
      } catch {
        setError('Error loading parking spot calendar');
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  // Get available dates for choosed spot for 30 days
  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!selectedSpotId) {
        setAvailableDates([]);
        return;
      }
      const from = new Date();
      const to = new Date();
      to.setDate(from.getDate() + 30);
      try {
        const res = await axios.get(`${API}/reservations/spot/${selectedSpotId}?from=${from.toISOString().slice(0, 10)}&to=${to.toISOString().slice(0, 10)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const reservations = res.data;
        const allSlots = [
          '08:00–09:00',
          '09:00–10:00',
          '10:00–11:00',
          '19:00–20:00',
        ];
        // counting occupied slots by dates
        const slotMap: Record<string, Set<string>> = {};
        reservations.forEach((r: any) => {
          const date = typeof r.reserved_date === "string"
            ? r.reserved_date.slice(0, 10)
            : r.reserved_date.toISOString().slice(0, 10);
          if (!slotMap[date]) slotMap[date] = new Set();
          slotMap[date].add(r.reserved_time);
        });
        // dates,where at least one free slot available
        const result: string[] = [];
        for (let i = 0; i < 30; i++) {
          const d = new Date(from);
          d.setDate(from.getDate() + i);
          const dateStr = d.toISOString().slice(0, 10);
          const booked = slotMap[dateStr] || new Set();
          if (allSlots.find(slot => !booked.has(slot))) {
            result.push(dateStr);
          }
        }
        setAvailableDates(result);
      } catch {
        setAvailableDates([]);
      }
    };
    fetchAvailableDates();
  }, [selectedSpotId, token]);

  // fetch available slots for choosed date
  const fetchSlots = async () => {
    if (selectedSpotId && selectedDate) {
      try {
        const res = await axios.get(`${API}/parking-spots/${selectedSpotId}/available-times?date=${selectedDate.toLocaleDateString('en-CA')}`, { headers: { Authorization: `Bearer ${token}` } });
        setSlots(res.data);
      } catch {
        setSlots([]);
      }
    } else {
      setSlots([]);
    }
  }
  useEffect(() => {
    fetchSlots();
  }, [selectedSpotId, selectedDate]);


  const handleBook = async () => {
    if (!selectedSpotId || !selectedDate || !selectedSlot) {
      alert('Choose date time and spot first!');
      return;
    }
    if (selectedSpotId && selectedDate && selectedSlot) {
      const toLocalDate = (date: Date) => date.toLocaleDateString('en-CA');
      try {
        await axios.post(`${API}/reservations/book`, {
          userId: user.id,
          parkingSpotId: selectedSpotId,
          reserved_date: toLocalDate(selectedDate),
          reserved_time: selectedSlot,
        }, { headers: { Authorization: `Bearer ${token}` } });
        alert('Booking successful!');
        fetchSlots();
      } catch {
        alert('Booking failed!');
      }
    }
  };


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Book parking spot
      </Typography>
      {error && <Typography color="error" align="center" sx={{ mt: 2, mb: 2 }}>{error}</Typography>}
      {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} /> : (
        <Paper sx={{ p: 3 }}>
          <ReservationFormControl
            parkingSpots={parkingSpots}
            selectedSpotId={selectedSpotId}
            setSelectedSpotId={setSelectedSpotId}
          />
          {selectedSpotId && (
            <ReservationCalendar
              availableDates={availableDates}
              onDateSelect={(date) => {
                const dateStr = date ? date.toISOString().slice(0, 10) : '';
                if (!availableDates.includes(dateStr)) {
                  setSelectedDate(null);
                } else {
                  setSelectedDate(date);
                }
              }}
            />
          )}
          {selectedSpotId && selectedDate && (
            <Box sx={{ mt: 3 }}>
              <TimeSlots
                slots={slots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
                onBook={handleBook}
              />
            </Box>
          )}

        </Paper>
      )}
    </Box>
  );
}