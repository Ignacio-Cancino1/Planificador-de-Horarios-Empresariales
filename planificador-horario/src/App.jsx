// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Home } from './pages/Home';  // Asegúrate que coincida con el nombre del archivo
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

function App() { // <- Componente principal
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // <- Exportación default (clave)*-