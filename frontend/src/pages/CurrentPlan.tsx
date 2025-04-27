import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import api, { MealPlan } from '../services/api';

const CurrentPlan = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        setLoading(true);
        const plan = await api.getCurrentMealPlan();
        setMealPlan(plan);
        setError(null);
      } catch (err) {
        setError('Failed to load current meal plan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!mealPlan) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No active meal plan found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Current Meal Plan
      </Typography>
      <Grid container spacing={3}>
        {mealPlan.meals.map((meal) => (
          <Grid item xs={12} sm={6} md={4} key={meal.day}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Day {meal.day}
                </Typography>
                <Typography variant="body1">
                  {meal.recipe_name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CurrentPlan; 