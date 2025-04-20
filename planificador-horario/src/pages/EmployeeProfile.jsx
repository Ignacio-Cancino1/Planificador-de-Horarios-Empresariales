// src/pages/EmployeeProfile.jsx
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EmployeeProfile.module.css';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

export const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Datos simulados (luego puedes reemplazar con una API)
  const mockEmployees = [
    {
      id: 1,
      nombre: "Ana",
      apellido: "López",
      puesto: "Gerente de Ventas",
      foto: "https://randomuser.me/api/portraits/women/44.jpg",
      descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      estado: "Activo"
    },
    {
      id: 2,
      nombre: "Carlos",
      apellido: "Méndez",
      puesto: "Cajero Principal",
      foto: "https://randomuser.me/api/portraits/men/32.jpg",
      descripcion: "Experto en atención al cliente con 5 años de experiencia...",
      estado: "Activo"
    }
  ];

  const employee = mockEmployees.find(emp => emp.id === Number(id));

  if (!employee) {
    return <div>Empleado no encontrado</div>;
  }

  return (
    <div className={styles.profileContainer}>
      {/* Botón de regreso */}
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowLeft /> Volver
      </button>

      {/* Tarjeta de perfil */}
      <div className={styles.profileCard}>
        {/* Sección superior */}
        <div className={styles.profileHeader}>
          <img 
            src={employee.foto} 
            alt={`${employee.nombre} ${employee.apellido}`} 
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <h2>{employee.nombre} {employee.apellido}</h2>
            <p className={styles.position}>{employee.puesto}</p>
            <span className={`${styles.status} ${employee.estado === 'Activo' ? styles.active : styles.inactive}`}>
              {employee.estado}
            </span>
          </div>
        </div>

        {/* Descripción */}
        <div className={styles.profileDescription}>
          <h3>Descripción</h3>
          <p>{employee.descripcion}</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...</p>
        </div>

        {/* Botón de horarios */}
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