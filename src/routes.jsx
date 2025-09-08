import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Autenticados from "./layouts/Autenticados";
import OpticasPage from "./pages/Opticas/OpticasPage";
import OpticasNuevas from "./pages/Opticas/OpticasNuevas";
import OpticaPage from "./pages/Opticas/OpticaPage";
import OpticasSindicatos from "./pages/Opticas/OpticasSindicatos";
const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Outlet />
        <Toaster position="top-center" reverseOrder={false} />
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
        path: "opticas",
        element: <Autenticados />,
        children: [
          {
            index: true,
            element: <OpticasPage />,
          },
          {
            path: "crear",
            element: <OpticasNuevas />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <OpticaPage />,
              },
              {
                path: ":delegacion/sindicatos",
                element: <OpticasSindicatos />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default routes;
