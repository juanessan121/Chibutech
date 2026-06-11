import axios from './axiosConfig';

export const getNotificaciones = async () => {
  const { data } = await axios.get('/notificaciones');
  return data;
};

export const marcarLeida = async (id) => {
  const { data } = await axios.patch(`/notificaciones/${id}/leida`);
  return data;
};

export const marcarTodasLeidas = async () => {
  const { data } = await axios.post('/notificaciones/leidas');
  return data;
};
