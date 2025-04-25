// src/components/ReadLocation.jsx
import React, { useState } from 'react';

const ReadLocation = ({ groups, apiUrl }) => {
  const [queryData, setQueryData] = useState({ group: '', name: '' });
  const [locationResult, setLocationResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQueryData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/location/${queryData.group}/${queryData.name}`)
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Error desconocido");
        }
        return res.json();
      })
      .then(data => setLocationResult(data))
      .catch(err => {
        alert("Error al obtener localización: " + err.message);
        setLocationResult(null);
      });
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Consultar Localización</h2>
      <select name="group" value={queryData.group} onChange={handleChange} required>
        {groups.map(g => (
          <option key={g.key} value={g.key}>{g.label}</option>
        ))}
      </select>
      <input type="text" name="name" value={queryData.name} onChange={handleChange} placeholder="Nombre" required />
      <button type="submit">Consultar</button>
      {locationResult && <pre>{JSON.stringify(locationResult, null, 2)}</pre>}
    </form>
  );
};

export default ReadLocation;
