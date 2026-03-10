import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("te_token") : null;
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("te_user") : null;
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to load auth from storage", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginOrRegister = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("te_token", newToken);
      localStorage.setItem("te_user", JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("te_token");
      localStorage.removeItem("te_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginOrRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

