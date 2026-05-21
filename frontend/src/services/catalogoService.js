import axios from './axiosConfig';

export const getZonas = async () => {
  const { data } = await axios.get('/catalogos/zonas');
  return data;
};

export const getCondicionesEspeciales = async () => {
  const { data } = await axios.get('/catalogos/condiciones');
  return data;
};

export const getRoles = async () => {
  const { data } = await axios.get('/usuarios/roles');
  return data;
};

export const getTiposContacto = async () => {
  const { data } = await axios.get('/catalogos/tipos-contacto');
  return data;
};

export const getEstadosConstruccion = async () => {
  const { data } = await axios.get('/catalogos/estados-construccion');
  return data;
};

export const buscarTitulosCine = async (query) => {
  if (!query) return [];
  const { data } = await axios.get(`/catalogos/titulos?search=${query}`);
  return data;
};

export const getActividadesMinga = async () => {
  const { data } = await axios.get('/catalogos/actividades-minga');
  return data;
};

export const getGeneros = async () => {
  const { data } = await axios.get('/catalogos/generos');
  return data;
};
