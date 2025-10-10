import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { X, Pen, ChevronLeft, Trash2, Loader, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import Button from "../../components/shared/Button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const SindicatoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sindicato, setSindicato] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      z.object({
        nombre: z.string().refine((val) => {
          let text = val.trim();
          // Contar los caracteres sin espacios internos
          let regex = /\s+/g;
          text = text.replace(regex, " ");
          return text.length > 3;
        }),
        activo: z.preprocess(
          (val) => val === "on" || val === true,
          z.boolean()
        ),
      })
    ),
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
    try {
      data.activo = Boolean(data.activo);
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de editar este sindicato?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, editar",
        cancelButtonText: "Cancelar",
      });
      if (!confirm.isConfirmed) return;
      const response = await fetch(`/api/sindicatos/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, idSindicato: Number(id) }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
      await getSindicato();
      setIsEditFormOpen(false);
      toast.success("Sindicato editado exitosamente");
    } catch (error) {
      toast.error(error);
    }
  };

  const deleteSindicato = async () => {
    try {
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de eliminar este sindicato?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
      if (!confirm.isConfirmed) return;
      const response = await fetch(`/api/sindicatos/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(id) }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      navigate("/sindicatos");
      toast.success("Sindicato eliminado exitosamente");
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getSindicato();
  }, []);
  if (!sindicato) return null;
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/sindicatos")}
            type="default"
            aria-label="Cancelar edición del sindicato"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {sindicato.nombre}
          <span
            className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
              sindicato.activo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {sindicato.activo ? "Activo" : "Inactivo"}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <Button
            style={isEditFormOpen ? "cancel" : "edit"}
            onClick={() => setIsEditFormOpen(!isEditFormOpen)}
          >
            {!isEditFormOpen ? (
              <Pen className="size-4" />
            ) : (
              <X className="size-4" />
            )}
          </Button>
          {!sindicato.activo && (
            <Button
              type="cancel"
              onClick={() => deleteSindicato()}
              aria-label="Cancelar edición del sindicato"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </header>
      {isEditFormOpen && (
        <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Editar Sindicato
            </h2>
          </header>
          <form className="space-y-4 flex flex-col items-center justify-start gap-4">
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
                  {errors.nombre.message}
                </p>
              )}
            </fieldset>
            <fieldset className="flex items-center gap-1">
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
                Activo
              </label>
              <div id="activo-help" className="sr-only">
                Indica si el sindicato está activo
              </div>
            </fieldset>
            <Button
              style={!isSubmitting ? "add" : "default"}
              disabled={isSubmitting}
              onClick={handleSubmit(editSindicato)}
            >
              {isSubmitting ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>
          </form>
        </section>
      )}
      <ul className="grid grid-cols-3 gap-4">
        <li className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center aspect-square">
          <span className="text-sm font-medium text-gray-500">Opticas</span>
          <span className="font-bold">{sindicato.opticas.length}</span>
        </li>
        <li className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center aspect-square">
          <span className="text-sm font-medium text-gray-500">Clientes</span>
          <span className="font-bold">{sindicato.clientes.length}</span>
        </li>
        <li className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center aspect-square">
          <span className="text-sm font-medium text-gray-500">Fichas</span>
          <span className="font-bold">{sindicato.fichas.length}</span>
        </li>
      </ul>
    </section>
  );
};

export default SindicatoPage;
