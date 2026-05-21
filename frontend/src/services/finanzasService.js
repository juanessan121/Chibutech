import axios from './axiosConfig';

export const cobrarMulta = async (idMulta, pagoData) => {
  // Cuando se cobra o se anula, se puede enviar un archivo de justificación (MEDIUMBLOB en BD)
  // Por ende, aquí deberíamos usar FormData para subir el archivo
  const formData = new FormData();
  for (const key in pagoData) {
    if (pagoData[key]) {
      formData.append(key, pagoData[key]);
    }
  }

  const { data } = await axios.post(`/finanzas/multas/${idMulta}/pagar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const getMultasPendientes = async (idPersona) => {
  const { data } = await axios.get(`/finanzas/multas/pendientes/${idPersona}`);
  return data;
};
