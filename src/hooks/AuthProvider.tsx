import { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider: FC<PropsWithChildren> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [isTransferred, setIsTransferred] = useState(localStorage.getItem('isTransferred') === 'true');

  const login = () => {setIsAuthenticated(true); localStorage.setItem('isAuthenticated', 'true')};
  const logout = () => {setIsAuthenticated(false); localStorage.setItem('isAuthenticated', 'false')};
  const transferIn = () => {setIsTransferred(true); localStorage.setItem('isTransferred', 'true')};
  const transferOut= () => {setIsTransferred(false); localStorage.setItem('isTransferred', 'false')};

  return (
    <AuthContext.Provider value={{ isAuthenticated, isTransferred, login, logout, transferIn, transferOut}}>
      {children}
    </AuthContext.Provider>
  );
}
