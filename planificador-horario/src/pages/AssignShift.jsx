import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AssignShift.module.css';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';

export const AssignShift = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    shiftId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Cargar empleados y turnos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await api.get('/empleados');
        const shiftRes = await api.get('/turnos');
        setEmployees(empRes.data);
        setShifts(shiftRes.data);
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
        setError('Error al cargar datos');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.employeeId || !formData.shiftId || !formData.date) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      await api.post('/asignaciones', {
        id_empleado: parseInt(formData.employeeId),
        id_turno: parseInt(formData.shiftId),
        fecha_asignacion: formData.date + ' 00:00:00'
      });

      setSuccessMessage('¡Turno asignado correctamente!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error("❌ Error al asignar turno:", err.response?.data || err.message);
      setError('Error al asignar el turno.');
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowLeft /> Volver
      </button>

      <h1>Asignar Turno</h1>

      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

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
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre} {emp.apellido} ({emp.rol})
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
            {shifts.map(shift => (
              <option key={shift.id} value={shift.id}>
                {shift.descripcion} ({shift.hora_inicio} - {shift.hora_fin})
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
          Asignar Turno
        </button>
      </form>
    </div>
  );
};
