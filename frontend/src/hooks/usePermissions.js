import useAuthStore from '../store/useAuthStore';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  // Función para comprobar si el usuario tiene un permiso específico
  const hasPermission = (permission) => {
    if (!user || !user.permisos) return false;
    // Si es Administrador, podríamos darle pase libre a todo, pero es más seguro verificar el array
    return user.permisos.includes(permission);
  };

  // Función para comprobar el rol exacto (útil para títulos o lógicas simples)
  const isRole = (roleName) => {
    return user?.rol === roleName;
  };

  return { hasPermission, isRole, userRole: user?.rol };
}
