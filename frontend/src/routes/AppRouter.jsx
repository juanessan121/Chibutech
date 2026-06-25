import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Páginas de entrada: cargadas de inmediato (no lazy)
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import CambiarPasswordTemporal from '../pages/CambiarPasswordTemporal';

// Dashboard y todas las sub-páginas: lazy-loaded (se descargan al navegar)
const DashboardLayout           = lazy(() => import('../layouts/DashboardLayout'));
const Dashboard                 = lazy(() => import('../pages/Dashboard'));
const Usuarios                  = lazy(() => import('../pages/Usuarios'));
const UsuariosBuscar            = lazy(() => import('../pages/UsuariosBuscar'));
const UsuariosPadron            = lazy(() => import('../pages/UsuariosPadron'));
const UsuariosAgregar           = lazy(() => import('../pages/UsuariosAgregar'));
const Mingas                    = lazy(() => import('../pages/Mingas'));
const MingasProgramar           = lazy(() => import('../pages/MingasProgramar'));
const MingasAsistencia          = lazy(() => import('../pages/MingasAsistencia'));
const MingasHistorial           = lazy(() => import('../pages/MingasHistorial'));
const MingasActivas             = lazy(() => import('../pages/MingasActivas'));
const Cobros                    = lazy(() => import('../pages/Cobros'));
const CobrosVentanilla          = lazy(() => import('../pages/CobrosVentanilla'));
const CobrosGenerar             = lazy(() => import('../pages/CobrosGenerar'));
const CobrosEgreso              = lazy(() => import('../pages/CobrosEgreso'));
const CobrosHistorial           = lazy(() => import('../pages/CobrosHistorial'));
const CobrosPlanilla            = lazy(() => import('../pages/CobrosPlanilla'));
const ReportesMenu              = lazy(() => import('../pages/ReportesMenu'));
const MisDeudas                 = lazy(() => import('../pages/MisDeudas'));
const MisTerrenos               = lazy(() => import('../pages/MisTerrenos'));
const Directiva                 = lazy(() => import('../pages/Directiva'));
const DirectivaGestion          = lazy(() => import('../pages/DirectivaGestion'));
const Bitacora                  = lazy(() => import('../pages/Bitacora'));
const Configuracion             = lazy(() => import('../pages/Configuracion'));
const Administracion            = lazy(() => import('../pages/Administracion'));
const CatastrosMenu             = lazy(() => import('../pages/CatastrosMenu'));
const CatastroGlobal            = lazy(() => import('../pages/CatastroGlobal'));
const TerrenosRegistro          = lazy(() => import('../pages/TerrenosRegistro'));
const TerrenosEdicion           = lazy(() => import('../pages/TerrenosEdicion'));
const PerfilUsuario             = lazy(() => import('../pages/PerfilUsuario'));
const TerrenoDetalles           = lazy(() => import('../pages/TerrenoDetalles'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a' }}>
    <div style={{ width: 40, height: 40, border: '3px solid #334155', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

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
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cambiar-password-temporal" element={<PrivateRoute><CambiarPasswordTemporal /></PrivateRoute>} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="usuarios">
              <Route index element={<PermissionRoute permission="ver_usuarios"><Usuarios /></PermissionRoute>} />
              <Route path="buscar" element={<PermissionRoute permission="ver_usuarios"><UsuariosBuscar /></PermissionRoute>} />
              <Route path="padron" element={<PermissionRoute permission="ver_usuarios"><UsuariosPadron /></PermissionRoute>} />
              <Route path="agregar" element={<PermissionRoute permission="crear_usuario"><UsuariosAgregar /></PermissionRoute>} />
              <Route path="editar/:id" element={<PermissionRoute permission="crear_usuario"><UsuariosAgregar /></PermissionRoute>} />
            </Route>

            <Route path="mingas">
              <Route index element={<PermissionRoute permission="ver_mingas"><Mingas /></PermissionRoute>} />
              <Route path="historial" element={<PermissionRoute permission="ver_mingas"><MingasHistorial /></PermissionRoute>} />
              <Route path="activas" element={<PermissionRoute permission="ver_mingas"><MingasActivas /></PermissionRoute>} />
              <Route path="programar" element={<PermissionRoute permission="gestionar_mingas"><MingasProgramar /></PermissionRoute>} />
              <Route path="asistencia" element={<PermissionRoute permission="gestionar_mingas"><MingasAsistencia /></PermissionRoute>} />
            </Route>

            <Route path="cobros">
              <Route index element={<PermissionRoute permission="gestionar_multas"><Cobros /></PermissionRoute>} />
              <Route path="ventanilla" element={<PermissionRoute permission="gestionar_multas"><CobrosVentanilla /></PermissionRoute>} />
              <Route path="generar" element={<PermissionRoute permission="gestionar_multas"><CobrosGenerar /></PermissionRoute>} />
              <Route path="planilla" element={<PermissionRoute permission="gestionar_multas"><CobrosPlanilla /></PermissionRoute>} />
              <Route path="egreso" element={<PermissionRoute permission="gestionar_multas"><CobrosEgreso /></PermissionRoute>} />
              <Route path="historial" element={<PermissionRoute permission="gestionar_multas"><CobrosHistorial /></PermissionRoute>} />
            </Route>

            <Route path="reportes" element={<PermissionRoute permission="ver_reportes"><ReportesMenu /></PermissionRoute>} />

            <Route path="mis-deudas" element={<PrivateRoute><MisDeudas /></PrivateRoute>} />
            <Route path="mis-terrenos" element={<PrivateRoute><MisTerrenos /></PrivateRoute>} />

            <Route path="directiva">
              <Route index element={<PermissionRoute permission="crear_usuario"><Directiva /></PermissionRoute>} />
              <Route path="gestionar" element={<PermissionRoute permission="crear_usuario"><DirectivaGestion /></PermissionRoute>} />
            </Route>

            <Route path="catastro">
              <Route index element={<PermissionRoute permission="ver_catastro"><CatastrosMenu /></PermissionRoute>} />
              <Route path="generales" element={<PermissionRoute permission="ver_catastro"><CatastroGlobal /></PermissionRoute>} />
              <Route path="detalles/:id" element={<PrivateRoute><TerrenoDetalles /></PrivateRoute>} />
              <Route path="editar/:id" element={<PermissionRoute permission="crear_usuario"><TerrenosEdicion /></PermissionRoute>} />
            </Route>

            <Route path="terrenos" element={<PermissionRoute permission="crear_usuario"><TerrenosRegistro /></PermissionRoute>} />

            <Route path="perfil" element={<PrivateRoute><PerfilUsuario /></PrivateRoute>} />

            <Route path="administracion">
              <Route index element={<PermissionRoute permission="administrar_sistema"><Administracion /></PermissionRoute>} />
              <Route path="configuracion" element={<PermissionRoute permission="administrar_sistema"><Configuracion /></PermissionRoute>} />
              <Route path="bitacora" element={<PermissionRoute permission="administrar_sistema"><Bitacora /></PermissionRoute>} />
            </Route>

          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
