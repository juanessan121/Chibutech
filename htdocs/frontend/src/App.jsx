import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Pages & Layout
import Home from './pages/Home';
import Login from './login';
import Register from './register';
import AdminLayout from './layouts/AdminLayout';

import Dashboard from './pages/Dashboard';
import Personas from './pages/Personas';
import Terrenos from './pages/Terrenos';
import Mingas from './pages/Mingas';
import Multas from './pages/Multas';
import Caja from './pages/Caja';
import Directiva from './pages/Directiva';
import Auditoria from './pages/Auditoria';
import Configuracion from './pages/Configuracion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Rutas Públicas / Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas Privadas Administrativas (ERP) */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personas" element={<Personas />} />
          <Route path="/terrenos" element={<Terrenos />} />
          <Route path="/mingas" element={<Mingas />} />
          <Route path="/multas" element={<Multas />} />
          <Route path="/caja" element={<Caja />} />
          <Route path="/directiva" element={<Directiva />} />
          <Route path="/auditoria" element={<Auditoria />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;