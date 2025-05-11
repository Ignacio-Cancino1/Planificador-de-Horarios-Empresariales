import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { Home } from './pages/Homee';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UserDashboard } from './pages/UserDashboard';
import { Employees } from './pages/Employees';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { AssignShift } from './pages/AssignShift';
import { ShiftCalendar } from './pages/ShiftCalendar';
import { ReportsPage } from './pages/ReportsPage';
import { Unauthorized } from './pages/Unauthorized';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Verificamos si contiene un token válido
      if (parsedUser.token) {
        setUser(parsedUser);
      } else {
        localStorage.removeItem('user'); // Si no hay token, limpiamos localStorage
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Página de inicio pública */}
        <Route path="/" element={<Home user={user} />} />

        {/* Página de login - solo visible si no hay sesión activa */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate 
                to={user.role === 'admin' ? '/dashboard' : '/user-dashboard'} 
                replace 
              />
            ) : (
              <Login setUser={setUser} />
            )
          } 
        />

        {/* Rutas protegidas para ADMIN */}
        <Route element={<ProtectedRoute user={user} requiredRole="admin" />}>
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
          <Route path="/empleados" element={<Employees />} />
          <Route path="/empleados/:id" element={<EmployeeProfile />} />
          <Route path="/asignar-turno" element={<AssignShift />} />
        </Route>

        {/* Rutas protegidas para USUARIO */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/user-dashboard" element={<UserDashboard user={user} setUser={setUser} />} />
          <Route path="/calendario-turnos" element={<ShiftCalendar />} />
          <Route path="/reportes" element={<ReportsPage />} />
        </Route>

        {/* Página para acceso no autorizado */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
