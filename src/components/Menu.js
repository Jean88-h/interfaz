import { useNavigate } from 'react-router-dom';
import { FaBook, FaPenAlt, FaSignOutAlt, FaUser, FaHome } from 'react-icons/fa';
import '../styles/Menu.css';

const Menu = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <div className="menu-container">
      <div className="menu-card">
        <div className="menu-header">
          <div className="logo-container">
            <div className="logo-circle">
              <FaUser className="logo-icon" />
            </div>
          </div>
          <h2 className="menu-title">Bienvenido, {username}</h2>
          <p className="menu-subtitle">Panel de control</p>
        </div>
        
        <nav className="menu-nav">
          <div className="menu-section">
            <h3 className="section-title">Navegación</h3>
            <ul className="menu-list">
              <li className="menu-item">
                <button 
                  className="menu-button" 
                  onClick={() => navigate('/menu')}
                >
                  <span className="menu-icon">
                    <FaHome />
                  </span>
                  <span className="menu-label">Inicio</span>
                </button>
              </li>
              <li className="menu-item">
                <button 
                  className="menu-button" 
                  onClick={() => navigate('/menu/libros')}
                >
                  <span className="menu-icon">
                    <FaBook />
                  </span>
                  <span className="menu-label">Libros</span>
                </button>
              </li>
              <li className="menu-item">
                <button 
                  className="menu-button" 
                  onClick={() => navigate('/menu/autores')}
                >
                  <span className="menu-icon">
                    <FaPenAlt />
                  </span>
                  <span className="menu-label">Autores</span>
                </button>
              </li>
            </ul>
          </div>
          
          <div className="menu-footer">
            <button 
              className="logout-button" 
              onClick={handleLogout}
            >
              <span className="menu-icon">
                <FaSignOutAlt />
              </span>
              <span className="menu-label">Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </div>
      
      
    </div>
  );
};

export default Menu;