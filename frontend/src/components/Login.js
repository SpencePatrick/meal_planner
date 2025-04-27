import React, { useState } from 'react';
import { login } from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.error) setError(res.error);
    else onLogin();
  };

  return (
    <div className="container mt-5" style={{maxWidth: 400}}>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input className="form-control" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <input className="form-control" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
    </div>
  );
} 