import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Usuario y contraseña ficticios
  const mockUser = {
    email: "admin@gmail.com",
    password: "2633" // Contraseña de ejemplo
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación simulada
    if (username === mockUser.email && password === mockUser.password) {
      setUser({ email: username }); // Guarda el usuario en el estado global
      navigate('/dashboard'); // Redirige al dashboard
    } else {
      setError('Credenciales incorrectas'); // Mensaje de error
    }
  };

  return (
    <div className={styles.login}>
      <h2>Iniciar Sesión</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
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