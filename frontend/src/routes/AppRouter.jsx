import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layouts/DashboardLayout';
import Usuarios from '../pages/Usuarios';
import UsuariosBuscar from '../pages/UsuariosBuscar';
import UsuariosPadron from '../pages/UsuariosPadron';
import UsuariosAgregar from '../pages/UsuariosAgregar';
import Mingas from '../pages/Mingas';
import MingasProgramar from '../pages/MingasProgramar';
import MingasAsistencia from '../pages/MingasAsistencia';
import MingasHistorial from '../pages/MingasHistorial';
import Cobros from '../pages/Cobros';
import CobrosVentanilla from '../pages/CobrosVentanilla';
import CobrosGenerar from '../pages/CobrosGenerar';
import CobrosEgreso from '../pages/CobrosEgreso';
import CobrosHistorial from '../pages/CobrosHistorial';
import CobrosPlanilla from '../pages/CobrosPlanilla';
import ReportesMenu from '../pages/ReportesMenu';
import MisDeudas from '../pages/MisDeudas';
import MisTerrenos from '../pages/MisTerrenos';
import Directiva from '../pages/Directiva';
import DirectivaGestion from '../pages/DirectivaGestion';
import Bitacora from '../pages/Bitacora';
import Configuracion from '../pages/Configuracion';
import Administracion from '../pages/Administracion';
import CatastrosMenu from '../pages/CatastrosMenu';
import CatastroGlobal from '../pages/CatastroGlobal';
import TerrenosRegistro from '../pages/TerrenosRegistro';
import TerrenosEdicion from '../pages/TerrenosEdicion';
import PerfilUsuario from '../pages/PerfilUsuario';
import TerrenoDetalles from '../pages/TerrenoDetalles';
import ForgotPassword from '../pages/ForgotPassword';
import CambiarPasswordTemporal from '../pages/CambiarPasswordTemporal';
import useAuthStore from '../store/useAuthStore';

// Protege rutas que requieren estar autenticado
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Protege rutas por permiso específico
const PermissionRoute = ({ permission, children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.permisos?.includes(permission)) return <Navigate to="/dashboard" />;
  return children;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cambiar-password-temporal" element={<PrivateRoute><CambiarPasswordTemporal /></PrivateRoute>} />
        
        {/* Rutas Privadas envueltas en el DashboardLayout */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          } 
        >
          <Route index element={<Dashboard />} />
          
          {/* Módulo de Usuarios — lectura: ver_usuarios / escritura: crear_usuario */}
          <Route path="usuarios">
            <Route index element={<PermissionRoute permission="ver_usuarios"><Usuarios /></PermissionRoute>} />
            <Route path="buscar" element={<PermissionRoute permission="ver_usuarios"><UsuariosBuscar /></PermissionRoute>} />
            <Route path="padron" element={<PermissionRoute permission="ver_usuarios"><UsuariosPadron /></PermissionRoute>} />
            <Route path="agregar" element={<PermissionRoute permission="crear_usuario"><UsuariosAgregar /></PermissionRoute>} />
            <Route path="editar/:id" element={<PermissionRoute permission="crear_usuario"><UsuariosAgregar /></PermissionRoute>} />
          </Route>

          {/* Módulo de Mingas — lectura: ver_mingas / gestión: gestionar_mingas */}
          <Route path="mingas">
            <Route index element={<PermissionRoute permission="ver_mingas"><Mingas /></PermissionRoute>} />
            <Route path="historial" element={<PermissionRoute permission="ver_mingas"><MingasHistorial /></PermissionRoute>} />
            <Route path="programar" element={<PermissionRoute permission="gestionar_mingas"><MingasProgramar /></PermissionRoute>} />
            <Route path="asistencia" element={<PermissionRoute permission="gestionar_mingas"><MingasAsistencia /></PermissionRoute>} />
          </Route>

          {/* Módulo de Cobros y Multas — gestionar_multas */}
          <Route path="cobros">
            <Route index element={<PermissionRoute permission="gestionar_multas"><Cobros /></PermissionRoute>} />
            <Route path="ventanilla" element={<PermissionRoute permission="gestionar_multas"><CobrosVentanilla /></PermissionRoute>} />
            <Route path="generar" element={<PermissionRoute permission="gestionar_multas"><CobrosGenerar /></PermissionRoute>} />
            <Route path="planilla" element={<PermissionRoute permission="gestionar_multas"><CobrosPlanilla /></PermissionRoute>} />
            <Route path="egreso" element={<PermissionRoute permission="gestionar_multas"><CobrosEgreso /></PermissionRoute>} />
            <Route path="historial" element={<PermissionRoute permission="gestionar_multas"><CobrosHistorial /></PermissionRoute>} />
          </Route>

          {/* Módulo de Reportes — ver_reportes */}
          <Route path="reportes" element={<PermissionRoute permission="ver_reportes"><ReportesMenu /></PermissionRoute>} />

          {/* Vistas exclusivas del comunero */}
          <Route path="mis-deudas" element={<PrivateRoute><MisDeudas /></PrivateRoute>} />
          <Route path="mis-terrenos" element={<PrivateRoute><MisTerrenos /></PrivateRoute>} />

          {/* Módulo de Directiva — crear_usuario (Admin, Presidente, Secretario) */}
          <Route path="directiva">
            <Route index element={<PermissionRoute permission="crear_usuario"><Directiva /></PermissionRoute>} />
            <Route path="gestionar" element={<PermissionRoute permission="crear_usuario"><DirectivaGestion /></PermissionRoute>} />
          </Route>

          {/* Módulo de Catastro — lectura: ver_catastro / edición: crear_usuario */}
          <Route path="catastro">
            <Route index element={<PermissionRoute permission="ver_catastro"><CatastrosMenu /></PermissionRoute>} />
            <Route path="generales" element={<PermissionRoute permission="ver_catastro"><CatastroGlobal /></PermissionRoute>} />
            <Route path="detalles/:id" element={<PrivateRoute><TerrenoDetalles /></PrivateRoute>} />
            <Route path="editar/:id" element={<PermissionRoute permission="crear_usuario"><TerrenosEdicion /></PermissionRoute>} />
          </Route>

          {/* Registro de Terrenos — crear_usuario */}
          <Route path="terrenos" element={<PermissionRoute permission="crear_usuario"><TerrenosRegistro /></PermissionRoute>} />

          {/* Perfil de Usuario — todos */}
          <Route path="perfil" element={<PrivateRoute><PerfilUsuario /></PrivateRoute>} />

          {/* Módulo de Administración — solo Admin y Presidente (eliminar_usuario) */}
          <Route path="administracion">
            <Route index element={<PermissionRoute permission="eliminar_usuario"><Administracion /></PermissionRoute>} />
            <Route path="configuracion" element={<PermissionRoute permission="eliminar_usuario"><Configuracion /></PermissionRoute>} />
            <Route path="bitacora" element={<PermissionRoute permission="eliminar_usuario"><Bitacora /></PermissionRoute>} />
          </Route>
          
        </Route>
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
