// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Home } from './pages/Homee';  // Asegúrate que coincida con el nombre del archivo
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { AssignShift } from './pages/AssignShift';

// Dentro de tu componente <Routes>
<Route path="/empleados/:id" element={<EmployeeProfile />} />

function App() {
  const [user, setUser] = useState(null); // Ahora user será un objeto { email }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/empleados"
          element={<Employees />} />
        <Route
          path="/empleados/:id"
          element={<EmployeeProfile />} />
        <Route
          path="/asignar-turno"
          element={<AssignShift />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // <- Exportación default (clave)*-