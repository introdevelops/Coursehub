'use client';

import React, { createContext, useContext } from 'react';

interface AuthContextProps {
 
  isTutor: boolean;
  
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AuthContextProps;
}) => {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
