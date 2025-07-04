// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { FaUsers, FaSignOutAlt, FaChartBar } from 'react-icons/fa';

export const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');   // ✅ Limpia localStorage
    setUser(null);                     // ✅ Borra estado del usuario
    navigate('/login');                // ✅ Redirige al login
  };

  const handleViewEmployees = () => {
    navigate('/empleados');
  };

  const handleAssignShift = () => {
    navigate('/asignar-turno');
  };

  const handleViewCalendar = () => {
    navigate('/calendario-turnos');
  };

  const handleViewReports = () => {
    navigate('/reportes');
  };

  return (
    <div className={styles.dashboard}>
      <h1>¡Hola, {user?.email}!</h1>
      <p>Aquí podrás gestionar los horarios de tu equipo.</p>
      
      <div className={styles.quickActions}>
        <button onClick={handleViewCalendar}>
          Ver Calendario de Turnos
        </button>
        <button onClick={handleAssignShift}>
          Asignar Turno
        </button>
        <button onClick={handleViewEmployees}>
          <FaUsers /> Ver empleados
        </button>
        <button onClick={handleViewReports} className={styles.reportButton}>
          <FaChartBar /> Ver Reportes
        </button>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        <FaSignOutAlt /> Cerrar sesión
      </button>
    </div>
  );
};
