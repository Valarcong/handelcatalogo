import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

type DbUserExtra = {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  roles: Array<{
    id: string;
    nombre: string;
    descripcion: string | null;
    permisos: string[] | null;
    activo: boolean;
  }>;
};

export const useAuth = () => {
  const [authUser, setAuthUser] = useState<any>(null); // user de Supabase Auth
  const [userExtra, setUserExtra] = useState<DbUserExtra | null>(null); // datos extra de API
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // Función helper para obtener datos del usuario con roles usando las nuevas funciones de BD
  const fetchUserWithRoles = async (userId: string) => {
    console.log('Obteniendo datos del usuario:', userId);
    
    try {
      // Primera consulta: obtener datos básicos del usuario usando maybeSingle para evitar errores 406
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error("Error obteniendo datos básicos del usuario:", userError.message);
        return null;
      }

      if (!userData) {
        console.log("No se encontraron datos del usuario en la tabla usuarios");
        return null;
      }

      console.log("Datos básicos del usuario obtenidos:", userData);

      // Segunda consulta: obtener roles del usuario - ahora simplificada sin JOIN problemático
      const { data: rolesData, error: rolesError } = await supabase
        .from('usuario_roles')
        .select(`
          activo,
          fecha_fin,
          roles (
            id,
            nombre,
            descripcion,
            permisos,
            activo
          )
        `)
        .eq('usuario_id', userId)
        .eq('activo', true);

      if (rolesError) {
        console.error("Error obteniendo roles del usuario:", rolesError.message);
        // Continuar sin roles en caso de error
      }

      console.log("Datos de roles obtenidos:", rolesData);

      // Filtrar roles activos y vigentes
      const now = new Date();
      const activeRoles = rolesData
        ? rolesData
            .filter((ur: any) => {
              // Verificar que el rol esté activo
              if (!ur.activo) return false;
              
              // Verificar que no haya fecha de fin o que sea futura
              if (ur.fecha_fin && new Date(ur.fecha_fin) <= now) return false;
              
              // Verificar que el rol mismo esté activo
              return ur.roles && ur.roles.activo;
            })
            .map((ur: any) => ur.roles)
        : [];

      const userWithRoles = {
        id: userData.id,
        nombre: userData.nombre,
        usuario: userData.usuario,
        email: userData.email,
        roles: activeRoles
      };

      console.log("Usuario con roles procesado:", userWithRoles);
      return userWithRoles;

    } catch (err) {
      console.error("Error inesperado al obtener datos del usuario:", err);
      return null;
    }
  };

  // Cargar usuario autenticado + extra (AHORA claramente separados)
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          setAuthUser(null);
          setUserExtra(null);
          return;
        }
        if (data?.user) {
          setAuthUser(data.user);
          const extra = await fetchUserWithRoles(data.user.id);
          setUserExtra(extra);
        } else {
          setAuthUser(null);
          setUserExtra(null);
        }
      } catch {
        setAuthUser(null);
        setUserExtra(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        throw new Error('Credenciales incorrectas');
      }
      setAuthUser(data.user);
      const extra = await fetchUserWithRoles(data.user.id);
      setUserExtra(extra);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setUserExtra(null);
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = useMemo(() => (roleName: string) =>
    userExtra?.roles?.some(role => role.nombre === roleName) || false
  , [userExtra]);

  // Función para verificar si el usuario tiene un permiso específico
  const hasPermission = useMemo(() => (permission: string) =>
    userExtra?.roles?.some(role => role.permisos?.includes(permission)) || false
  , [userExtra]);

  // Funciones de conveniencia (usan SIEMPRE userExtra real)
  const isAdmin = useMemo(() => hasRole('Administrador'), [hasRole]);
  const isVendedor = useMemo(() => hasRole('Vendedor'), [hasRole]);

  // Debug update
  console.log("Auth actual:", { 
    authUser, 
    userExtra, 
    loading, 
    isAdmin, 
    isVendedor, 
    roles: userExtra?.roles?.map(r => r.nombre) 
  });

  return {
    // Separados: el authUser (Supabase) y el userExtra (app)
    authUser,
    user: userExtra,
    userExtra,
    loading,
    login,
    loginLoading,
    logout,
    hasRole,
    hasPermission,
    isAdmin,
    isVendedor
  };
};
