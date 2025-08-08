import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import Swal from 'sweetalert2';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Login.css';
import { useAuth } from '../hooks/useAuth';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
};

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, setIsAuthenticated } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(form);
      const accessToken = data.token;
      const refreshToken = data.refreshToken;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', form.username);

      setIsAuthenticated(true);

      Swal.fire({
        title: '¡Acceso concedido!',
        text: 'Redirigiendo a tu cuenta...',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#fff',
        color: '#2c3e50',
        iconColor: '#6366f1',
        customClass: { popup: 'custom-swal-popup' },
      }).then(() => {
        navigate('/menu');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error de acceso',
        text: error.response?.data || error.message,
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#fff',
        color: '#2c3e50',
        iconColor: '#ef4444',
        customClass: { popup: 'custom-swal-popup' },
      });
    }
  };

  const handleLogout = () => {
    logout();
    Swal.fire({
      title: 'Sesión cerrada',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
      background: '#fff',
      color: '#2c3e50',
      iconColor: '#6366f1',
    }).then(() => {
      navigate('/login');
    });
  };

  if (isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Hola, {localStorage.getItem('username')}</h2>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="button-icon" /> Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-circle">
              <FaUser className="logo-icon" />
            </div>
          </div>
          <h1 className="login-title">Bienvenido de vuelta</h1>
          <p className="login-subtitle">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                name="username"
                type="text"
                placeholder="Usuario"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                onChange={handleChange}
                required
              />
              <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <div className="form-options">
            <Link to="/reset" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="login-button">
            <FaSignInAlt className="button-icon" />
            Iniciar Sesión
          </button>

          <div className="register-prompt">
            <span>¿No tienes cuenta? </span>
            <Link to="/register" className="register-link">
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
