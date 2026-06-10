import axios from './axiosConfig';

export const programarMinga = async (mingaData) => {
  const { data } = await axios.post('/mingas', mingaData);
  return data;
};

export const getMingas = async () => {
  const { data } = await axios.get('/mingas');
  return data.data;
};

export const getMingasActivas = async () => {
  const { data } = await axios.get('/mingas/activas');
  return data.data;
};

export const getConvocados = async (idMinga) => {
  const { data } = await axios.get(`/mingas/${idMinga}/convocados`);
  return data.data;
};

export const registrarAsistencia = async (idMinga, asistenciaData) => {
  const { data } = await axios.post(`/mingas/${idMinga}/asistencia`, asistenciaData);
  return data;
};

export const actualizarMinga = async (idMinga, payload) => {
  const { data } = await axios.put(`/mingas/${idMinga}`, payload);
  return data;
};
