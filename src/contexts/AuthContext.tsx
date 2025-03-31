
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Types définis
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

// Données utilisateurs fictives (dans une vraie app, cela viendrait de votre API)
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@roadwise.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@roadwise.com',
    password: 'manager123',
    role: 'manager' as const,
  },
];

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Vérification de session existante au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('roadwise_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Échec de l\'analyse de l\'utilisateur stocké:', error);
        localStorage.removeItem('roadwise_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Dans une vraie application, vous feriez un appel API ici
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('roadwise_user', JSON.stringify(userWithoutPassword));
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue, ${userWithoutPassword.name}!`,
      });
    } else {
      toast({
        title: 'Échec de la connexion',
        description: 'Email ou mot de passe incorrect',
        variant: 'destructive',
      });
      throw new Error('Identifiants invalides');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('roadwise_user');
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
