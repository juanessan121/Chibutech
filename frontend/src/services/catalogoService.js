import axios from './axiosConfig';

export const getZonas = async () => {
  try {
    const { data } = await axios.get('/catalogos/zonas');
    return data;
  } catch (error) {
    return [
      { id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_zona: 3, nombre_zona: 'Zona Este' },
      { id_zona: 4, nombre_zona: 'Zona Oeste' }
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
        { id_sector: 1, nombre_sector: 'San Luis' },
        { id_sector: 2, nombre_sector: 'San Francisco' },
        { id_sector: 3, nombre_sector: 'San Miguel' },
        { id_sector: 4, nombre_sector: 'La Magdalena' },
        { id_sector: 5, nombre_sector: 'El Calvario' }
      ],
      2: [
        { id_sector: 6, nombre_sector: 'San Antonio' },
        { id_sector: 7, nombre_sector: 'Santa Faz' },
        { id_sector: 8, nombre_sector: 'El Rosario' },
        { id_sector: 9, nombre_sector: 'La Merced' },
        { id_sector: 10, nombre_sector: 'Bellavista' }
      ],
      3: [
        { id_sector: 11, nombre_sector: 'San Pedro' },
        { id_sector: 12, nombre_sector: 'Santa Rosa' },
        { id_sector: 13, nombre_sector: 'Las Orquídeas' },
        { id_sector: 14, nombre_sector: 'El Mirador' },
        { id_sector: 15, nombre_sector: 'Los Pinos' }
      ],
      4: [
        { id_sector: 16, nombre_sector: 'San Juan' },
        { id_sector: 17, nombre_sector: 'La Esperanza' },
        { id_sector: 18, nombre_sector: 'El Paraíso' },
        { id_sector: 19, nombre_sector: 'Nueva Vida' },
        { id_sector: 20, nombre_sector: 'Las Lomas' }
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
      { id_sector: 1, nombre_sector: 'San Luis', id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_sector: 2, nombre_sector: 'San Francisco', id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_sector: 3, nombre_sector: 'San Miguel', id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_sector: 4, nombre_sector: 'La Magdalena', id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_sector: 5, nombre_sector: 'El Calvario', id_zona: 1, nombre_zona: 'Zona Norte' },
      { id_sector: 6, nombre_sector: 'San Antonio', id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_sector: 7, nombre_sector: 'Santa Faz', id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_sector: 8, nombre_sector: 'El Rosario', id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_sector: 9, nombre_sector: 'La Merced', id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_sector: 10, nombre_sector: 'Bellavista', id_zona: 2, nombre_zona: 'Zona Sur' },
      { id_sector: 11, nombre_sector: 'San Pedro', id_zona: 3, nombre_zona: 'Zona Este' },
      { id_sector: 12, nombre_sector: 'Santa Rosa', id_zona: 3, nombre_zona: 'Zona Este' },
      { id_sector: 13, nombre_sector: 'Las Orquídeas', id_zona: 3, nombre_zona: 'Zona Este' },
      { id_sector: 14, nombre_sector: 'El Mirador', id_zona: 3, nombre_zona: 'Zona Este' },
      { id_sector: 15, nombre_sector: 'Los Pinos', id_zona: 3, nombre_zona: 'Zona Este' },
      { id_sector: 16, nombre_sector: 'San Juan', id_zona: 4, nombre_zona: 'Zona Oeste' },
      { id_sector: 17, nombre_sector: 'La Esperanza', id_zona: 4, nombre_zona: 'Zona Oeste' },
      { id_sector: 18, nombre_sector: 'El Paraíso', id_zona: 4, nombre_zona: 'Zona Oeste' },
      { id_sector: 19, nombre_sector: 'Nueva Vida', id_zona: 4, nombre_zona: 'Zona Oeste' },
      { id_sector: 20, nombre_sector: 'Las Lomas', id_zona: 4, nombre_zona: 'Zona Oeste' }
    ];
  }
};

export const getCondicionesEspeciales = async () => {
  try {
    const res = await axios.get('/catalogos/condiciones');
    return res.data.data;
  } catch (error) {
    return [{ id_condicion: 1, nombre_condicion: 'Física' }, { id_condicion: 2, nombre_condicion: 'Intelectual' }];
  }
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
  try {
    const res = await axios.get('/catalogos/generos');
    return res.data.data;
  } catch (error) {
    return [{ id_genero: 1, nombre_genero: 'Masculino' }, { id_genero: 2, nombre_genero: 'Femenino' }];
  }
};

export const getOperadoras = async () => {
  try {
    const res = await axios.get('/catalogos/operadoras');
    return res.data.data;
  } catch (error) {
    return [{ id_operadora: 1, nombre_operadora: 'Claro' }, { id_operadora: 2, nombre_operadora: 'Movistar' }];
  }
};
