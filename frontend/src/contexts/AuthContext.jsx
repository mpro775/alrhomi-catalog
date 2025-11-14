// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

// أنشئ سياق يحتفظ باسم المفتاح accessToken بدلاً من token
export const AuthContext = createContext({ accessToken: null, role: null, username: null });

export function AuthProvider({ children }) {
  // قراءة accessToken و role و username من localStorage
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  // استمع لتغيرات localStorage (حتى من تبويبات أخرى)
  useEffect(() => {
    function onStorage() {
      setAccessToken(localStorage.getItem("accessToken"));
      setRole(localStorage.getItem("role"));
      setUsername(localStorage.getItem("username"));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, role, username, setAccessToken, setRole, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
}
