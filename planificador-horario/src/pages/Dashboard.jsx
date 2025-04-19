// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
// src/pages/Dashboard.jsx
import styles from './Dashboard.module.css'; // <- Ruta correcta

export const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Elimina el usuario (simulado)
    navigate('/'); // Redirige al home
  };

  return (
    <div className={styles.dashboard}>
      <h1>¡Hola, {user}!</h1>
      <p>Aquí podrás gestionar los horarios de tu equipo.</p>
      
      <div className={styles.quickActions}>
        <button>Crear horario</button>
        <button>Ver empleados</button>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Cerrar sesión
      </button>
    </div>
  );
};