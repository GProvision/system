import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Autenticados from "./layouts/Autenticados";
import SindicatosPage from "./pages/sindicatos/SindicatosPage";
import SindicatoPage from "./pages/sindicatos/SindicatoPage";
import DelegacionesPage from "./pages/delegaciones/DelegacionesPage";
import DelegacionPage from "./pages/delegaciones/DelegacionPage";
import DelegacionOpticaPage from "./pages/delegaciones/DelegacionOpticaPage";
import ArmazonesPage from "./pages/armazones/ArmazonesPage";
import ArmazonPage from "./pages/armazones/ArmazonPage";
import ArmazonStockPage from "./pages/armazones/ArmazonStockPage";
const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Outlet />
        <Toaster position="top-right" reverseOrder={true} />
      </>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"login"} />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "admin",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <h1>Administradores</h1>,
          },
        ],
      },
      {
        path: "boss",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <h1>Jefes</h1>,
          },
        ],
      },
      {
        path: "owners",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <h1>Gerentes</h1>,
          },
        ],
      },
      {
        path: "fichas",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <h1>Fichas</h1>,
          },
        ],
      },
      {
        path: "sindicatos",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <SindicatosPage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <SindicatoPage />,
              },
            ],
          },
        ],
      },
      {
        path: "delegaciones",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <DelegacionesPage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <DelegacionPage />,
              },
              {
                path: ":optica",
                element: <DelegacionOpticaPage />,
              },
            ],
          },
        ],
      },
      {
        path: "armazones",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <ArmazonesPage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <ArmazonPage />,
              },
              {
                path: "stock",
                element: <ArmazonStockPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default routes;
