import React, { useEffect, useState } from 'react';
import { getPantry, updatePantry, deletePantryItem } from '../api';

export default function Step1Pantry({ onConfirm }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPantry().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleEdit = (id, field, value) => {
    setItems(items.map(item => item.id === id ? {...item, [field]: value} : item));
    setEditing({...editing, [id]: true});
  };

  const handleDelete = async id => {
    await deletePantryItem(id);
    setItems(items.filter(item => item.id !== id));
  };

  const handleConfirm = async () => {
    await updatePantry(items);
    onConfirm && onConfirm();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4" style={{maxWidth: 500}}>
      <h4>Do you still have these items?</h4>
      <ul className="list-group mb-3">
        {items.map(item => (
          <li className="list-group-item d-flex align-items-center" key={item.id}>
            <input
              className="form-control me-2"
              style={{maxWidth: 120}}
              value={item.name}
              onChange={e => handleEdit(item.id, 'name', e.target.value)}
            />
            <input
              className="form-control me-2"
              style={{maxWidth: 80}}
              value={item.quantity}
              onChange={e => handleEdit(item.id, 'quantity', e.target.value)}
            />
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button className="btn btn-success w-100" onClick={handleConfirm}>Confirm</button>
    </div>
  );
} 