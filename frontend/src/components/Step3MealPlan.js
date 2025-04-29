import React, { useEffect, useState } from 'react';
import { getMealPlan } from '../api';

export default function Step3MealPlan({ onBack, onContinue }) {
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlan = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMealPlan(forceRefresh);
      if (res.plan) setPlan(res.plan);
      else if (forceRefresh) setError('Failed to generate new meal plan.');
      else {
        // If no cached plan exists, generate a new one
        const newRes = await getMealPlan(true);
        if (newRes.plan) setPlan(newRes.plan);
        else setError(newRes.error || 'No plan generated.');
      }
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
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">
            {loading ? 'Generating your meal plan...' : 'Loading saved meal plan...'}
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <pre style={{whiteSpace: 'pre-wrap'}} className="bg-light p-3 rounded">{plan}</pre>
      )}
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={onBack}>Back to Step 2</button>
        <button 
          className="btn btn-info" 
          onClick={() => fetchPlan(true)} 
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Refresh Plan'}
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onContinue} 
          disabled={loading || error || !plan}
        >
          Continue to Step 4
        </button>
      </div>
    </div>
  );
} 