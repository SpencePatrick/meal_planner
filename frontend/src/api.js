const API = 'http://localhost:5001/api';

export async function signup(username, password) {
  const res = await fetch(`${API}/signup`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({username, password}),
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({username, password}),
  });
  return res.json();
}

export async function checkSession() {
  const res = await fetch(`${API}/session`, {
    credentials: 'include',
  });
  return res.json();
}

export async function getPantry() {
  const res = await fetch(`${API}/pantry`, {
    credentials: 'include',
  });
  return res.json();
}

export async function updatePantry(items) {
  const res = await fetch(`${API}/pantry`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({items}),
  });
  return res.json();
}

export async function deletePantryItem(id) {
  const res = await fetch(`${API}/pantry/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

export async function getFamily() {
  const res = await fetch(`${API}/family`, { credentials: 'include' });
  return res.json();
}

export async function addFamilyMember(first_name, age) {
  const res = await fetch(`${API}/family`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({first_name, age}),
  });
  return res.json();
}

export async function updateFamilyMember(id, first_name, age) {
  const res = await fetch(`${API}/family/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({first_name, age}),
  });
  return res.json();
}

export async function deleteFamilyMember(id) {
  const res = await fetch(`${API}/family/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

export async function getPreferences() {
  const res = await fetch(`${API}/preferences`, { credentials: 'include' });
  return res.json();
}

export async function setPreferences(preferences) {
  const res = await fetch(`${API}/preferences`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({preferences}),
  });
  return res.json();
}

export async function updatePreference(id, checked) {
  const res = await fetch(`${API}/preferences/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({checked}),
  });
  return res.json();
} 