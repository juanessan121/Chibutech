import api from './axiosConfig';

// Caché en memoria con TTL de 5 minutos para datos estáticos de catálogo.
// Si 5 componentes piden zonas en la misma sesión, solo 1 petición HTTP sale.
const _cache = new Map();
const TTL_MS = 5 * 60 * 1000;

const cached = async (key, fetcher) => {
  const entry = _cache.get(key);
  if (entry && Date.now() < entry.expiresAt) return entry.data;
  const data = await fetcher();
  _cache.set(key, { data, expiresAt: Date.now() + TTL_MS });
  return data;
};

// Las tres funciones de zonas/sectores comparten UNA sola petición HTTP en caché
const _fetchZonasSectores = () =>
  api.get('/configuracion/zonas-sectores').then(r => r.data.data);

export const getZonas = () =>
  cached('zonas-sectores', _fetchZonasSectores).then(d => d?.zonas ?? []);

export const getAllSectores = () =>
  cached('zonas-sectores', _fetchZonasSectores).then(d => d?.sectores ?? []);

export const getSectoresByZona = (id_zona) =>
  cached('zonas-sectores', _fetchZonasSectores).then(d =>
    (d?.sectores ?? []).filter(s => String(s.id_zona) === String(id_zona))
  );

export const getCondicionesEspeciales = () =>
  cached('condiciones', () => api.get('/catalogos/condiciones').then(r => r.data.data));

export const getGeneros = () =>
  cached('generos', () => api.get('/catalogos/generos').then(r => r.data.data));

export const getOperadoras = () =>
  cached('operadoras', () => api.get('/catalogos/operadoras').then(r => r.data.data));

export const getTiposContacto = () =>
  cached('tipos-contacto', () => api.get('/catalogos/tipos-contacto').then(r => r.data));

export const getEstadosConstruccion = () =>
  cached('estados-construccion', () => api.get('/catalogos/estados-construccion').then(r => r.data));

export const getActividadesMinga = () =>
  cached('actividades-minga', () => api.get('/catalogos/actividades-minga').then(r => r.data));

export const getRoles = () =>
  cached('roles', () => api.get('/usuarios/roles').then(r => r.data));

// Búsqueda dinámica — NO se cachea porque el query varía en cada llamada
export const buscarTitulosCine = async (query) => {
  if (!query) return [];
  const { data } = await api.get(`/catalogos/titulos?search=${query}`);
  return data;
};
