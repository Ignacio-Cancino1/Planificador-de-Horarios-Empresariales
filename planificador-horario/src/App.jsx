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
import { ChangePassword } from './pages/ChangePassword';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.token) {
        setUser(parsedUser);
      } else {
        localStorage.removeItem('user');
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
        <Route path="/" element={<Home user={user} />} />

        <Route 
          path="/login" 
          element={
            user
              ? user.requiere_cambio_clave
                ? <Navigate to="/cambiar-clave" replace />
                : <Navigate to={user.role === 'admin' ? '/dashboard' : '/user-dashboard'} replace />
              : <Login setUser={setUser} />
          }
        />

        <Route element={<ProtectedRoute user={user} requiredRole="admin" />}>
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
          <Route path="/empleados" element={<Employees />} />
          <Route path="/empleados/:id" element={<EmployeeProfile />} />
          <Route path="/asignar-turno" element={<AssignShift />} />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/user-dashboard" element={<UserDashboard user={user} setUser={setUser} />} />
          <Route path="/calendario-turnos" element={<ShiftCalendar />} />
          <Route path="/reportes" element={<ReportsPage />} />
        </Route>

        <Route path="/cambiar-clave" element={<ChangePassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
