import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistAuth = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    if (userData && jwtToken) {
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', jwtToken);
    } else {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    }
  };

  const logout = () => {
    persistAuth(null, null);
  };

  const request = useCallback(
    async (path, options = {}) => {
      const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) logout();
        throw new Error(data.message || 'Request failed');
      }
      return data;
    },
    [token]
  );

  const login = async (email, password, admin = false) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = admin ? '/auth/admin' : '/auth/login';
      const data = await request(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      persistAuth(data.user, data.token);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup - Create signup request awaiting admin approval
   */
  const signup = async (name, email, password, role = 'user') => {
    setLoading(true);
    setError(null);
    try {
      const data = await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      return {
        success: true,
        message: data.message,
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Basic token presence check (could be extended later)
    if (!token) {
      persistAuth(null, null);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
        request,
        API_BASE,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

