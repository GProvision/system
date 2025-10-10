import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Loader, Plus, Save, X } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/shared/Button";
const SindicatosPage = () => {
  const [sindicatos, setSindicatos] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      z.object({
        nombre: z
          .string()
          .refine(
            (val) => {
              let text = val.trim();
              // Contar los caracteres sin espacios internos
              let regex = /\s+/g;
              text = text.replace(regex, " ");
              return text.length > 3;
            },
            { message: "El nombre es obligatorio" }
          )
          .refine(
            (val) => {
              return !sindicatos.find(
                (o) => o.nombre.toLowerCase() === val.toLowerCase()
              );
            },
            { message: "Ya existe un sindicato con ese nombre" }
          ),
      })
    ),
    defaultValues: { nombre: "" },
  });
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
        reset();
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
        <Button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          style={!isAddFormOpen ? "add" : "cancel"}
        >
          {!isAddFormOpen ? (
            <Plus className="size-4 text-blue-50" />
          ) : (
            <X className="size-4 text-red-50" />
          )}
        </Button>
      </header>
      {isAddFormOpen && (
        <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Agregar Sindicato
            </h2>
          </header>
          <form className="flex flex-col gap-4 items-center justify-start max-w-xl mx-auto">
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
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Ingrese el nombre del sindicato"
                {...register("nombre")}
              />
              <div id="nombre-help" className="sr-only">
                Ingrese el nombre del sindicato
              </div>
              {errors.nombre && (
                <p
                  className="mt-2 text-sm text-red-600 flex items-center"
                  role="alert"
                >
                  {errors.nombre.message}
                </p>
              )}
            </fieldset>
            <Button
              type="add"
              disabled={isSubmitting}
              onClick={handleSubmit(addSindicato)}
            >
              {isSubmitting ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
            </Button>
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
