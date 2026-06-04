import api from './axiosConfig';

export const getUsers = async () => {
  try {
    const res = await api.get('/personas');
    return res.data.data; // El controlador devuelve { status: 'ok', data: [...] }
  } catch (error) {
    throw new Error('Error al obtener la lista de usuarios');
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/personas/${id}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al eliminar el usuario');
  }
};

export const addUser = async (userData) => {
  try {
    const res = await api.post('/personas', userData);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error de conexión al guardar el usuario');
  }
};

export const getUserById = async (id) => {
  try {
    const res = await api.get(`/personas/${id}`);
    return res.data.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al obtener los datos del usuario');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await api.put(`/personas/${id}`, userData);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error de conexión al actualizar el usuario');
  }
};
