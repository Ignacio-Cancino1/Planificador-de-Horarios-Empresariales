// src/pages/Employees.jsx
import { useState } from 'react';
import { FaUser, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './Employees.module.css';

export const Employees = () => {
  const navigate = useNavigate();

  // Datos de ejemplo (simulados)
  const employeesData = [
    {
      id: 1,
      nombre: "Ana",
      apellido: "López",
      email: "ana@empresa.com",
      telefono: "+56912345678",
      rol: "Gerente",
      estado: "Activo"
    },
    {
      id: 2,
      nombre: "Carlos",
      apellido: "Méndez",
      email: "carlos@empresa.com",
      telefono: "+56987654321",
      rol: "Cajero",
      estado: "Activo"
    },
    {
      id: 3,
      nombre: "María",
      apellido: "González",
      email: "maria@empresa.com",
      telefono: "+56955551234",
      rol: "Supervisor",
      estado: "Inactivo"
    }
  ];

  const [employees] = useState(employeesData);

  const handleViewProfile = (employeeId) => {
    navigate(`/empleados/${employeeId}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1><FaUser /> Lista de Empleados</h1>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.employeeTable}>
          <thead>
            <tr>
              <th>Perfil</th>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <button 
                    onClick={() => handleViewProfile(employee.id)}
                    className={styles.profileButton}
                    aria-label={`Ver perfil de ${employee.nombre}`}
                  >
                    <FaEye />
                  </button>
                </td>
                <td>{employee.id}</td>
                <td>{employee.nombre}</td>
                <td>{employee.apellido}</td>
                <td>{employee.email}</td>
                <td>{employee.telefono}</td>
                <td>{employee.rol}</td>
                <td>
                  <span className={`${styles.status} ${
                    employee.estado === 'Activo' ? styles.active : styles.inactive
                  }`}>
                    {employee.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};