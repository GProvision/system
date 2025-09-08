import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as z from "zod";
import useUser from "../context/useUser";
import path from "../path";

// Validation schema
const loginSchema = z.object({
  user: z.string().min(4, "El usuario debe tener mínimo 4 caracteres"),
  clave: z.string().min(4, "La clave debe tener mínimo 4 caracteres"),
});

const Login = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { access } = useUser();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/usuarios/verify", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data),
      });

      if(!response.ok){
        throw new Error("Error de autenticación");
      }

      const {usuario} = await response.json();


      // Store user data and redirect
      access(usuario);
      const defaultRoute = path[usuario.rol.nombre]?.find(route => route.principal)?.path || "/";
      navigate(defaultRoute);
      
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión");
      setFormError("clave", {
        type: "manual",
        message: "Usuario o contraseña incorrectos",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Inicio de sesión"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 
            className="text-3xl font-extrabold text-gray-900"
            tabIndex="0"
          >
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="rounded-md shadow-sm space-y-4">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="user" 
                className="block text-sm font-medium text-gray-700"
              >
                Usuario
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="user"
                  name="user"
                  type="text"
                  autoComplete="username"
                  autoCorrect="off"
                  autoCapitalize="off"
                  aria-invalid={errors.user ? "true" : "false"}
                  aria-describedby="user-error"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.user ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  {...register("user")}
                />
              </div>
              {errors.user && (
                <p 
                  id="user-error" 
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.user.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="clave" 
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="clave"
                  name="clave"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={errors.clave ? "true" : "false"}
                  aria-describedby="password-error"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.clave ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10`}
                  {...register("clave")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={isPasswordVisible}
                >
                  {isPasswordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7-4.902 0-9-2.943-9.542-7zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7-4.902 0-9-2.943-9.542-7zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.clave && (
                <p 
                  id="password-error" 
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.clave.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a 
                href="#" 
                className="font-medium text-blue-600 hover:text-blue-500"
                aria-label="¿Olvidaste tu contraseña?"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting 
                  ? 'bg-blue-400' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
              aria-busy={isSubmitting}
              aria-live="polite"
            >
              {isSubmitting ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
