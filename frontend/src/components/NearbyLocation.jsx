// src/components/NearbyLocation.jsx
import React, { useState } from 'react';

const NearbyLocation = ({ groups, apiUrl }) => {
  const [byNameData, setByNameData] = useState({
    group: '',
    member: '',
    radius: '',
    unit: 'km'
  });

  const [byCoordData, setByCoordData] = useState({
    group: '',
    longitude: '',
    latitude: '',
    radius: '',
    unit: 'km'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

    const searchByMember = async (e) => {
    e.preventDefault();
    const { group, member, radius, unit } = byNameData;
    try {
        // Construir la URL con los parámetros de búsqueda
        const url = new URL(`${apiUrl}/nearby`);
        url.searchParams.append('group', group);
        url.searchParams.append('member', member);
        url.searchParams.append('radius', radius);
        url.searchParams.append('unit', unit);

        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();
        setResult(data.message);
    } catch (error) {
        alert("Error buscando por miembro: " + error.message);
    }
    };

    const searchByCoords = async (e) => {
    e.preventDefault();
    const { group, longitude, latitude, radius, unit } = byCoordData;
    try {
        // Construir la URL con los parámetros de búsqueda
        const url = new URL(`${apiUrl}/nearby_alt`);
        url.searchParams.append('group', group);
        url.searchParams.append('longitude', longitude);
        url.searchParams.append('latitude', latitude);
        url.searchParams.append('radius', radius);
        url.searchParams.append('unit', unit);

        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();
        setResult(data.message);
    } catch (error) {
        alert("Error buscando por coordenadas: " + error.message);
    }
    };


  return (
    <div>
      <h2>Buscar Localizaciones Cercanas</h2>

      {/* Por nombre */}
      <form onSubmit={searchByMember}>
        <h4>Por Miembro</h4>
        <select name="group" value={byNameData.group} onChange={e => handleChange(e, setByNameData)} required>
          <option value="">Seleccione un grupo</option>
          {groups.map(g => (
            <option key={g.key} value={g.key}>{g.label}</option>
          ))}
        </select>
        <input type="text" name="member" placeholder="Nombre" value={byNameData.member} onChange={e => handleChange(e, setByNameData)} required />
        <input type="number" name="radius" placeholder="Radio" value={byNameData.radius} onChange={e => handleChange(e, setByNameData)} required />
        <select name="unit" value={byNameData.unit} onChange={e => handleChange(e, setByNameData)}>
          <option value="km">km</option>
          <option value="m">m</option>
        </select>
        <button type="submit">Buscar por miembro</button>
      </form>

      {/* Por coordenadas */}
      <form onSubmit={searchByCoords}>
        <h4>Por Coordenadas</h4>
        <select name="group" value={byCoordData.group} onChange={e => handleChange(e, setByCoordData)} required>
          <option value="">Seleccione un grupo</option>
          {groups.map(g => (
            <option key={g.key} value={g.key}>{g.label}</option>
          ))}
        </select>
        <input type="number" name="longitude" placeholder="Longitud" value={byCoordData.longitude} onChange={e => handleChange(e, setByCoordData)} required />
        <input type="number" name="latitude" placeholder="Latitud" value={byCoordData.latitude} onChange={e => handleChange(e, setByCoordData)} required />
        <input type="number" name="radius" placeholder="Radio" value={byCoordData.radius} onChange={e => handleChange(e, setByCoordData)} required />
        <select name="unit" value={byCoordData.unit} onChange={e => handleChange(e, setByCoordData)}>
          <option value="km">km</option>
          <option value="m">m</option>
        </select>
        <button type="submit">Buscar por coordenadas</button>
      </form>

      {result && (
        <div>
          <h4>Resultados:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default NearbyLocation;

