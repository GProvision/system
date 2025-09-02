import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import routes from "./routes";
import { UserProvider } from "./context/useUser";
const $app = document.getElementById("root");
const root = createRoot($app);
root.render(
  <UserProvider>
    <RouterProvider router={routes} />
  </UserProvider>
);
