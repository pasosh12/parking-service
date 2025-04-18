import { Button, Box, Typography, useTheme } from '@mui/material';

type Slot = {
  time: string; // '08:00:00'
  available: boolean;
};

type Props = {
  slots: Slot[];
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
  onBook: () => void;
};

function displaySlot(time: string) {
  switch (time) {
    case '08:00:00': return '08:00–09:00';
    case '09:00:00': return '09:00–10:00';
    case '10:00:00': return '10:00–11:00';
    case '19:00:00': return '19:00–20:00';
    default: return time;
  }
}

export const TimeSlots = ({ slots, selectedSlot, onSelect, onBook }: Props) => {
   
  const isDarkMode = useTheme().palette.mode === 'dark';
  const boxBg = isDarkMode ? '#333' : '#eee';
  const textColor = isDarkMode ? '#fff' : '#222';

  return (
    <Box sx={{ p: 2, background: boxBg, borderRadius: 2, color: textColor }}>
      <Typography variant="h6" gutterBottom sx={{ color: textColor }}>Available slots:</Typography>
      {slots.map(slot => (
        <Box key={slot.time} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography
            sx={{
              flex: 1,
              color: textColor,
              fontWeight: 500
            }}
          >
            {slot.available ? '✅' : '❌'} {displaySlot(slot.time)} {slot.available ? '' : '(occupied)'}
          </Typography>
          <Button
            variant={selectedSlot === slot.time ? 'contained' : 'outlined'}
            color={slot.available ? 'success' : 'error'}
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
            sx={{ ml: 2 }}
          >
            Take
          </Button>
        </Box>
      ))}
      {selectedSlot && (
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2, color: textColor }} onClick={onBook}>
          Book: {displaySlot(selectedSlot)}
        </Button>
      )}
    </Box>
  );
}
