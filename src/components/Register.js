import React, { useState } from 'react';
import { registerUser } from '../api/authApi';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaUser, FaLock, FaQuestionCircle, FaKey, FaUserPlus, FaPen } from 'react-icons/fa';
import '../styles/Register.css';

function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    securityQuestion: '',
    securityAnswer: '',
    customQuestion: ''
  });
  const [showCustomQuestion, setShowCustomQuestion] = useState(false);

  const securityQuestions = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿Cuál es tu ciudad de nacimiento?",
    "¿Cuál es el nombre de tu escuela primaria?",
    "¿Cuál es tu comida favorita?",
    "¿Cuál es el segundo nombre de tu madre?",
    "Otra pregunta personalizada"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "securityQuestion") {
      const isCustom = value === "Otra pregunta personalizada";
      setShowCustomQuestion(isCustom);
      
      if (!isCustom) {
        setForm(prev => ({
          ...prev,
          securityQuestion: value,
          customQuestion: ''
        }));
      } else {
        setForm(prev => ({
          ...prev,
          securityQuestion: value
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalQuestion = showCustomQuestion ? form.customQuestion : form.securityQuestion;
    
    if (!finalQuestion || finalQuestion.trim() === '') {
      Swal.fire({
        title: 'Campo requerido',
        text: 'Por favor, proporciona una pregunta de seguridad',
        icon: 'warning',
        confirmButtonColor: '#6366f1',
        background: '#fff',
        color: '#2c3e50',
        iconColor: '#f59e0b',
        customClass: {
          popup: 'custom-swal-popup'
        }
      });
      return;
    }
    
    try {
      const userData = {
        username: form.username,
        password: form.password,
        securityQuestion: finalQuestion,
        securityAnswer: form.securityAnswer
      };
      
      await registerUser(userData);
      Swal.fire({
        title: '¡Registro exitoso!',
        text: 'Usuario creado correctamente',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff',
        color: '#2c3e50',
        iconColor: '#6366f1',
        customClass: {
          popup: 'custom-swal-popup'
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data || error.message,
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#fff',
        color: '#2c3e50',
        iconColor: '#ef4444',
        customClass: {
          popup: 'custom-swal-popup'
        }
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <div className="logo-circle">
              <FaUserPlus className="logo-icon" />
            </div>
          </div>
          <h1 className="register-title">Crear cuenta</h1>
          <p className="register-subtitle">Únete a nuestra comunidad</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                name="username"
                type="text"
                placeholder="Usuario"
                onChange={handleChange}
                value={form.username}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                onChange={handleChange}
                value={form.password}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaQuestionCircle className="input-icon" />
              <select
                name="securityQuestion"
                onChange={handleChange}
                value={form.securityQuestion}
                required
              >
                <option value="">Pregunta de seguridad</option>
                {securityQuestions.map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
            </div>
          </div>
          
          {showCustomQuestion && (
            <div className="form-group custom-question">
              <div className="input-wrapper">
                <FaPen className="input-icon" />
                <input
                  name="customQuestion"
                  type="text"
                  placeholder="Escribe tu pregunta personalizada"
                  onChange={handleChange}
                  value={form.customQuestion}
                  required={showCustomQuestion}
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaKey className="input-icon" />
              <input
                name="securityAnswer"
                type="text"
                placeholder="Respuesta de seguridad"
                onChange={handleChange}
                value={form.securityAnswer}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="register-button">
            <FaUserPlus className="button-icon" />
            Registrarse
          </button>
          
          <div className="login-prompt">
            <span>¿Ya tienes cuenta? </span>
            <Link to="/" className="login-link">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;