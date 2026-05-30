import axios from './axiosConfig';

export const getZonas = async () => {
  try {
    const { data } = await axios.get('/catalogos/zonas');
    return data;
  } catch (error) {
    return [
      { id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_zona: 3, nombre_zona: 'Zona Este' }
    ];
  }
};

export const getSectoresByZona = async (id_zona) => {
  try {
    const { data } = await axios.get(`/catalogos/zonas/${id_zona}/sectores`);
    return data;
  } catch (error) {
    const sectoresMock = {
      1: [
        { id_sector: 101, nombre_sector: 'San Luis' },
        { id_sector: 102, nombre_sector: 'San Francisco' }
      ],
      2: [
        { id_sector: 201, nombre_sector: 'Centro' },
        { id_sector: 202, nombre_sector: 'La Merced' }
      ],
      3: [
        { id_sector: 301, nombre_sector: 'San Miguel' },
        { id_sector: 302, nombre_sector: 'San Pedro' }
      ]
    };
    return sectoresMock[id_zona] || [];
  }
};

export const getAllSectores = async () => {
  try {
    const { data } = await axios.get('/catalogos/sectores');
    return data;
  } catch (error) {
    return [
      { id_sector: 101, nombre_sector: 'San Luis', id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_sector: 102, nombre_sector: 'San Francisco', id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_sector: 201, nombre_sector: 'Centro', id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_sector: 202, nombre_sector: 'La Merced', id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_sector: 301, nombre_sector: 'San Miguel', id_zona: 3, nombre_zona: 'Zona Este' },
      { id_sector: 302, nombre_sector: 'San Pedro', id_zona: 3, nombre_zona: 'Zona Este' }
    ];
  }
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
