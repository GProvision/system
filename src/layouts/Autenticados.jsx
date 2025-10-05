import React from "react";
import { Navigate, Outlet, useMatch, useLocation } from "react-router";
import useUser from "../context/useUser";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import path from "../path";
import { Toaster } from "react-hot-toast";

const useRouteAccess = (user) => {
  const location = useLocation();
  const match = useMatch(location.pathname);

  if (!user?.rol?.nombre) return false;
  if (user.rol.nombre === "admin") return true;
  const userRoutes = path[user.rol.nombre] || [];
  return userRoutes.some((route) => match?.pathname === route.path);
};

const Autenticados = () => {
  const { user } = useUser();
  const hasAccess = useRouteAccess(user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    const defaultRoute =
      path[user.rol.nombre]?.find((route) => route.principal)?.path ||
      path[user.rol.nombre]?.[0]?.path ||
      "/";
    return <Navigate to={defaultRoute} replace />;
  }

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Autenticados;
