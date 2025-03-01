"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwt.decode(token);

            if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
              console.warn("Token expired");
              localStorage.removeItem("token");
              setUser(null);
            } else {
              setUser(decoded);
            }
          } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (email_id, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded = jwt.decode(data.token);
        setUser(decoded);

        setTimeout(() => redirectUser(decoded?.role_id, decoded?.userId), 200);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTimeout(() => router.replace("/"), 100);
  };

  const redirectUser = (role_id, student_id) => {
    if (!student_id) return;
    if (role_id === 1) router.replace(`/student/${student_id}`);
    else if (role_id === 2) router.replace("/admin/dashboard");
    else if (role_id === 3) router.replace("/faculty/dashboard");
    else router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
