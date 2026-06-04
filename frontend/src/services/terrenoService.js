import api from './axiosConfig';

export const getTerrenos = async () => {
    try {
        const response = await api.get('/terrenos');
        return response.data.data; // .data is the array
    } catch (error) {
        console.error('Error fetching terrenos:', error);
        throw error;
    }
};

export const registrarTerrenos = async (data) => {
    try {
        const response = await api.post('/terrenos', data);
        return response.data;
    } catch (error) {
        console.error('Error registering terrenos:', error);
        throw error;
    }
};

export const updateEstadoTerreno = async (id, id_estado_construccion) => {
    try {
        const response = await api.put(`/terrenos/${id}/estado`, { id_estado_construccion });
        return response.data;
    } catch (error) {
        console.error('Error updating estado:', error);
        throw error;
    }
};

export const getTerrenoById = async (id) => {
    try {
        const response = await api.get(`/terrenos/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching terreno:', error);
        throw error;
    }
};

export const updateTerreno = async (id, data) => {
    try {
        const response = await api.put(`/terrenos/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating terreno:', error);
        throw error;
    }
};

export const traspasarDominio = async (id, nuevo_id_persona, motivo) => {
    try {
        const response = await api.put(`/terrenos/${id}/traspaso`, { nuevo_id_persona, motivo });
        return response.data;
    } catch (error) {
        console.error('Error en traspaso:', error);
        throw error;
    }
};
