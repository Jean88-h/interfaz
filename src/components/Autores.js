import React, { useEffect, useState } from 'react';
import { getAutores, createAutor } from '../api/autorApi';
import { FaUser, FaUserPlus, FaCalendarAlt, FaSpinner, FaSearch, FaTimes } from 'react-icons/fa';
import '../styles/Autores.css';

const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAutor, setNewAutor] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        setLoading(true);
        const { data } = await getAutores();
        setAutores(data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener autores:', error);
        setError('Error al cargar los autores. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchAutores();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAutor({
      ...newAutor,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      const autorToCreate = {
        nombre: newAutor.nombre.trim(),
        apellido: newAutor.apellido.trim(),
        fechaNacimiento: newAutor.fechaNacimiento
      };
      await createAutor(autorToCreate);
      setNewAutor({
        nombre: '',
        apellido: '',
        fechaNacimiento: ''
      });
      setShowForm(false);
      const { data } = await getAutores();
      setAutores(data);
      setError(null);
    } catch (error) {
      console.error('Error al crear autor:', error);
      setError(error.response?.data?.message || 'Error al crear el autor. Verifica los datos.');
    } finally {
      setIsCreating(false);
    }
  };

  const getInitials = (nombre, apellido) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const autoresFiltrados = autores.filter(autor =>
    `${autor.nombre} ${autor.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setNewAutor({
        nombre: '',
        apellido: '',
        fechaNacimiento: ''
      });
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="autores-container">
        <div className="loading-container">
          <div className="loading-spinner">
            <FaSpinner className="fa-spin" />
          </div>
          <p className="loading-text">Cargando autores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="autores-container">
      <div className="content-header">
        <div className="breadcrumb">
          <span>Dashboard</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Autores</span>
        </div>
        <div className="header-actions">
          <div className="autores-count">{autores.length} {autores.length === 1 ? 'autor' : 'autores'}</div>
          <button 
            className="add-button"
            onClick={toggleForm}
          >
            <FaUserPlus />
            <span>Agregar Autor</span>
          </button>
        </div>
      </div>
      
      <div className="content-container">
        <div className="section-header">
          <h2 className="section-title">Directorio de Autores</h2>
          <div className="search-container">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre o apellido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {showForm && (
          <div className="create-autor-form">
            <div className="form-header">
              <h3 className="form-title">Agregar Nuevo Autor</h3>
              <button className="close-form" onClick={toggleForm}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={newAutor.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre del autor"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      id="apellido"
                      type="text"
                      name="apellido"
                      value={newAutor.apellido}
                      onChange={handleInputChange}
                      placeholder="Apellido del autor"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                  <div className="input-wrapper">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      id="fechaNacimiento"
                      type="date"
                      name="fechaNacimiento"
                      value={newAutor.fechaNacimiento}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <FaSpinner className="fa-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      Crear Autor
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={toggleForm}
                >
                  Cancelar
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        )}
        
        {autoresFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaUser />
            </div>
            <h3 className="empty-title">No se encontraron autores</h3>
            <p className="empty-description">
              {searchTerm 
                ? `No se encontraron autores con "${searchTerm}"`
                : 'Comienza agregando tu primer autor usando el botón "Agregar Autor"'
              }
            </p>
            {!searchTerm && (
              <button 
                className="empty-action"
                onClick={toggleForm}
              >
                <FaUserPlus />
                Agregar Primer Autor
              </button>
            )}
          </div>
        ) : (
          <div className="autor-grid">
            {autoresFiltrados.map((autor) => (
              <div key={autor.autorLibroGuid} className="autor-card">
                <div className="autor-header">
                  <div className="autor-initials">
                    {getInitials(autor.nombre, autor.apellido)}
                  </div>
                  <h3 className="autor-name">{autor.nombre} {autor.apellido}</h3>
                </div>
                <div className="autor-content">
                  <div className="autor-meta">
                    <div className="meta-item">
                      <FaCalendarAlt className="meta-icon" />
                      <span>{new Date(autor.fechaNacimiento).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Autores;