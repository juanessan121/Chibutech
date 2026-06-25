import api from './axiosConfig';

export const getTerrenos = async (params = {}) => {
    const response = await api.get('/terrenos', { params });
    return response.data;
};

export const registrarTerrenos = async (data) => {
    const response = await api.post('/terrenos', data);
    return response.data;
};

export const updateEstadoTerreno = async (id, id_estado_construccion) => {
    const response = await api.put(`/terrenos/${id}/estado`, { id_estado_construccion });
    return response.data;
};

export const getTerrenoById = async (id) => {
    const response = await api.get(`/terrenos/${id}`);
    return response.data.data;
};

export const updateTerreno = async (id, data) => {
    const response = await api.put(`/terrenos/${id}`, data);
    return response.data;
};

export const traspasarDominio = async (id, nuevo_id_persona, motivo) => {
    const response = await api.put(`/terrenos/${id}/traspaso`, { nuevo_id_persona, motivo });
    return response.data;
};
