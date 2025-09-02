import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as z from "zod";
import useUser from "../context/useUser";
import path from "../path";
const Login = () => {
  const validate = z.object({
    user: z.string().min(4, "El usuario debe tener minimo 4 caracteres"),
    clave: z.string().min(4, "La clave debe tener minimo 4 caracteres"),
  });
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { access } = useUser();
  const { register, setError, handleSubmit, formState } = useForm({
    resolver: zodResolver(validate),
  });
  const { isSubmitting, errors } = formState;
  const action = async ({ user, clave }) => {
    try {
      const config = {};
      config.method = "POST";
      config.headers = { "Content-Type": "application/json" };
      config.body = JSON.stringify({ user, clave });
      const verify = await fetch("/api/usuarios/verify", config);
      if (!verify.ok) {
        const response = await verify.json();
        throw new Error(response.error);
      }
      const data = await verify.json();
      access({ ...data.usuario });
      const links = path[data.usuario.rol.nombre];
      const first = links
        .filter(({ principal }) => principal)
        .find((_, i) => i == 0);
      return toast.promise(navigate(first.path), {
        loading: "Verificando...",
        success: `Usuario verificado. Bienvenido ${data.usuario.nombre}`,
        error: "Error en verificar al usuario",
      });
    } catch (error) {
      toast.error(error.message || "Error del servidor");
    }
  };
  return (
    <section>
      <header>
        <h2>Iniciar Sesión</h2>
      </header>
      <form onSubmit={handleSubmit(action)}>
        <fieldset>
          <input type="text" placeholder="Usuario" {...register("user")} />
        </fieldset>
        <fieldset>
          <input
            type={visible ? "text" : "password"}
            placeholder="Clave"
            {...register("clave")}
          />
          <button type="button" onClick={() => setVisible(!visible)}>
            {!visible ? "Mostrar" : "Ocultar"}
          </button>
        </fieldset>
        <fieldset>
          {Object.keys(errors).length > 0 && (
            <ul>
              {Object.keys(errors).map((error, index) => (
                <li key={index}>{errors[error].message}</li>
              ))}
            </ul>
          )}
          <button>{isSubmitting ? "Ingresando" : "Ingresar"}</button>
        </fieldset>
      </form>
    </section>
  );
};

export default Login;
