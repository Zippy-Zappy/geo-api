import React, { useState, useEffect } from 'react';

const UpdateLocation = ({ apiUrl }) => {
  const [updateData, setUpdateData] = useState({ group: '', name: '', longitude: '', latitude: '' });
  const [groups, setGroups] = useState([]);  // Estado para almacenar los grupos
  const [loading, setLoading] = useState(true);  // Estado para manejar el loading

  useEffect(() => {
    // Obtener los grupos del backend
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${apiUrl}/groups`);
        const data = await response.json();
        console.log("Grupos recibidos en UpdateLocation:", data);  // Verificar la respuesta de los grupos
        setGroups(data);  // Establecer los grupos en el estado
        setLoading(false);  // Dejar de mostrar el loading cuando se obtienen los grupos
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, [apiUrl]);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({ ...prev, [name]: value }));
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...updateData,
      longitude: parseFloat(updateData.longitude),
      latitude: parseFloat(updateData.latitude),
    };

    fetch(`${apiUrl}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(error => alert("Error al actualizar la localización: " + error.message));
  };

  // Si aún estamos cargando los grupos, mostramos un mensaje de carga
  if (loading) {
    return <div>Cargando grupos...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Actualizar Localización</h2>

      {/* Campo de selección para el grupo */}
      <select name="group" value={updateData.group} onChange={handleChange} required>
        <option value="">Seleccione un grupo</option>
        {groups.length > 0 ? (
          groups.map(g => (
            <option key={g.key} value={g.key}>{g.label}</option>
          ))
        ) : (
          <option value="">No hay grupos disponibles</option>
        )}
      </select>

      <input
        type="text"
        name="name"
        value={updateData.name}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />
      <input
        type="number"
        name="longitude"
        value={updateData.longitude}
        onChange={handleChange}
        placeholder="Nueva Longitud"
        required
      />
      <input
        type="number"
        name="latitude"
        value={updateData.latitude}
        onChange={handleChange}
        placeholder="Nueva Latitud"
        required
      />
      <button type="submit">Actualizar</button>
    </form>
  );
};

export default UpdateLocation;
