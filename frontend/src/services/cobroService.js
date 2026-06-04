import axios from './axiosConfig';

export const getDeudasPendientes = async (id_persona) => {
  const { data } = await axios.get(`/cobros/deudas/${id_persona}`);
  return data.data;
};

export const procesarPago = async (pagoData) => {
  const { data } = await axios.post('/cobros/pagar', pagoData);
  return data;
};

export const getHistorialCaja = async () => {
  const { data } = await axios.get('/cobros/historial');
  return data.data;
};

export const generarMulta = async (multaData) => {
  const { data } = await axios.post('/cobros/multa', multaData);
  return data;
};

export const registrarEgreso = async (egresoData) => {
  const { data } = await axios.post('/cobros/egreso', egresoData);
  return data;
};

export const generarPlanillas = async (planillaData) => {
  const { data } = await axios.post('/cobros/planillas', planillaData);
  return data;
};
