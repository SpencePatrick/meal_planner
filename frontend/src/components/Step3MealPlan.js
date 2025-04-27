import React, { useEffect, useState } from 'react';
import { getMealPlan } from '../api';

export default function Step3MealPlan({ onBack, onContinue }) {
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMealPlan();
      if (res.plan) setPlan(res.plan);
      else setError(res.error || 'No plan generated.');
    } catch (e) {
      setError('Failed to fetch meal plan.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlan();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container mt-4 max-w-lg">
      <h4>Your AI-Generated Meal Plan</h4>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <pre style={{whiteSpace: 'pre-wrap'}}>{plan}</pre>
      )}
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={onBack}>Back to Step 2</button>
        <button className="btn btn-info" onClick={fetchPlan}>Refresh Plan</button>
        <button className="btn btn-primary" onClick={onContinue}>Continue to Step 4</button>
      </div>
    </div>
  );
} 