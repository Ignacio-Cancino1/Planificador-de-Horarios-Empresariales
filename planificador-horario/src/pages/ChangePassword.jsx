// src/pages/ChangePassword.jsx

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import api from '../services/api';

export const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id_usuario = location.state?.id_usuario;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!id_usuario) {
      setError('ID de usuario no válido.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await api.put(`/usuarios/${id_usuario}/cambiar-clave`, {
        nueva_clave: newPassword
      });

      setSuccess('Contraseña actualizada correctamente. Redirigiendo al login...');

      // ✅ Limpiamos sesión y redirigimos
      localStorage.removeItem('user');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      console.error("❌ Error al cambiar contraseña:", err);
      setError('Ocurrió un error al actualizar la contraseña.');
    }
  };

  return (
    <div className={styles.login}>
      <h2>Cambiar Contraseña</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Guardar nueva contraseña</button>
      </form>
    </div>
  );
};
