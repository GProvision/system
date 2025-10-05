import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { X, Save, Pen, Info, ChevronLeft, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const DelegacionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delegacion, setDelegacion] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombre: "",
      activo: false,
    },
  });
  const getDelegacion = async () => {
    const response = await fetch(`/api/delegaciones/${id}`);
    const data = await response.json();
    setDelegacion(data);
    setValue("nombre", data.nombre);
    setValue("activo", data.activo);
  };
  useEffect(() => {
    getDelegacion();
  }, []);
  if (!delegacion) return null;
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/sindicatos")}
            className=" cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            aria-label="Cancelar edición del sindicato"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Regresar
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {delegacion.provincia} - {delegacion.localidad}
          <span
            className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
              delegacion.activo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {delegacion.activo ? "Activo" : "Inactivo"}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditFormOpen(true)}
            className=" cursor-pointer inline-flex items-center justify-center p-4 text-sm font-medium text-gray-900 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            aria-label="Editar Delegación"
          >
            <Pen className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => console.log("Eliminar")}
            className=" cursor-pointer inline-flex items-center justify-center p-4 text-sm font-medium text-gray-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            aria-label="Eliminar Delegación"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </header>
    </section>
  );
};

export default DelegacionPage;
