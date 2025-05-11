// src/pages/UserDashboard.jsx
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { FaSignOutAlt, FaCalendarAlt, FaChartBar } from 'react-icons/fa';

export const UserDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');   // ✅ Limpia sesión
    if (typeof setUser === 'function') {
      setUser(null);
    }
    navigate('/login');                // ✅ Redirige al login
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
      <p>Panel de usuario - Gestión de turnos</p>
      
      <div className={styles.quickActions}>
        <button onClick={handleViewCalendar}>
          <FaCalendarAlt /> Ver Calendario
        </button>
        
        <button onClick={handleViewReports}>
          <FaChartBar /> Ver Reportes
        </button>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        <FaSignOutAlt /> Cerrar sesión
      </button>
    </div>
  );
};
