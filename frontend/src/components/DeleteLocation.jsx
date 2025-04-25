// src/components/DeleteLocation.jsx
import React, { useState } from 'react';

const DeleteLocation = ({ groups, apiUrl }) => {
  const [deleteData, setDeleteData] = useState({ group: '', name: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeleteData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deleteData),
    })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Eliminar Localización</h2>
      <select name="group" value={deleteData.group} onChange={handleChange} required>
        <option value="">Seleccione un grupo</option>
        {groups.map(g => (
          <option key={g.key} value={g.key}>{g.label}</option>
        ))}
      </select>
      <input
        type="text"
        name="name"
        value={deleteData.name}
        onChange={handleChange}
        placeholder="Nombre a eliminar"
        required
      />
      <button type="submit">Eliminar</button>
    </form>
  );
};

export default DeleteLocation;
