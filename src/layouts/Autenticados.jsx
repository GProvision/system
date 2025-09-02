import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useMatch } from "react-router";
import useUser from "../context/useUser";
import Header from "../components/shared/header";
import Footer from "../components/shared/Footer";
import path from "../path";
const Autenticados = () => {
  const { pathname } = useLocation();
  const { user } = useUser();
  if (!user) return <Navigate to={"/login"} replace />;
  const tieneAcceso = path[user.rol.nombre]?.some(({ path }) => {
    const match = useMatch(path);
    return match !== null;
  });
  if (!tieneAcceso)
    return (
      <Navigate
        to={
          path[user.rol.nombre].find(
            ({ principal }, index) => principal && index == 0
          ).path
        }
        replace
      />
    );
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Autenticados;
