// src/pages/AssignShift.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AssignShift.module.css';

// Datos simulados
const mockEmployees = [
  { id: 1, nombre: "Ana López", rol: "Gerente" },
  { id: 2, nombre: "Carlos Méndez", rol: "Cajero" },
  { id: 3, nombre: "María González", rol: "Supervisor" }
];

const shiftOptions = [
  { id: 1, label: "Mañana (08:00 - 14:00)" },
  { id: 2, label: "Tarde (14:00 - 20:00)" },
  { id: 3, label: "Noche (20:00 - 08:00)" }
];

export const AssignShift = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    shiftId: '',
    date: new Date().toISOString().split('T')[0] // Fecha actual por defecto
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.employeeId || !formData.shiftId) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Aquí iría la lógica para guardar en el backend
    console.log('Turno asignado:', {
      ...formData,
      employee: mockEmployees.find(e => e.id === Number(formData.employeeId))
    });

    // Mensaje de éxito y reset
    setSuccessMessage('¡Turno asignado correctamente!');
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <h1>Asignar Nuevo Turno</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="employeeId">Empleado:</label>
          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un empleado</option>
            {mockEmployees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.nombre} ({employee.rol})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="shiftId">Turno:</label>
          <select
            id="shiftId"
            name="shiftId"
            value={formData.shiftId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un turno</option>
            {shiftOptions.map(shift => (
              <option key={shift.id} value={shift.id}>
                {shift.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Confirmar Turno
        </button>

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};