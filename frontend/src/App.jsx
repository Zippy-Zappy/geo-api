// src/App.jsx
import React, { useEffect, useState } from 'react';
import './App.css';

import CreateLocation from './components/CreateLocation';
import ReadLocation from './components/ReadLocation';
import UpdateLocation from './components/UpdateLocation';
import DeleteLocation from './components/DeleteLocation';
import NearbyLocation from './components/NearbyLocation';

function App() {
  const [groups, setGroups] = useState([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/groups`)
      .then(res => res.json())
      .then(data => setGroups(data));
  }, []);

  return (
    <div className="container">
      <h1>Administrador de Localizaciones (CRUD + Nearby)</h1>
      <CreateLocation groups={groups} apiUrl={apiUrl} />
      <ReadLocation groups={groups} apiUrl={apiUrl} />
      <UpdateLocation apiUrl={apiUrl} />
      <DeleteLocation groups={groups} apiUrl={apiUrl} />
      <NearbyLocation groups={groups} apiUrl={apiUrl} />
    </div>
  );
}

export default App;

// import React, { useEffect, useState } from 'react';

// function App() {
//   const [groups, setGroups] = useState([]);
//   const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
//   const [formData, setFormData] = useState({
//     group: '',
//     name: '',
//     longitude: '',
//     latitude: '',
//   });

//   useEffect(() => {
//     fetch(`${apiUrl}/groups`)
//       .then(res => res.json())
//       .then(data => setGroups(data));
//   }, []);

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = e => {
//     e.preventDefault();
//     fetch(`${apiUrl}/create`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData)
//     })
//       .then(res => res.json())
//       .then(data => alert(data.message));
//   };

//   return (
//     <div>
//       <h1>Crear Localización</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Grupo:</label>
//           <select name="group" onChange={handleChange} value={formData.group} required>
//             <option value="">Seleccione un grupo</option>
//             {groups.map(g => (
//               <option key={g.key} value={g.key}>{g.label}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label>Nombre:</label>
//           <input type="text" name="name" onChange={handleChange} value={formData.name} required />
//         </div>
//         <div>
//           <label>Longitud:</label>
//           <input type="number" name="longitude" onChange={handleChange} value={formData.longitude} required />
//         </div>
//         <div>
//           <label>Latitud:</label>
//           <input type="number" name="latitude" onChange={handleChange} value={formData.latitude} required />
//         </div>
//         <button type="submit">Crear</button>
//       </form>
//     </div>
//   );
// }

// export default App;
