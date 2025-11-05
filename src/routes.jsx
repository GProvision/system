import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Autenticados from "./layouts/Autenticados";
import SindicatosPage from "./pages/sindicatos/SindicatosPage";
import SindicatoPage from "./pages/sindicatos/SindicatoPage";
import DelegacionesPage from "./pages/delegaciones/DelegacionesPage";
import DelegacionPage from "./pages/delegaciones/DelegacionPage";
import ArmazonesPage from "./pages/armazones/ArmazonesPage";
import ArmazonPage from "./pages/armazones/ArmazonPage";
import OpticasPage from "./pages/opticas/OpticasPage";
import OpticaPage from "./pages/opticas/OpticaPage";
import UsuariosPage from "./pages/usuarios/UsuariosPage";
import AdminsPage from "./pages/roles/AdminsPage";
import FichasPage from "./pages/fichas/FichasPage";
import FichasReportePage from "./pages/fichas/FichasReportePage";
import FichaCreatePage from "./pages/fichas/FichaCreatePage";
import FichaPage from "./pages/fichas/FichaPage";
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
            element: <AdminsPage />,
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
            element: <FichasPage />,
          },
          {
            path: "reporte",
            element: <FichasReportePage />,
          },
          {
            path: "create",
            element: <FichaCreatePage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <FichaPage />,
              },
            ],
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
              // {
              //   path: "stock",
              //   element: <ArmazonStockPage />,
              // },
            ],
          },
        ],
      },
      {
        path: "opticas",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <OpticasPage />,
          },
          {
            path: ":id",
            element: <OpticaPage />,
          },
        ],
      },
      {
        path: "usuarios",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <UsuariosPage />,
          },
        ],
      },
    ],
  },
]);

export default routes;
