// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export const Home = () => {
  return (
    <div className={styles.home}>
      <h1>Bienvenido al Planificador de Horarios</h1>
      <p>Gestiona los turnos de tu equipo de manera eficiente.</p>
      <Link to="/login" className={styles.button}>
        Iniciar Sesión
      </Link>
    </div>
  );
};