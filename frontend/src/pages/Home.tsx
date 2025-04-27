import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

const cuisineTypes = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Mediterranean',
  'American',
  'Thai',
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const handleCuisineSelect = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    navigate('/meal-plan', { state: { cuisineType: cuisine } });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Weekly Meal Planner
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Choose your preferred cuisine type to generate a weekly meal plan
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cuisineTypes.map((cuisine) => (
          <Grid item xs={12} sm={6} md={4} key={cuisine}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {cuisine}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleCuisineSelect(cuisine)}
                >
                  Select
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 