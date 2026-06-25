import { useCallback } from 'react';
import useAuthStore from '../store/useAuthStore';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  const hasPermission = useCallback((permission) => {
    if (!user?.permisos) return false;
    return user.permisos.includes(permission);
  }, [user?.permisos]);

  const isRole = useCallback((roleName) => {
    return user?.rol === roleName;
  }, [user?.rol]);

  return { hasPermission, isRole, userRole: user?.rol };
}
