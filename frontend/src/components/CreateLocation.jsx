// src/components/CreateLocation.jsx
import React, { useState, useEffect } from 'react';

const CreateLocation = ({ groups, apiUrl }) => {
  const [formData, setFormData] = useState({
    group: '',
    name: '',
    longitude: '',
    latitude: '',
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, group: groups[0]?.key || '' }));
  }, [groups]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      longitude: parseFloat(formData.longitude),
      latitude: parseFloat(formData.latitude),
    };
  
    fetch(`${apiUrl}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async res => {
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error en la creación");
        }
        return res.json();
      })
      .then(data => {
        alert("✅ " + data.message);
      })
      .catch(err => {
        alert("❌ Error al crear: " + err.message);
      });
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Localización</h2>
      <select name="group" value={formData.group} onChange={handleChange} required>
        {groups.map(g => (
          <option key={g.key} value={g.key}>{g.label}</option>
        ))}
      </select>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required />
      <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitud" required />
      <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitud" required />
      <button type="submit">Crear</button>
    </form>
  );
};

export default CreateLocation;
