import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import api, { MealPlan as IMealPlan } from '../services/api';

const MealPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<IMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cuisineType = location.state?.cuisineType;

  useEffect(() => {
    if (!cuisineType) {
      navigate('/');
      return;
    }

    const generatePlan = async () => {
      try {
        setLoading(true);
        const plan = await api.generateMealPlan(cuisineType);
        setMealPlan(plan);
        setError(null);
      } catch (err) {
        setError('Failed to generate meal plan. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    generatePlan();
  }, [cuisineType, navigate]);

  const handleAccept = async () => {
    if (!mealPlan) return;
    try {
      await api.updateMealPlanStatus(mealPlan.meal_plan_id, 'accepted');
      const cart = await api.createWalmartCart(mealPlan.meal_plan_id);
      window.open(cart.walmart_url, '_blank');
      navigate('/current-plan');
    } catch (err) {
      setError('Failed to accept meal plan. Please try again.');
      console.error(err);
    }
  };

  const handleReject = async () => {
    if (!mealPlan) return;
    try {
      await api.updateMealPlanStatus(mealPlan.meal_plan_id, 'rejected');
      navigate('/');
    } catch (err) {
      setError('Failed to reject meal plan. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Your Weekly Meal Plan
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          {cuisineType} Cuisine
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {mealPlan?.meals.map((meal) => (
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

      <Box display="flex" justifyContent="center" gap={2} mt={6}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleAccept}
        >
          Accept Plan
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={handleReject}
        >
          Generate New Plan
        </Button>
      </Box>
    </Container>
  );
};

export default MealPlan; 