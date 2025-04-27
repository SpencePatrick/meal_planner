import React, { useEffect, useState } from 'react';
import {
  getFamily, addFamilyMember, updateFamilyMember, deleteFamilyMember,
  getPreferences, setPreferences, updatePreference
} from '../api';

const DEFAULT_PREFERENCES = [
  { name: 'Breakfast', checked: false },
  { name: 'Lunch', checked: false },
  { name: 'Dinner', checked: false },
  { name: 'Snack', checked: false },
];

export default function Step2Preferences({ onBack, onContinue }) {
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [preferences, setPrefs] = useState([]);

  useEffect(() => {
    getFamily().then(setMembers);
    getPreferences().then(prefs => {
      if (prefs.length === 0) setPrefs(DEFAULT_PREFERENCES);
      else setPrefs(prefs);
    });
  }, []);

  const handleEdit = (id, field, value) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSave = async (id) => {
    const member = members.find(m => m.id === id);
    await updateFamilyMember(id, member.first_name, member.age);
  };

  const handleDelete = async (id) => {
    await deleteFamilyMember(id);
    setMembers(members.filter(m => m.id !== id));
  };

  const handleAdd = async () => {
    if (!newName || !newAge) return;
    const res = await addFamilyMember(newName, parseInt(newAge, 10));
    setMembers([...members, res]);
    setNewName('');
    setNewAge('');
  };

  const handlePrefChange = async (id, checked) => {
    setPrefs(prefs => prefs.map(p => p.id === id ? { ...p, checked } : p));
    await updatePreference(id, checked);
  };

  return (
    <div className="container mt-4 max-w-lg">
      <h4>Who are you feeding?</h4>
      <div className="d-flex mb-1 fw-bold" style={{maxWidth: 220}}>
        <div style={{width: 120}}>Name</div>
        <div style={{width: 80}}>Age</div>
      </div>
      <ul className="list-group mb-3">
        {members.map(m => (
          <li className="list-group-item d-flex align-items-center" key={m.id}>
            <input
              className="form-control me-2"
              style={{ maxWidth: 120 }}
              value={m.first_name}
              onChange={e => handleEdit(m.id, 'first_name', e.target.value)}
              onBlur={() => handleSave(m.id)}
            />
            <input
              className="form-control me-2"
              style={{ maxWidth: 80 }}
              type="number"
              value={m.age}
              onChange={e => handleEdit(m.id, 'age', e.target.value)}
              onBlur={() => handleSave(m.id)}
            />
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          style={{ maxWidth: 120 }}
          placeholder="First name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          className="form-control me-2"
          style={{ maxWidth: 80 }}
          type="number"
          placeholder="Age"
          value={newAge}
          onChange={e => setNewAge(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAdd}>Add</button>
      </div>
      <h5 className="mt-4">Preferences</h5>
      <div className="mb-1 fw-bold">Which meals should I plan for you?</div>
      <ul className="list-group mb-3">
        {preferences.map((p, idx) => (
          <li className="list-group-item d-flex align-items-center" key={p.id || idx}>
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={!!p.checked}
              onChange={e => handlePrefChange(p.id, e.target.checked)}
            />
            <span>{p.name}</span>
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary me-2" onClick={onBack}>Back to Pantry</button>
        <button className="btn btn-primary" onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
} 