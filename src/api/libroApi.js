import axios from 'axios';

const API_URL = 'https://libromicro.somee.com/api/LibroMaterial';

// Función para formatear fechas para el backend
const formatDateForBackend = (dateString) => {
  if (!dateString) return null;
  const localDate = new Date(dateString);
  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      0, 0, 0, 0
    )
  ).toISOString();
};

export const getLibros = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const getLibroById = async (id) => {
  const token = localStorage.getItem('token');
  return await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const createLibro = async (libroData) => {
  const token = localStorage.getItem('token');
  
  const payload = {
    titulo: libroData.titulo,
    fechaPublicacion: formatDateForBackend(libroData.fechaPublicacion),
    autorLibro: libroData.autorLibro
  };

  return await axios.post(API_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};