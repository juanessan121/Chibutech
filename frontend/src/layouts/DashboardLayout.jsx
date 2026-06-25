import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Droplets, LogOut, LayoutDashboard, Users, FileText, Settings, ShieldAlert, UserCircle, Award, Map, MapPin, Menu, Bell, User, X, CheckCircle, ChevronRight, ChevronLeft, Calendar, Wallet, AlertTriangle } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Toaster } from 'sonner';
import bgLayout from '../assets/bg_layout.png';
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from '../services/notificacionService';

export default function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { hasPermission, isRole } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [flyout, setFlyout] = useState(null); // { name, color, subItems, top }
  const flyoutHideTimer = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const notificationsRef = useRef(null);

  const fetchNotificaciones = useCallback(async () => {
    try {
      const res = await getNotificaciones();
      setNotifications(res.data || []);
      setNoLeidas(res.no_leidas || 0);
    } catch {
      // silencioso — no interrumpir el layout
    }
  }, []);

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 120000);
    return () => clearInterval(interval);
  }, [fetchNotificaciones]);

  const unreadCount = noLeidas;

  // Cerrar notificaciones al cambiar de página
  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  // Atajo de teclado Ctrl+B / Cmd+B para colapsar/expandir sidebar
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed(c => !c);
        setFlyout(null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Cerrar notificaciones al hacer clic fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = useMemo(() => [
    { name: 'Panel Principal', path: '/dashboard', icon: LayoutDashboard, show: true, color: '#0ea5e9' },
    // ── Sección Gestión Comunitaria ──────────────────────────────────────────
    { section: 'Gestión', show: hasPermission('gestionar_mingas') || hasPermission('ver_mingas') || hasPermission('ver_catastro') || hasPermission('crear_usuario') },
    {
      name: 'Usuarios', icon: Users, color: '#8b5cf6',
      show: hasPermission('ver_usuarios') || hasPermission('crear_usuario'),
      activePaths: ['/dashboard/usuarios'],
      subItems: [
        { name: 'Padrón General', path: '/dashboard/usuarios/padron' },
        { name: 'Agregar Usuario', path: '/dashboard/usuarios/agregar', show: hasPermission('crear_usuario') }
      ]
    },
    {
      name: 'Mingas', icon: Calendar, color: '#10b981',
      show: hasPermission('gestionar_mingas') || hasPermission('ver_mingas'),
      activePaths: ['/dashboard/mingas'],
      subItems: [
        { name: 'Control de Mingas', path: '/dashboard/mingas' },
        { name: 'Mingas Activas', path: '/dashboard/mingas/activas' },
        { name: 'Historial de Mingas', path: '/dashboard/mingas/historial' },
        { name: 'Programar Minga', path: '/dashboard/mingas/programar', show: hasPermission('gestionar_mingas') },
        { name: 'Tomar Asistencia', path: '/dashboard/mingas/asistencia', show: hasPermission('gestionar_mingas') }
      ]
    },
    {
      name: 'Catastros', icon: Map, color: '#0ea5e9',
      show: hasPermission('ver_catastro') || hasPermission('gestionar_mingas') || hasPermission('crear_usuario'),
      activePaths: ['/dashboard/catastro', '/dashboard/terrenos'],
      subItems: [
        { name: 'Catastro de Predios', path: '/dashboard/catastro/generales' },
        { name: 'Registrar Terreno', path: '/dashboard/terrenos', show: hasPermission('crear_usuario') }
      ]
    },
    // ── Sección Finanzas ─────────────────────────────────────────────────────
    { section: 'Finanzas', show: hasPermission('gestionar_multas') || hasPermission('ver_reportes') },
    {
      name: 'Multas y Cobros', icon: ShieldAlert, color: '#ef4444', show: hasPermission('gestionar_multas'),
      activePaths: ['/dashboard/cobros'],
      subItems: [
        { name: 'Panel de Cobros', path: '/dashboard/cobros' },
        { name: 'Ventanilla de Cobro', path: '/dashboard/cobros/ventanilla' },
        { name: 'Generar Multa Manual', path: '/dashboard/cobros/generar' },
        { name: 'Registrar Egreso', path: '/dashboard/cobros/egreso' },
        { name: 'Arqueo e Historial', path: '/dashboard/cobros/historial' },
        { name: 'Emitir Planillas', path: '/dashboard/cobros/planilla' }
      ]
    },
    { name: 'Reportes', path: '/dashboard/reportes', icon: FileText, color: '#f59e0b', show: hasPermission('ver_reportes') },
    // ── Sección Organización ─────────────────────────────────────────────────
    { section: 'Organización', show: hasPermission('crear_usuario') || hasPermission('administrar_sistema') },
    {
      name: 'Directiva', icon: Award, color: '#f59e0b', show: hasPermission('crear_usuario'),
      activePaths: ['/dashboard/directiva'],
      subItems: [
        { name: 'Organigrama Actual', path: '/dashboard/directiva' },
        { name: 'Gestionar Directiva', path: '/dashboard/directiva/gestionar' }
      ]
    },
    {
      name: 'Administración', icon: Settings, color: '#94a3b8', show: hasPermission('administrar_sistema'),
      activePaths: ['/dashboard/administracion'],
      subItems: [
        { name: 'Panel Admin', path: '/dashboard/administracion' },
        { name: 'Configuración', path: '/dashboard/administracion/configuracion' }
      ]
    },
    // ── Sección Comunero ─────────────────────────────────────────────────────
    { section: 'Mi Cuenta', show: isRole('Comunero') },
    { name: 'Mis Deudas', path: '/dashboard/mis-deudas', icon: Wallet, color: '#ef4444', show: isRole('Comunero') },
    { name: 'Mis Terrenos', path: '/dashboard/mis-terrenos', icon: MapPin, color: '#10b981', show: isRole('Comunero') },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [hasPermission, isRole]);

  // Sincronizar automáticamente el submenú abierto (accordion) con la ruta actual
  useEffect(() => {
    const activeItem = menuItems.find(item => {
      if (!item.subItems) return false;
      return item.activePaths 
        ? item.activePaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
        : item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));
    });
    
    // Si la ruta pertenece a un padre, asegurarse de que ese padre esté abierto
    if (activeItem) {
      if (openMenu !== activeItem.name) {
        setOpenMenu(activeItem.name);
      }
    } else {
      // Si la ruta es una vista sin submenú (ej. Panel Principal), cerramos cualquier acordeón abierto
      if (openMenu !== '') {
        setOpenMenu('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="layout-container" style={{ 
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7)), url(${bgLayout})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Toaster richColors position="top-right" />
      
      {/* Sidebar Overlay (Móvil) */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Botón flotante de colapso — en el borde del sidebar, fuera del aside */}
      <button
        className="sidebar-edge-toggle"
        style={{ left: isCollapsed ? (72 - 13) : (280 - 13) }}
        onClick={() => { setIsCollapsed(c => !c); setFlyout(null); }}
        aria-label={isCollapsed ? 'Expandir menú lateral (Ctrl+B)' : 'Colapsar menú lateral (Ctrl+B)'}
        title={isCollapsed ? 'Expandir menú (Ctrl+B)' : 'Colapsar menú (Ctrl+B)'}
        aria-expanded={!isCollapsed}
        aria-controls="main-sidebar"
      >
        {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Sidebar (Menú Lateral) */}
      <aside
        id="main-sidebar"
        className={`sidebar glass-card ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        aria-label="Navegación principal"
      >
        <div className={`sidebar-header${isCollapsed ? ' collapsed' : ''}`}>
          <div className="sidebar-logo" aria-hidden="true">
            <Droplets size={20} color="white" />
          </div>
          {!isCollapsed && (
            <div className="sidebar-brand">
              <span className="sidebar-brand-name">Consejo de Gobierno</span>
              <span className="sidebar-brand-sub">Comunitario Chibuleo-San Francisco</span>
            </div>
          )}
        </div>

        <nav
          className="sidebar-nav"
          aria-label="Menú de navegación"
          onMouseLeave={() => { clearTimeout(flyoutHideTimer.current); flyoutHideTimer.current = setTimeout(() => setFlyout(null), 120); }}
        >
          {menuItems.filter(item => item.show).map((item, idx) => {
            // ── Separador de sección ────────────────────────────────────────
            if (item.section) {
              if (isCollapsed) return <div key={`sec-${idx}`} style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0.4rem 0.25rem' }} />;
              return (
                <div key={`sec-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem 0.15rem', marginTop: '0.15rem' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>{item.section}</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                </div>
              );
            }

            const Icon = item.icon;
            const accent = item.color || 'var(--primary)';

            // ── Ítem con submenú ────────────────────────────────────────────
            if (item.subItems) {
              const isOpen = openMenu === item.name;
              const isRouteActive = item.activePaths
                ? item.activePaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
                : item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));
              const isParentActive = isOpen || (isRouteActive && openMenu === '');

              // Modo colapsado: icono con flyout hover
              if (isCollapsed) {
                return (
                  <button
                    key={item.name}
                    className={`sidebar-link ${isParentActive ? 'active' : ''}`}
                    data-label={item.name}
                    style={{ color: isParentActive ? accent : undefined, background: isParentActive ? `${accent}20` : undefined }}
                    onMouseEnter={e => {
                      clearTimeout(flyoutHideTimer.current);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setFlyout({ name: item.name, color: accent, subItems: item.subItems, top: rect.top });
                    }}
                    onMouseLeave={() => {
                      flyoutHideTimer.current = setTimeout(() => setFlyout(null), 120);
                    }}
                    onClick={() => { setIsCollapsed(false); setOpenMenu(item.name); }}
                    title=""
                  >
                    <Icon size={19} style={{ color: isParentActive ? accent : undefined }} />
                  </button>
                );
              }

              // Modo expandido
              return (
                <div key={item.name} className="sidebar-accordion">
                  <button
                    className={`sidebar-link ${isParentActive ? 'active' : ''}`}
                    onClick={() => setOpenMenu(isOpen ? '' : item.name)}
                    aria-expanded={isOpen}
                    aria-controls={`submenu-${item.name}`}
                    style={{
                      justifyContent: 'space-between',
                      borderLeft: isParentActive ? `3px solid ${accent}` : '3px solid transparent',
                      paddingLeft: '0.85rem',
                      color: isParentActive ? accent : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Icon size={18} style={{ color: isParentActive ? accent : undefined, flexShrink: 0 }} />
                      <span style={{ fontWeight: isParentActive ? 600 : 400 }}>{item.name}</span>
                    </div>
                    <ChevronRight size={14} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', opacity: 0.5, flexShrink: 0 }} />
                  </button>
                  <div id={`submenu-${item.name}`} style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)', opacity: isOpen ? 1 : 0 }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div role="list" style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.2rem', paddingBottom: '0.3rem', borderLeft: '1px solid rgba(255,255,255,0.07)', marginLeft: '1.4rem' }}>
                        {item.subItems.filter(sub => sub.show !== false).map(subItem => {
                          const isSubActive = location.pathname === subItem.path;
                          return (
                            <button
                              key={subItem.path}
                              role="listitem"
                              tabIndex={isOpen ? 0 : -1}
                              aria-current={isSubActive ? 'page' : undefined}
                              onClick={() => { navigate(subItem.path); setIsSidebarOpen(false); }}
                              style={{
                                background: isSubActive ? `${accent}18` : 'transparent',
                                border: 'none', color: isSubActive ? accent : '#94a3b8',
                                fontWeight: isSubActive ? 600 : 400, textAlign: 'left',
                                cursor: 'pointer', fontSize: '0.82rem', padding: '0.35rem 0.6rem',
                                borderRadius: '0.4rem', transition: 'all 0.18s',
                                display: 'flex', alignItems: 'center', gap: '0.45rem',
                              }}
                              onMouseEnter={e => { if (!isSubActive) { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}}
                              onMouseLeave={e => { if (!isSubActive) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}}
                            >
                              <div style={{ width: 4, height: 4, borderRadius: '50%', background: isSubActive ? accent : 'rgba(148,163,184,0.4)', flexShrink: 0 }} />
                              {subItem.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // ── Ítem directo (sin submenú) ──────────────────────────────────
            const isRouteActive = item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const isActive = isRouteActive && openMenu === '';

            if (isCollapsed) {
              return (
                <button
                  key={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  data-label={item.name}
                  style={{ color: isActive ? accent : undefined, background: isActive ? `${accent}20` : undefined }}
                  onClick={() => { setOpenMenu(''); navigate(item.path); setIsSidebarOpen(false); }}
                  onMouseEnter={() => { clearTimeout(flyoutHideTimer.current); setFlyout(null); }}
                  title=""
                >
                  <Icon size={19} style={{ color: isActive ? accent : undefined }} />
                </button>
              );
            }

            return (
              <button
                key={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => { setOpenMenu(''); navigate(item.path); setIsSidebarOpen(false); }}
                style={{
                  justifyContent: 'flex-start',
                  borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                  paddingLeft: '0.85rem',
                  color: isActive ? accent : undefined,
                  gap: '0.75rem',
                }}
              >
                <Icon size={18} style={{ color: isActive ? accent : undefined, flexShrink: 0 }} />
                <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer" style={{ padding: isCollapsed ? '1rem 0.5rem' : undefined }}>
          <div
            className="user-mini-profile"
            style={{ cursor: 'pointer', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            onClick={() => { navigate('/dashboard/perfil'); setIsSidebarOpen(false); }}
            title={isCollapsed ? `${user?.nombre_completo || user?.username} — ${user?.rol}` : ''}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(14,165,233,0.18)', border: '1.5px solid rgba(14,165,233,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserCircle size={20} color="var(--primary)" />
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name" style={{ fontSize: '0.82rem' }}>{user?.nombre_completo || user?.username}</span>
                <span className="user-role">{user?.rol}</span>
              </div>
            )}
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            title={isCollapsed ? 'Cerrar Sesión' : ''}
            style={{ padding: isCollapsed ? '0.6rem' : undefined, gap: isCollapsed ? 0 : undefined }}
          >
            <LogOut size={17} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* ── Flyout panel de submenús (modo rail colapsado) ── */}
      {isCollapsed && flyout && (
        <div
          style={{
            position: 'fixed',
            left: '80px',
            top: flyout.top,
            zIndex: 500,
            background: 'rgba(13,20,36,0.98)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.75rem',
            padding: '0.5rem',
            minWidth: '200px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={() => clearTimeout(flyoutHideTimer.current)}
          onMouseLeave={() => { flyoutHideTimer.current = setTimeout(() => setFlyout(null), 120); }}
        >
          <div style={{ padding: '0.4rem 0.75rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: flyout.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{flyout.name}</span>
          </div>
          {flyout.subItems.filter(sub => sub.show !== false).map(sub => {
            const isSubActive = location.pathname === sub.path;
            return (
              <button
                key={sub.path}
                onClick={() => { navigate(sub.path); setFlyout(null); setIsSidebarOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                  background: isSubActive ? `${flyout.color}18` : 'transparent',
                  border: 'none', color: isSubActive ? flyout.color : '#94a3b8',
                  fontWeight: isSubActive ? 600 : 400, textAlign: 'left',
                  cursor: 'pointer', fontSize: '0.84rem',
                  padding: '0.45rem 0.75rem', borderRadius: '0.5rem', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isSubActive) { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}}
                onMouseLeave={e => { if (!isSubActive) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: isSubActive ? flyout.color : 'rgba(148,163,184,0.4)', flexShrink: 0 }} />
                {sub.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Cabecera superior global con notificaciones y perfil */}
        <div className="dashboard-topbar">
          <button className="burger-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="topbar-actions">
            {/* Campana de Notificaciones */}
            <div style={{ position: 'relative' }} ref={notificationsRef}>
              <div
                className={`notifications-bell-container ${unreadCount > 0 ? 'bell-animate' : ''}`}
                onClick={async () => {
                  const isOpening = !showNotifications;
                  setShowNotifications(isOpening);
                  if (isOpening) {
                    setLoadingNotif(true);
                    await fetchNotificaciones();
                    setLoadingNotif(false);
                  }
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="bell-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
              </div>

              {showNotifications && (
                <div className="notifications-popover glass-card">
                  <div className="notifications-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>Notificaciones {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>({unreadCount} nuevas)</span>}</h4>
                    {unreadCount > 0 && (
                      <button
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '0.4rem', whiteSpace: 'nowrap' }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await marcarTodasLeidas();
                          setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
                          setNoLeidas(0);
                        }}
                      >
                        Marcar todas leídas
                      </button>
                    )}
                  </div>
                  <div className="notifications-list" style={{ padding: '0.5rem' }}>
                    {loadingNotif ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Cargando...</div>
                    ) : notifications.length === 0 ? (
                      <div style={{
                        padding: '2.5rem 1rem',
                        textAlign: 'center',
                        color: '#94a3b8',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.8rem',
                        backgroundColor: 'rgba(241, 245, 249, 0.03)',
                        borderRadius: '0.75rem',
                        margin: '0.5rem'
                      }}>
                        <CheckCircle size={32} style={{ color: 'var(--green)', opacity: 0.8 }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>¡Sin notificaciones!</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Todo en orden por ahora</p>
                        </div>
                      </div>
                    ) : (
                      notifications.map(n => {
                        const tipoConfig = {
                          multa:     { Icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
                          minga:     { Icon: Calendar,      color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)' },
                          directiva: { Icon: Award,         color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
                          planilla:  { Icon: Wallet,        color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
                          sistema:   { Icon: Bell,          color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
                        }[n.tipo] || { Icon: Bell, color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' };
                        const { Icon, color, bg } = tipoConfig;
                        const isUnread = !n.leida;
                        const fecha = new Date(n.fecha_creacion);
                        const ahora = new Date();
                        const diffMin = Math.floor((ahora - fecha) / 60000);
                        const tiempoStr = diffMin < 1 ? 'Ahora mismo'
                          : diffMin < 60 ? `hace ${diffMin} min`
                          : diffMin < 1440 ? `hace ${Math.floor(diffMin / 60)}h`
                          : fecha.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' });

                        return (
                          <div
                            key={n.id}
                            className={`notification-item ${isUnread ? 'unread' : ''}`}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              backgroundColor: isUnread ? `${color}08` : 'transparent',
                              borderRadius: '0.75rem',
                              margin: '0.25rem 0.5rem',
                              padding: '0.85rem',
                              border: '1px solid transparent',
                              display: 'flex',
                              alignItems: 'flex-start',
                              position: 'relative',
                              overflow: 'hidden',
                              gap: '0.75rem',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${color}12`;
                              e.currentTarget.style.borderColor = `${color}30`;
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isUnread ? `${color}08` : 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            onClick={async () => {
                              if (isUnread) {
                                await marcarLeida(n.id);
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, leida: true } : item));
                                setNoLeidas(prev => Math.max(0, prev - 1));
                              }
                              setShowNotifications(false);
                              if (n.url_destino) navigate(n.url_destino);
                            }}
                          >
                            {isUnread && (
                              <div style={{
                                position: 'absolute',
                                left: 0, top: '50%',
                                transform: 'translateY(-50%)',
                                width: '4px', height: '40%',
                                backgroundColor: color,
                                borderRadius: '0 4px 4px 0'
                              }} />
                            )}
                            <div
                              className="notification-icon-wrapper"
                              style={{ background: bg, color, border: `1px solid ${color}20`, flexShrink: 0 }}
                            >
                              <Icon size={16} strokeWidth={2.5} />
                            </div>
                            <div className="notification-item-content" style={{ flex: 1, minWidth: 0 }}>
                              <p className="notification-title" style={{ fontSize: '0.88rem', fontWeight: isUnread ? '700' : '600', margin: 0 }}>{n.titulo}</p>
                              <p className="notification-text" style={{ fontSize: '0.79rem', lineHeight: '1.4', margin: '0.2rem 0 0' }}>{n.mensaje}</p>
                              <span className="notification-time" style={{ fontSize: '0.72rem', marginTop: '0.3rem', display: 'block', color: '#64748b' }}>{tiempoStr}</span>
                            </div>
                            <ChevronRight size={16} style={{ color: '#64748b', opacity: 0.5, flexShrink: 0, marginTop: '2px' }} />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Acceso rápido a Perfil */}
            <button 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', borderRadius: '2rem' }}
              onClick={() => navigate('/dashboard/perfil')}
            >
              <User size={16} />
              <span style={{ fontSize: '0.85rem' }}>{user?.nombre_completo || user?.username}</span>
            </button>
          </div>
        </div>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
