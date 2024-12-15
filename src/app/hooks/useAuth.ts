import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, getUserProfile } from '../lib/auth';
import { User } from '@/app/dashboard/types'; // Asegúrate de que la interfaz User esté importada correctamente

export function useAuth() {
  const [user, setUser] = useState<User | null>(null); // Esto debe ser 'User | null', no solo null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromLocalStorage() {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await getUserProfile(token); // 'userData' debe tener el tipo 'User'
          setUser(userData); // Se actualiza 'user' con los datos de tipo 'User'
        } catch (error) {
          console.error('Error loading user profile:', error);
          setError('Token inválido o sesión expirada. Por favor, inicia sesión nuevamente.');
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    }
    loadUserFromLocalStorage();
  }, []);

  const login = async (correo_electronico: string, contraseña: string) => {
    try {
      const { access_token } = await loginUser(correo_electronico, contraseña);
      localStorage.setItem('auth_token', access_token);
      const userData = await getUserProfile(access_token);
      setUser(userData); // 'user' se actualiza correctamente con los datos
      setError(null); // Limpia errores previos
      router.push('/dashboard'); // Redirige al dashboard
    } catch (error) {
      console.error('Login error:', error);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null); // 'user' se establece en null al cerrar sesión
    setError(null); // Limpia el error
    router.push('/login'); // Redirige al login
  };

  return { user, loading, error, login, logout }; // Devolvemos 'user' y el resto del estado
}
