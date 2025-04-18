import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.custom.css';

const iconStyle = { fontSize: 18, verticalAlign: 'middle' };

type ReservationCalendarProps = {
  availableDates: string[];
  onDateSelect: (date: Date | null) => void;
}
export const ReservationCalendar = ({ availableDates, onDateSelect }: ReservationCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const available = new Set(availableDates);
  const isDarkMode = useTheme().palette.mode === 'dark';
  
  return (
    <Box sx={{ my: 2 }}>
      <div style={{ width: 340, margin: '0 auto', color: '#222' }}>
        <Calendar
          className={isDarkMode ? 'react-calendar dark' : 'react-calendar'}
          locale={navigator.language.startsWith('ru') ? 'ru-RU' : 'en-US'}
          value={selectedDate}
          onChange={date => {
            setSelectedDate(date as Date);
            onDateSelect(date as Date);
          }}
          tileContent={({ date, view }) =>
            view === 'month' && (
              available.has(date.toISOString().slice(0, 10))
                ? <span style={{ color: 'green', ...iconStyle }}>✔️</span>
                : <span style={{ color: 'red', ...iconStyle }}>❌</span>
            )
          }
          tileDisabled={({ date, view }) =>
            view === 'month' && !available.has(date.toISOString().slice(0, 10))
          }
        />
      </div>
    </Box>
  );
};

