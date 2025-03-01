"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ FIXED: Use from "next/navigation"
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter(); // ✅ FIXED

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      setUser(decoded);
    }
  }, []);

  const login = async (email_id, password) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_id, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      setUser(jwt.decode(data.token));
      redirectUser(data.role);
    } else {
      alert(data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login"); // ✅ FIXED: Now works in "app/" directory
  };

  const redirectUser = (role) => {
    if (role === "1") router.push("/student/dashboard");
    else if (role === "2") router.push("/admin/dashboard");
    else if (role === "3") router.push("/faculty/dashboard");
    else router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
