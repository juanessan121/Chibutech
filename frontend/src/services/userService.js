import api from './axiosConfig';

// MOCK DATA (Simulando la base de datos de usuarios)
let mockUsersList = [
  { id: 1, cedula: '1801234567', nombre: 'Juan Pérez', sector: 'Centro', rol: 'Administrador', estado: 'Activo' },
  { id: 2, cedula: '1809876543', nombre: 'María Masaquiza', sector: 'San Luis', rol: 'Directiva', estado: 'Activo' },
  { id: 3, cedula: '1804567890', nombre: 'Pedro Lliguin', sector: 'Centro', rol: 'Usuario', estado: 'Suspendido' },
  { id: 4, cedula: '1801112223', nombre: 'Carmen Jerez', sector: 'San Francisco', rol: 'Usuario', estado: 'Activo' },
  { id: 5, cedula: '1803334445', nombre: 'Luis Ainaguano', sector: 'San Luis', rol: 'Usuario', estado: 'Activo' },
];

export const getUsers = async () => {
  // FUTURO: const res = await api.get('/users'); return res.data;
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockUsersList]), 800);
  });
};

export const deleteUser = async (id) => {
  // FUTURO: await api.delete(`/users/${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      mockUsersList = mockUsersList.filter(u => u.id !== id);
      resolve({ success: true });
    }, 500);
  });
};

export const addUser = async (userData) => {
  // FUTURO: const res = await api.post('/users', userData); return res.data;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validación básica mock
      if (mockUsersList.find(u => u.cedula === userData.cedula)) {
        reject(new Error('La cédula ya está registrada en el sistema.'));
        return;
      }
      
      const newUser = {
        id: Math.max(...mockUsersList.map(u => u.id)) + 1,
        cedula: userData.cedula,
        nombre: `${userData.nombres} ${userData.apellidos}`,
        sector: userData.zona || 'Centro',
        rol: userData.rol,
        estado: 'Activo'
      };
      
      mockUsersList.push(newUser);
      resolve(newUser);
    }, 800);
  });
};
