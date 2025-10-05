import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { X, Save, Pen, Info } from "lucide-react";
const SindicatoPage = () => {
  const { id } = useParams();
  const [sindicato, setSindicato] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombre: "",
      activo: false,
    },
  });
  const getSindicato = async () => {
    const response = await fetch(`/api/sindicatos/${id}`);
    const data = await response.json();
    setSindicato(data);
    setValue("nombre", data.nombre);
    setValue("activo", data.activo);
  };

  const editSindicato = async (data) => {
    data.activo = Boolean(data.activo);
    const response = await fetch(`/api/sindicatos/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, idSindicato: Number(id) }),
    });
    if (response.ok) {
      await getSindicato();
      setIsEditFormOpen(false);
    }
  };

  useEffect(() => {
    getSindicato();
  }, []);
  if (!sindicato) return null;
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{sindicato.nombre}</h1>
        <button
          onClick={() => setIsEditFormOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          aria-label="Cancelar edición del sindicato"
        >
          <Pen className="w-4 h-4 mr-2" /> Editar Sindicato
        </button>
      </header>
      {isEditFormOpen && (
        <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Editar Sindicato
            </h2>
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Cancelar edición del sindicato"
              onClick={() => setIsEditFormOpen(false)}
            >
              <X className="w-4 h-4 mr-2" /> Cancelar
            </button>
          </header>
          <form
            className="space-y-4 grid grid-cols-1 gap-4"
            onSubmit={handleSubmit(editSindicato)}
          >
            <fieldset className="flex flex-wrap items-center">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre del Sindicato
                <span className="text-red-500" aria-label="campo requerido">
                  *
                </span>
              </label>
              <input
                id="nombre"
                type="text"
                aria-required="true"
                aria-describedby={
                  errors.nombre ? "nombre-error" : "nombre-help"
                }
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                  errors.nombre
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Ingrese el nombre del sindicato"
                {...register("nombre", {
                  required: "El nombre es requerido",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                  maxLength: {
                    value: 100,
                    message: "El nombre debe tener menos de 100 caracteres",
                  },
                })}
              />
              <div id="nombre-help" className="sr-only">
                Ingrese el nombre del sindicato
              </div>
              {errors.nombre && (
                <p
                  className="mt-2 text-sm text-red-600 flex items-center"
                  role="alert"
                >
                  <Info className="w-4 h-4 mr-2" />
                  {errors.nombre.message}
                </p>
              )}
            </fieldset>
            <fieldset className="flex items-center">
              <input
                id="activo"
                type="checkbox"
                aria-describedby="activo-help"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                {...register("activo")}
              />
              <label
                htmlFor="activo"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Sindicato activo
              </label>
              <div id="activo-help" className="sr-only">
                Indica si el sindicato está activo
              </div>
            </fieldset>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              aria-describedby="submit-help"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Actualizando...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Actualizar Sindicato
                </>
              )}
            </button>
          </form>
        </section>
      )}
    </section>
  );
};

export default SindicatoPage;

/*
          <form className="space-y-6 grid grid-cols-1 gap-6" onSubmit={handleSubmit(editSindicato)} noValidate>
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Sindicato <span className="text-red-500" aria-label="campo requerido">*</span>
                </label>
                <div className="relative">
                  <input
                    id="nombre"
                    type="text"
                    aria-required="true"
                    aria-describedby={errors.nombre ? "nombre-error" : "nombre-help"}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                      errors.nombre
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Ingrese el nombre del sindicato"
                    {...register("nombre", {
                      required: "El nombre es requerido",
                      minLength: {
                        value: 3,
                        message: "El nombre debe tener al menos 3 caracteres",
                      },
                      maxLength: {
                        value: 100,
                        message: "El nombre debe tener menos de 100 caracteres",
                      },
                    })}
                  />
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p id="nombre-help" className="text-xs text-gray-500">
                      El nombre debe tener entre 3 y 100 caracteres
                    </p>
                  </div>
                </div>
                {errors.nombre && (
                  <p id="nombre-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Estado del Sindicato
                </legend>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="activo"
                        type="checkbox"
                        aria-describedby="activo-help"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                        {...register("activo")}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="activo" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Sindicato activo
                      </label>
                      <p id="activo-help" className="text-xs text-gray-500 mt-1">
                        Los sindicatos activos pueden recibir y gestionar solicitudes
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                aria-describedby="submit-help"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Actualizar Sindicato
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsEditFormOpen(false)}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              <div id="submit-help" className="sr-only">
                Guarda los cambios realizados en el sindicato
              </div>
            </div>
          </form>
        </section>

*/
