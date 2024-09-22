import { createContext, useState } from "react";

export const Context = createContext({ isAuthenticated: false });

const ContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </Context.Provider>
  );
};


export default ContextProvider;