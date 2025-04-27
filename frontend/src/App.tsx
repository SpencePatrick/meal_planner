import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import MealPlan from './pages/MealPlan';
import CurrentPlan from './pages/CurrentPlan';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/current-plan" element={<CurrentPlan />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
