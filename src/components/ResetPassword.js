import React, { useState } from 'react';
import { resetPassword } from '../api/authApi';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUser, FaKey, FaLock, FaRedoAlt, FaArrowLeft } from 'react-icons/fa';
import '../styles/ResetPassword.css';

function ResetPassword() {
  const [form, setForm] = useState({
    username: '',
    securityAnswer: '',
    newPassword: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(form);
      Swal.fire({
        title: '¡Contraseña actualizada!',
        text: 'Tu contraseña ha sido restablecida exitosamente',
        icon: 'success',
        confirmButtonColor: '#f59e0b',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff',
        color: '#2c3e50',
        iconColor: '#f59e0b',
        customClass: {
          popup: 'custom-swal-popup'
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data || error.message,
        icon: 'error',
        confirmButtonColor: '#f59e0b',
        background: '#fff',
        color: '#2c3e50',
        iconColor: '#ef4444',
        customClass: {
          popup: 'custom-swal-popup'
        }
      });
    }
  };

  // Función para calcular fortaleza de contraseña
  const getPasswordStrength = () => {
    if (!form.newPassword) return '';
    if (form.newPassword.length < 6) return 'Débil';
    if (form.newPassword.length < 10) return 'Moderada';
    return 'Fuerte';
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <div className="reset-header">
          <div className="logo-container">
            <div className="logo-circle">
              <FaRedoAlt className="logo-icon" />
            </div>
          </div>
          <h1 className="reset-title">Restablecer Contraseña</h1>
          <p className="reset-subtitle">Recupera tu acceso a la plataforma</p>
        </div>
        
        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                name="username"
                type="text"
                placeholder="Usuario"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaKey className="input-icon" />
              <input
                name="securityAnswer"
                type="text"
                placeholder="Respuesta de seguridad"
                value={form.securityAnswer}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                name="newPassword"
                type="password"
                placeholder="Nueva contraseña"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            {form.newPassword && (
              <div className="password-strength">
                Fortaleza: <span className={`strength-${getPasswordStrength().toLowerCase()}`}>{getPasswordStrength()}</span>
              </div>
            )}
          </div>
          
          <button type="submit" className="reset-button">
            <FaRedoAlt className="button-icon" />
            Restablecer contraseña
          </button>
          
          <div className="back-to-login">
            <Link to="/" className="back-link">
              <FaArrowLeft className="back-icon" />
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;