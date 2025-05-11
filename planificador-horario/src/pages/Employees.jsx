import { useEffect, useState } from "react";
import { FaUser, FaEye, FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Employees.module.css";
import api from "../services/api";

export const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: "",
  });

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/empleados");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleViewProfile = (employeeId) => {
    navigate(`/empleados/${employeeId}`);
  };

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async () => {
    try {
      await api.post("/empleados", newEmployee);
      setShowModal(false);
      setNewEmployee({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        rol: "",
      });
      fetchEmployees();
    } catch (err) {
      console.error("Error al agregar empleado:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!id || typeof id !== "number") {
      console.error("ID inválido al intentar eliminar:", id);
      return;
    }

    try {
      await api.delete(`/empleados/${id}`);
      setEmployees((prev) => prev.filter((e) => e.id_empleado !== id));
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <FaArrowLeft /> Volver
        </button>
        <h1>
          <FaUser /> Lista de Empleados
        </h1>
        <button onClick={() => setShowModal(true)} className={styles.addButton}>
          <FaPlus /> Agregar Empleado
        </button>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id_empleado}>
                <td>
                  <button
                    onClick={() => handleViewProfile(employee.id_empleado)}
                    className={styles.profileButton}
                  >
                    <FaEye />
                  </button>
                </td>
                <td>{employee.id_empleado}</td>
                <td>{employee.nombre}</td>
                <td>{employee.apellido}</td>
                <td>{employee.email}</td>
                <td>{employee.telefono}</td>
                <td>{employee.rol}</td>
                <td>
                  <button
                    onClick={() => handleDelete(employee.id_empleado)}
                    className={styles.deleteButton}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Agregar Nuevo Empleado</h2>
            <input
              name="nombre"
              placeholder="Nombre"
              value={newEmployee.nombre}
              onChange={handleChange}
            />
            <input
              name="apellido"
              placeholder="Apellido"
              value={newEmployee.apellido}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Correo"
              value={newEmployee.email}
              onChange={handleChange}
            />
            <input
              name="telefono"
              placeholder="Teléfono"
              value={newEmployee.telefono}
              onChange={handleChange}
            />
            <select
              name="rol"
              value={newEmployee.rol}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="empleado">Empleado</option>
            </select>
            <div className={styles.actions}>
              <button onClick={handleAddEmployee}>Agregar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
