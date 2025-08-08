import React, { useEffect, useState } from 'react';
import { getLibros, createLibro } from '../api/libroApi';
import { getAutores } from '../api/autorApi';
import { FaBook, FaCalendarAlt, FaUserEdit, FaPlus, FaSpinner, FaSearch, FaTimes } from 'react-icons/fa';
import '../styles/Libros.css';

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLibro, setNewLibro] = useState({
    titulo: '',
    fechaPublicacion: '',
    autorLibro: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [librosRes, autoresRes] = await Promise.all([
          getLibros(),
          getAutores()
        ]);
        setLibros(librosRes.data);
        setAutores(autoresRes.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('Error al cargar los datos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLibro({
      ...newLibro,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      await createLibro(newLibro);
      
      setNewLibro({
        titulo: '',
        fechaPublicacion: '',
        autorLibro: ''
      });
      setShowForm(false);
      
      const { data } = await getLibros();
      setLibros(data);
      setError(null);
    } catch (error) {
      console.error('Error al crear libro:', error);
      setError(error.response?.data?.message || 'Error al crear el libro. Verifica los datos.');
    } finally {
      setIsCreating(false);
    }
  };

  const librosFiltrados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setNewLibro({
        titulo: '',
        fechaPublicacion: '',
        autorLibro: ''
      });
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="libros-container">
        <div className="loading-container">
          <div className="loading-spinner">
            <FaSpinner className="fa-spin" />
          </div>
          <p className="loading-text">Cargando libros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="libros-container">
      <div className="content-header">
        <div className="breadcrumb">
          <span>Dashboard</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Libros</span>
        </div>
        <div className="header-actions">
          <div className="libros-count">{libros.length} {libros.length === 1 ? 'libro' : 'libros'}</div>
          <button 
            className="add-button"
            onClick={toggleForm}
          >
            <FaPlus />
            <span>Agregar Libro</span>
          </button>
        </div>
      </div>
      
      <div className="content-container">
        <div className="section-header">
          <h2 className="section-title">Biblioteca de Libros</h2>
          <div className="search-container">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por título..."
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
          <div className="create-libro-form">
            <div className="form-header">
              <h3 className="form-title">Agregar Nuevo Libro</h3>
              <button className="close-form" onClick={toggleForm}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="titulo">Título</label>
                  <div className="input-wrapper">
                    <FaBook className="input-icon" />
                    <input
                      id="titulo"
                      type="text"
                      name="titulo"
                      value={newLibro.titulo}
                      onChange={handleInputChange}
                      placeholder="Título del libro"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="fechaPublicacion">Fecha de Publicación</label>
                  <div className="input-wrapper">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      id="fechaPublicacion"
                      type="date"
                      name="fechaPublicacion"
                      value={newLibro.fechaPublicacion}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="autorLibro">Autor</label>
                  <div className="input-wrapper">
                    <FaUserEdit className="input-icon" />
                    <select
                      id="autorLibro"
                      name="autorLibro"
                      value={newLibro.autorLibro}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione un autor</option>
                      {autores.map(autor => (
                        <option key={autor.autorLibroGuid} value={autor.autorLibroGuid}>
                          {autor.nombre} {autor.apellido}
                        </option>
                      ))}
                    </select>
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
                      <FaPlus />
                      Crear Libro
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
        
        {librosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaBook />
            </div>
            <h3 className="empty-title">No hay libros registrados</h3>
            <p className="empty-description">
              {searchTerm 
                ? `No se encontraron libros con "${searchTerm}"`
                : 'Comienza agregando tu primer libro usando el botón "Agregar Libro"'
              }
            </p>
            {!searchTerm && (
              <button 
                className="empty-action"
                onClick={toggleForm}
              >
                <FaPlus />
                Agregar Primer Libro
              </button>
            )}
          </div>
        ) : (
          <div className="libro-grid">
            {librosFiltrados.map((libro) => {
              const autor = autores.find(a => a.autorLibroGuid === libro.autorLibro);
              return (
                <div key={libro.libroGuid} className="libro-card">
                  <div className="libro-header">
                    <div className="libro-icon">
                      <FaBook />
                    </div>
                    <h3 className="libro-title">{libro.titulo}</h3>
                  </div>
                  <div className="libro-content">
                    <div className="libro-meta">
                      <div className="meta-item">
                        <FaCalendarAlt className="meta-icon" />
                        <span>{new Date(libro.fechaPublicacion).toLocaleDateString()}</span>
                      </div>
                      <div className="meta-item">
                        <FaUserEdit className="meta-icon" />
                        <span>{autor ? `${autor.nombre} ${autor.apellido}` : 'Autor desconocido'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Libros;