import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Loader, Plus, Save, X } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/shared/Button";
const OpticasPage = () => {
  const [opticas, setOpticas] = useState([]);
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
              return !opticas.find(
                (o) => o.nombre.toLowerCase() === val.toLowerCase()
              );
            },
            { message: "Ya existe una optica con ese nombre" }
          ),
      })
    ),
    defaultValues: { nombre: "" },
  });
  const navigate = useNavigate();
  const getOpticas = async () => {
    const response = await fetch("/api/opticas");
    const data = await response.json();
    setOpticas(data);
  };
  const addOptica = async (data) => {
    try {
      const response = await fetch("/api/opticas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
      await getOpticas();
      setIsAddFormOpen(false);
      toast.success("Optica agregada exitosamente");
      reset();
    } catch (error) {
      toast.error(error.message || "Error al agregar la optica");
    }
  };
  useEffect(() => {
    getOpticas();
  }, []);

  if (!opticas) return <Loader className="animate-spin mx-auto" />;
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Opticas</h1>
        <Button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          style={!isAddFormOpen ? "add" : "cancel"}
        >
          {!isAddFormOpen ? (
            <Plus className="size-4" />
          ) : (
            <X className="size-4" />
          )}
        </Button>
      </header>
      {isAddFormOpen && (
        <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Agregar Optica</h2>
          </header>
          <form className="flex flex-col gap-4 items-center justify-start max-w-xl mx-auto">
            <fieldset className="flex flex-wrap items-center">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de la Optica
                <span className="text-red-500" aria-label="campo requerido">
                  *
                </span>
              </label>
              <input
                type="text"
                id="nombre"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.nombre
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Ingrese el nombre de la optica"
                autoComplete="off"
                {...register("nombre")}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </fieldset>
            <Button
              type="add"
              disabled={isSubmitting}
              onClick={handleSubmit(addOptica)}
            >
              {isSubmitting ? (
                <Loader className="animate-spin size-4" />
              ) : (
                <Save className="size-4" />
              )}
            </Button>
          </form>
        </section>
      )}
      {opticas.length === 0 && (
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          No hay Opticas
        </div>
      )}
      {opticas.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
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
            <tbody className="divide-y divide-gray-200">
              {opticas.map((optica) => (
                <tr
                  key={optica.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/opticas/${optica.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium text-gray-900 ">
                    {optica.nombre}
                  </td>
                  <td className="px-2 py-4">
                    <span
                      className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        optica.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {optica.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
};

export default OpticasPage;
