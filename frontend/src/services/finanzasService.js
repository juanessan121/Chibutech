import axios from './axiosConfig';

export const cobrarMulta = async (idMulta, pagoData) => {
  const { data } = await axios.post(`/finanzas/multas/${idMulta}/pagar`, pagoData);
  return data;
};

export const getMultasPendientes = async (idPersona) => {
  const { data } = await axios.get(`/finanzas/multas/pendientes/${idPersona}`);
  return data;
};

// ── PLANILLAS ──────────────────────────────────────────────────────────────────

export const getPlanillasByPersona = async (idPersona) => {
  const { data } = await axios.get(`/finanzas/planillas/persona/${idPersona}`);
  return data;
};

export const generarPlanilla = async (planillaData) => {
  // planillaData = { id_persona, anio_fiscal, mes_fiscal, detalles: [{ id_terreno, area_terreno_copia, subtotal_calculado }] }
  const { data } = await axios.post('/finanzas/planillas/generar', planillaData);
  return data;
};

export const pagarPlanilla = async (idPlanilla, pagoData) => {
  // pagoData = { numero_comprobante }
  const { data } = await axios.post(`/finanzas/planillas/${idPlanilla}/pagar`, pagoData);
  return data;
};

export const getConfiguracionTarifa = async () => {
  // Retorna TARIFA_METROS_BASE y TARIFA_VALOR_BASE de Configuracion_Global
  const { data } = await axios.get('/finanzas/configuracion/tarifa');
  return data;
};
