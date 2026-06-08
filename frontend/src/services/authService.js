import api from './axiosConfig';

export const login = async (cedula, password) => {
  try {
    const response = await api.post('/auth/login', { cedula, password });
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al conectar con el servidor. Verifica tus credenciales.');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error al cerrar sesión', error);
  }
};

export const forgotPassword = async (cedula) => {
  try {
    const response = await api.post('/auth/forgot-password', { cedula });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al enviar la contraseña temporal. Intenta de nuevo.');
  }
};

export const cambiarPasswordTemporal = async (nueva_password, confirmar_password) => {
  try {
    const response = await api.post('/auth/cambiar-password-temporal', {
      nueva_password,
      confirmar_password,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al actualizar la contraseña. Intenta de nuevo.');
  }
};
