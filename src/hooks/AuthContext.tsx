// src/context/AuthContext.tsx
import { createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth"; // o la ruta donde tengas tu hook

const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth(); // tu lógica actual
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
  return context;
};
