import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Autenticados from "./layouts/Autenticados";
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
            element: <h1>Opticas</h1>,
          },
          {
            path: "crear",
            element: (
              <>
                <h1>Optica Nueva</h1>
              </>
            ),
          },
          {
            path: ":id",
            element: (
              <>
                <h1>Optica</h1>
              </>
            ),
          },
          {
            path: ":id/delegaciones",
            element: (
              <>
                <h1>Optica Delegaciones</h1>
              </>
            ),
          },
          {
            path: ":id/:delegacion/sindicatos",
            element: (
              <>
                <h1>Optica Delegacion Sindicatos</h1>
              </>
            ),
          },
        ],
      },
    ],
  },
]);

export default routes;
