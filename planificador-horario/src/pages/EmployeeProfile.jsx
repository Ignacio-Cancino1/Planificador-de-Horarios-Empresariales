import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './EmployeeProfile.module.css';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

export const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = storedUser?.token;

        if (!token) {
          setError("No se encontró token de autenticación.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/empleados/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setEmployee(response.data);
      } catch (err) {
        console.error("❌ Error al cargar el empleado:", err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <div>Cargando empleado...</div>;
  if (error || !employee) return <div>{error || "Empleado no encontrado"}</div>;

  return (
    <div className={styles.profileContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowLeft /> Volver
      </button>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <img 
            src={`https://randomuser.me/api/portraits/${employee.rol === 'admin' ? 'women' : 'men'}/${employee.id_empleado % 50}.jpg`} 
            alt={`${employee.nombre} ${employee.apellido}`} 
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <h2>{employee.nombre} {employee.apellido}</h2>
            <p className={styles.position}>{employee.rol}</p>
            <span className={`${styles.status} ${employee.estado === 'Activo' ? styles.active : styles.inactive}`}>
              {employee.estado || "Activo"}
            </span>
          </div>
        </div>

        <div className={styles.profileDescription}>
          <h3>Descripción</h3>
          <p>{employee.descripcion || "Sin descripción disponible."}</p>
        </div>

        <button 
          onClick={() => navigate(`/empleados/${id}/horarios`)} 
          className={styles.scheduleButton}
        >
          <FaCalendarAlt /> Ver horarios disponibles
        </button>
      </div>
    </div>
  );
};
