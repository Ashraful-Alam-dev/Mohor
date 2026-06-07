"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem(
          "mohor_user"
        );

      if (savedUser) {
        setUser(
          JSON.parse(savedUser)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (
    token,
    userData
  ) => {
    localStorage.setItem(
      "mohor_token",
      token
    );

    localStorage.setItem(
      "mohor_user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(
      "mohor_token"
    );

    localStorage.removeItem(
      "mohor_user"
    );

    setUser(null);

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated:
          !!user,
        isAdmin:
          user?.role ===
          "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);