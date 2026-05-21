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
import ReportesMenu from '../pages/ReportesMenu';
import MisDeudas from '../pages/MisDeudas';
import Directiva from '../pages/Directiva';
import DirectivaGestion from '../pages/DirectivaGestion';
import Bitacora from '../pages/Bitacora';
import Configuracion from '../pages/Configuracion';
import CatastroGlobal from '../pages/CatastroGlobal';
import useAuthStore from '../store/useAuthStore';

// Un componente para proteger las rutas privadas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
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
          
          {/* Módulo de Usuarios */}
          <Route path="usuarios">
            <Route index element={<PrivateRoute><Usuarios /></PrivateRoute>} />
            <Route path="buscar" element={<PrivateRoute><UsuariosBuscar /></PrivateRoute>} />
            <Route path="padron" element={<PrivateRoute><UsuariosPadron /></PrivateRoute>} />
            <Route path="agregar" element={<PrivateRoute><UsuariosAgregar /></PrivateRoute>} />
          </Route>

          {/* Módulo de Mingas */}
          <Route path="mingas">
            <Route index element={<PrivateRoute><Mingas /></PrivateRoute>} />
            <Route path="programar" element={<PrivateRoute><MingasProgramar /></PrivateRoute>} />
            <Route path="asistencia" element={<PrivateRoute><MingasAsistencia /></PrivateRoute>} />
            <Route path="historial" element={<PrivateRoute><MingasHistorial /></PrivateRoute>} />
          </Route>

          {/* Módulo de Cobros y Multas */}
          <Route path="cobros">
            <Route index element={<PrivateRoute><Cobros /></PrivateRoute>} />
            <Route path="ventanilla" element={<PrivateRoute><CobrosVentanilla /></PrivateRoute>} />
            <Route path="generar" element={<PrivateRoute><CobrosGenerar /></PrivateRoute>} />
            <Route path="egreso" element={<PrivateRoute><CobrosEgreso /></PrivateRoute>} />
            <Route path="historial" element={<PrivateRoute><CobrosHistorial /></PrivateRoute>} />
          </Route>

          {/* Módulo de Reportes */}
          <Route path="reportes" element={<PrivateRoute><ReportesMenu /></PrivateRoute>} />

          {/* Módulo para el agricultor normal (Mis Deudas) */}
          <Route path="mis-deudas" element={<PrivateRoute><MisDeudas /></PrivateRoute>} />

          {/* Módulo de Directiva */}
          <Route path="directiva">
            <Route index element={<PrivateRoute><Directiva /></PrivateRoute>} />
            <Route path="gestionar" element={<PrivateRoute><DirectivaGestion /></PrivateRoute>} />
          </Route>

          {/* Módulo de Catastro */}
          <Route path="catastro" element={<PrivateRoute><CatastroGlobal /></PrivateRoute>} />

          {/* Módulo de Configuración (solo Admin) */}
          <Route path="configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />

          {/* Módulo de Bitácora / Auditoría (solo Admin) */}
          <Route path="bitacora" element={<PrivateRoute><Bitacora /></PrivateRoute>} />
          
        </Route>
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
