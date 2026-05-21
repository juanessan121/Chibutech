import axios from './axiosConfig';

export const programarMinga = async (mingaData) => {
  const { data } = await axios.post('/mingas', mingaData);
  return data;
};

export const getMingas = async () => {
  const { data } = await axios.get('/mingas');
  return data;
};

export const registrarAsistencia = async (idMinga, asistenciaData) => {
  const { data } = await axios.post(`/mingas/${idMinga}/asistencia`, asistenciaData);
  return data;
};
