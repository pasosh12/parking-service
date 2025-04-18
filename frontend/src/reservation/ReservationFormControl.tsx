import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

type ReservationFormControlProps = {
  parkingSpots: { id: number; location: string }[];
  selectedSpotId: number | null;
  setSelectedSpotId: (id: number | null) => void;
}

export const ReservationFormControl = ({ parkingSpots, selectedSpotId, setSelectedSpotId }: ReservationFormControlProps) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="spot-label">Select parking spot</InputLabel>
      <Select
        labelId="spot-label"
        value={selectedSpotId ?? ''}
        label="Select parking spot"
        onChange={e => setSelectedSpotId(Number(e.target.value) || null)}
      >
        <MenuItem value="">--</MenuItem>
        {parkingSpots.map(s => (
          <MenuItem key={s.id} value={s.id}>{s.location}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

