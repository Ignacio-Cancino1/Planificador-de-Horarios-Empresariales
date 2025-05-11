// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { login } from '../services/auth';

export const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        login: username,
        password: password
      });

      // 🔍 Normalizamos el rol recibido
      const userRole = res.rol?.trim().toLowerCase();
      console.log("✅ Rol recibido del backend:", res.rol, "→ procesado como:", userRole);

      const userData = {
        email: username,
        role: userRole,
        token: res.token,
        id_usuario: res.id_usuario,
        id_empleado: res.id_empleado
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // ✅ Redirige de forma segura según rol
      navigate(userRole === 'admin' ? '/dashboard' : '/user-dashboard');

    } catch (err) {
      console.error("❌ Error en login:", err.response?.data || err.message);
      setError('Credenciales incorrectas o error en el servidor');
    }
  };

  return (
    <div className={styles.login}>
      <h2>Iniciar Sesión</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico o RUT"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};
