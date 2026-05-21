import api from './axiosConfig';

// ==========================================
// MOCK DATA (Solo para pruebas del Frontend)
// ==========================================
const MOCK_USERS = {
  admin: {
    password: 'admin',
    data: {
      token: '0|token_super_admin',
      user: { id: 0, username: 'admin', rol: 'Administrador', permisos: ['ver_dashboard', 'crear_usuario', 'editar_usuario', 'eliminar_usuario', 'gestionar_multas', 'gestionar_mingas', 'ver_reportes'] }
    }
  },
  presidente: {
    password: 'admin123',
    data: {
      token: '1|token_presidente',
      user: { id: 1, username: 'presidente', rol: 'Presidente', permisos: ['ver_dashboard', 'crear_usuario', 'editar_usuario', 'eliminar_usuario', 'gestionar_multas', 'gestionar_mingas', 'ver_reportes'] }
    }
  },
  vicepresidente: {
    password: 'chibuleo2024',
    data: {
      token: '2|token_vicepresidente',
      user: { id: 2, username: 'vicepresidente', rol: 'Vicepresidente', permisos: ['ver_dashboard', 'ver_reportes', 'ver_usuario'] }
    }
  },
  tesorero: {
    password: 'caja2024',
    data: {
      token: '3|token_tesorero',
      user: { id: 3, username: 'tesorero', rol: 'Tesorero', permisos: ['ver_dashboard', 'gestionar_multas', 'ver_reportes'] }
    }
  },
  secretario: {
    password: 'actas2024',
    data: {
      token: '4|token_secretario',
      user: { id: 4, username: 'secretario', rol: 'Secretario', permisos: ['ver_dashboard', 'gestionar_mingas', 'crear_usuario', 'editar_usuario', 'ver_usuario'] }
    }
  },
  vocal: {
    password: 'vocal2024',
    data: {
      token: '5|token_vocal',
      user: { id: 5, username: 'vocal', rol: 'Vocal', permisos: ['ver_dashboard', 'ver_usuario', 'ver_mingas'] }
    }
  },
  usuario: {
    password: 'usuario',
    data: {
      token: '6|token_usuario',
      user: { id: 6, username: 'usuario', rol: 'Usuario Regular', permisos: ['ver_dashboard', 'ver_perfil'] }
    }
  }
};

export const login = async (username, password) => {
  // FUTURO:
  // const response = await api.post('/auth/login', { username, password });
  // return response.data;

  // ACTUAL (MOCK):
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockUser = MOCK_USERS[username];
      if (mockUser && mockUser.password === password) {
        resolve(mockUser.data);
      } else {
        reject(new Error('Credenciales incorrectas. Verifica tu usuario y contraseña.'));
      }
    }, 1000);
  });
};
