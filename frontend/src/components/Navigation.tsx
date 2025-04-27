import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Meal Planner
        </Typography>
        <Button
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ mr: 1 }}
        >
          Home
        </Button>
        <Button
          color="inherit"
          component={RouterLink}
          to="/meal-plan"
          sx={{ mr: 1 }}
        >
          New Plan
        </Button>
        <Button
          color="inherit"
          component={RouterLink}
          to="/current-plan"
        >
          Current Plan
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
