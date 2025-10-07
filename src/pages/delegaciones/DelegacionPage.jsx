import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { X, Save, Pen, Info, ChevronLeft, Trash2, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import Button from "../../components/shared/Button";

const DelegacionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delegacion, setDelegacion] = useState(null);
  const [provincia, setProvincia] = useState(null);
  const [localidad, setLocalidad] = useState(null);
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      provincia: "",
      localidad: "",
      activo: false,
    },
  });
  const getDelegacion = async () => {
    const response = await fetch(`/api/delegaciones/${id}`);
    const data = await response.json();
    setDelegacion(data);
    setValue("provincia", data.provincia);
    setValue("localidad", data.localidad);
    setValue("activo", data.activo);
  };
  const getProvincias = async () => {
    const response = await fetch(
      "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=100"
    );
    const data = await response.json();
    const sortedProvincias = data.provincias.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
    setProvincias(sortedProvincias);
    if (delegacion?.provincia) {
      const provinciaEncontrada = sortedProvincias.find(
        (p) => p.nombre === delegacion.provincia
      );
      if (provinciaEncontrada) {
        setProvincia(provinciaEncontrada.id);
      }
    }
  };
  const getLocalidades = async () => {
    if (!provincia) return;
    const response = await fetch(
      `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&campos=id,nombre&max=1000`
    );
    const data = await response.json();
    const sortedLocalidades = data.localidades.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
    setLocalidades(sortedLocalidades);
    if (delegacion?.localidad) {
      const localidadEncontrada = sortedLocalidades.find(
        (l) => l.nombre === delegacion.localidad
      );
      if (localidadEncontrada) {
        setLocalidad(localidadEncontrada.id);
      }
    }
  };

  const editDelegacion = async (data) => {
    const { provincia, localidad, activo } = data;

    if (!provincia) {
      toast.error("Debe seleccionar una provincia");
      return;
    }
    if (!localidad) {
      toast.error("Debe seleccionar una localidad");
      return;
    }
    const confirmResult = await Swal.fire({
      title: "¿Está seguro?",
      text: "Se editará la delegación con los nuevos datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmResult.isConfirmed) {
      return;
    }
    try {
      const response = await fetch("/api/delegaciones/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: delegacion.id,
          provincia,
          localidad,
          activo: Boolean(activo),
        }),
      });
      if (response.ok) {
        await getDelegacion();
        setIsEditFormOpen(false);
        toast.success("Delegacion editada exitosamente");
        reset();
      } else {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getDelegacion();
  }, [id]);

  useEffect(() => {
    if (delegacion) {
      getProvincias();
    }
  }, [delegacion]);

  useEffect(() => {
    if (provincia) {
      getLocalidades();
    }
  }, [provincia]);
  if (!delegacion || !provincias || !localidades) return null;
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/delegaciones")}>
            <ChevronLeft className="size-4" />
          </Button>
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
          <Button
            type={!isEditFormOpen ? "edit" : "cancel"}
            onClick={() => setIsEditFormOpen(!isEditFormOpen)}
          >
            {!isEditFormOpen ? (
              <Pen className="size-4" />
            ) : (
              <X className="size-4" />
            )}
          </Button>
          {!delegacion.activo && (
            <Button type="cancel" onClick={() => console.log("Eliminar")}>
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </header>
      {isEditFormOpen && (
        <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Editar Delegacion
            </h2>
          </header>
          <form
            className="flex flex-col gap-4 items-center justify-start max-w-xl mx-auto"
            onSubmit={handleSubmit(editDelegacion)}
          >
            <fieldset className="w-full flex flex-col items-center justify-start">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="provincia"
              >
                Provincia
                <span className="text-red-500" aria-label="campo requerido">
                  *
                </span>
              </label>
              <select
                defaultValue={provincia}
                aria-required="true"
                aria-describedby="provincia-help"
                className={`block cursor-pointer w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                  errors.provincia
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                id="provincia"
                onChange={(e) => {
                  setProvincia(e.target.value);
                  setValue("localidad", "");
                  setLocalidad(null);
                  setValue(
                    "provincia",
                    provincias.find((p) => p.id === e.target.value)?.nombre ||
                      ""
                  );
                }}
              >
                <option value="">Seleccione una provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="w-full flex flex-col items-center justify-start">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="localidad"
              >
                Localidad
                <span className="text-red-500" aria-label="campo requerido">
                  *
                </span>
              </label>
              <select
                defaultValue={localidad || ""}
                aria-required="true"
                aria-describedby="localidad-help"
                className={`block cursor-pointer w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                  errors.localidad
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                id="localidad"
                disabled={!provincia}
                onChange={(e) => {
                  setLocalidad(e.target.value);
                  setValue(
                    "localidad",
                    localidades.find((l) => l.id === e.target.value)?.nombre ||
                      ""
                  );
                }}
              >
                <option value="">Seleccione una localidad</option>
                {localidades.map((localidad) => (
                  <option key={localidad.id} value={localidad.id}>
                    {localidad.nombre}
                  </option>
                ))}
              </select>
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
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white flex cursor-pointer items-center justify-center p-2 rounded"
              type="submit"
              disabled={isSubmitting}
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
    </section>
  );
};

export default DelegacionPage;
