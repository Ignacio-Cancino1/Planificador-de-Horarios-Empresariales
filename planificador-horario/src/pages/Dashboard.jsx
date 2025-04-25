// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { FaUsers, FaSignOutAlt } from 'react-icons/fa'; // Añadimos ícono

export const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleViewEmployees = () => {
    navigate('/empleados'); // Redirige a la lista de empleados
  };
  
  const handleAssignShift = () => {
    navigate('/asignar-turno');
  };
  const handleViewCalendar = () => {
    navigate('/calendario-turnos');
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
          <FaUsers /> Ver empleados {/* Ícono + texto */}
      </button>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        <FaSignOutAlt /> Cerrar sesión
      </button>
    </div>
  );
};
