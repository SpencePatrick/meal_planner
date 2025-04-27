import React, { useEffect, useState } from 'react';
import { checkSession } from './api';
import Login from './components/Login';
import Signup from './components/Signup';
import Step1Pantry from './components/Step1Pantry';
import Step2Preferences from './components/Step2Preferences';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    checkSession().then(data => setUser(data.username));
  }, []);

  if (!user) {
    return showSignup
      ? <Signup onSignup={() => setShowSignup(false)} />
      : (
        <div>
          <Login onLogin={() => checkSession().then(data => setUser(data.username))} />
          <div className="text-center mt-2">
            <button className="btn btn-link" onClick={() => setShowSignup(true)}>Sign up</button>
          </div>
        </div>
      );
  }

  if (step === 1) {
    return <Step1Pantry onConfirm={() => setStep(2)} />;
  }

  if (step === 2) {
    return <Step2Preferences onBack={() => setStep(1)} onContinue={() => setStep(3)} />;
  }

  if (step === 3) {
    return (
      <div className="container mt-4" style={{ maxWidth: 500 }}>
        <h4>Step 3 coming soon!</h4>
        <button className="btn btn-secondary" onClick={() => setStep(2)}>Back to Preferences</button>
      </div>
    );
  }

  return null;
}

export default App; 