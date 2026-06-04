import api from './axiosConfig';

/**
 * Catálogos: Zonas
 */
export const getZonas = async () => {
  const { data } = await api.get('/configuracion/zonas-sectores');
  // La ruta devuelve { zonas: [...], sectores: [...] }
  return data.zonas ?? [];
};

/**
 * Catálogos: Sectores por Zona
 */
export const getSectoresByZona = async (id_zona) => {
  const { data } = await api.get('/configuracion/zonas-sectores');
  const sectores = data.sectores ?? [];
  return sectores.filter(s => String(s.id_zona) === String(id_zona));
};

/**
 * Catálogos: Todos los sectores
 */
export const getAllSectores = async () => {
  const { data } = await api.get('/configuracion/zonas-sectores');
  return data.sectores ?? [];
};

/**
 * Catálogos: Condiciones Especiales
 */
export const getCondicionesEspeciales = async () => {
  const res = await api.get('/catalogos/condiciones');
  return res.data.data;
};

/**
 * Catálogos: Géneros
 */
export const getGeneros = async () => {
  const res = await api.get('/catalogos/generos');
  return res.data.data;
};

/**
 * Catálogos: Operadoras
 */
export const getOperadoras = async () => {
  const res = await api.get('/catalogos/operadoras');
  return res.data.data;
};

/**
 * Catálogos: Tipos de Contacto
 */
export const getTiposContacto = async () => {
  const { data } = await api.get('/catalogos/tipos-contacto');
  return data;
};

/**
 * Catálogos: Estados de Construcción
 */
export const getEstadosConstruccion = async () => {
  const { data } = await api.get('/catalogos/estados-construccion');
  return data;
};

/**
 * Catálogos: Títulos CINE (con búsqueda)
 */
export const buscarTitulosCine = async (query) => {
  if (!query) return [];
  const { data } = await api.get(`/catalogos/titulos?search=${query}`);
  return data;
};

/**
 * Catálogos: Actividades de Minga
 */
export const getActividadesMinga = async () => {
  const { data } = await api.get('/catalogos/actividades-minga');
  return data;
};

/**
 * Catálogos: Roles del sistema
 */
export const getRoles = async () => {
  const { data } = await api.get('/usuarios/roles');
  return data;
};
