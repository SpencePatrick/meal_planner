import React, { useState } from 'react';
import { signup } from '../api';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await signup(username, password);
    if (res.error) setError(res.error);
    else {
      setSuccess('Account created! You can now log in.');
      setError('');
      setUsername('');
      setPassword('');
      onSignup && onSignup();
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth: 400}}>
      <h2>Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input className="form-control" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <input className="form-control" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn btn-secondary w-100" type="submit">Sign Up</button>
      </form>
    </div>
  );
} 