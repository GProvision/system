import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Loader, Plus, Save, X } from "lucide-react";
const SindicatosPage = () => {
  const [sindicatos, setSindicatos] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const getSindicatos = async () => {
    const response = await fetch("/api/sindicatos");
    const data = await response.json();
    setSindicatos(data);
  };

  const addSindicato = async (data) => {
    try {
      const response = await fetch("/api/sindicatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await getSindicatos();
        setIsAddFormOpen(false);
        toast.success("Sindicato agregado exitosamente");
      } else {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
    } catch (error) {
      toast.error(error.message || "Error al agregar el sindicato");
    }
  };

  useEffect(() => {
    getSindicatos();
  }, []);

  if (!sindicatos) return null;

  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Sindicatos</h1>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white flex cursor-pointer items-center justify-center p-2 rounded"
        >
          <Plus className="size-4" />
        </button>
      </header>
      {isAddFormOpen && (
        <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Agregar Sindicato
            </h2>
            <button
              onClick={() => setIsAddFormOpen(false)}
              className="bg-red-500 hover:bg-red-600 text-white flex cursor-pointer items-center justify-center p-2 rounded"
            >
              <X className="size-4" />
            </button>
          </header>
          <form
            className="flex flex-col gap-4 items-center justify-start max-w-xl mx-auto"
            onSubmit={handleSubmit(addSindicato)}
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white flex cursor-pointer items-center justify-center p-2 rounded"
            >
              {isSubmitting ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
            </button>
          </form>
        </section>
      )}

      {sindicatos.length === 0 && (
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          No hay sindicatos
        </div>
      )}

      {sindicatos.length > 0 && (
        <table className="min-w-full divide-y divide-gray-200 overflow-x-scroll">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sindicatos.map((sindicato) => (
              <tr
                key={sindicato.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/sindicatos/${sindicato.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium text-gray-900 ">
                  {sindicato.nombre}
                </td>
                <td className="px-2 py-4">
                  <span
                    className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                      sindicato.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sindicato.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default SindicatosPage;
