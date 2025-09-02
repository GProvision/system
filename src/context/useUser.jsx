import { createContext, useContext, useEffect, useState } from "react";

const UserStore = createContext(null);

const getUser = () => {
  const user = localStorage.getItem("usuario") || null;
  if (user) return JSON.parse(user);
  return null;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getUser);
  useEffect(() => {
    if (user != null) {
      return localStorage.setItem("usuario", JSON.stringify(user));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [user]);
  const access = (data) => setUser(data);
  const logout = () => setUser(null);
  return (
    <UserStore.Provider value={{ user, access, logout }}>
      {children}
    </UserStore.Provider>
  );
};

const useUser = () => useContext(UserStore);

export default useUser;
