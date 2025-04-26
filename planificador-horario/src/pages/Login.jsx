import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const mockUsers = [
    {
      email: "admin@gmail.com",
      password: "2633",
      role: "admin"
    },
    {
      email: "user@gmail.com",
      password: "1234",
      role: "user"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const foundUser = mockUsers.find(
      user => user.email === username && user.password === password
    );

    if (foundUser) {
      const userData = { 
        email: foundUser.email,
        role: foundUser.role 
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate(foundUser.role === 'admin' ? '/dashboard' : '/user-dashboard');
    } else {
      setError('Credenciales incorrectas');
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