import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useGetCurrentUser, UserWithProfile } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: UserWithProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("maaun_token"));
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading: isUserLoading, error } = useGetCurrentUser({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  const isLoading = isUserLoading && !!token;

  useEffect(() => {
    if (error) {
      logout();
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      });
    }
  }, [error]);

  const login = (newToken: string) => {
    localStorage.setItem("maaun_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("maaun_token");
    setToken(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user: user || null, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
