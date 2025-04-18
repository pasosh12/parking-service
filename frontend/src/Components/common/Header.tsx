import { Box, Button, IconButton } from '@mui/material';
import { headerBoxSx, menuBoxSx, menuButtonSx } from './Header.styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';


type HeaderProps = {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
  handleLogout: () => void;
  isAuth: boolean
}

export const  Header= ({ mode, setMode, handleLogout, isAuth }: HeaderProps) => {
  return (
    <Box component="header" sx={headerBoxSx} >
      <Box sx={{ flex: 0.1 }} />
      <Box sx={menuBoxSx}>
        <Button component={Link} to="/spots" sx={menuButtonSx}>
          Parking spots
        </Button>
        <Button component={Link} to="/reservations" sx={menuButtonSx}>
          Book spot
        </Button>
        <Button component={Link} to="/my-bookings" sx={menuButtonSx}>
          My bookings
        </Button>
        {isAuth && (
          <Button component={Link} to="/" sx={menuButtonSx} onClick={handleLogout}>
            Log out
          </Button>
        )}
      </Box>
      <Box sx={{ flex: 0.1, display: 'flex', justifyContent: 'flex-end' }}>  
       <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="primary">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
       </Box>
    </Box>
  );
}
