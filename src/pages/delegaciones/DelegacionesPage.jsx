import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { ChevronLeft, Loader, Plus, Save, X } from "lucide-react";
import Button from "../../components/shared/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
const DelegacionesPage = () => {
  const [delegaciones, setDelegaciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [provinciaId, setProvinciaId] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      z.object({
        provincia: z.string().min(1, "La provincia es requerida"),
        localidad: z.string().min(1, "La localidad es requerida"),
        activo: z.preprocess(
          (val) => val === "on" || val === true,
          z.boolean()
        ),
      })
    ),
    defaultValues: {
      provincia: "",
      localidad: "",
      activo: false,
    },
  });
  const getDelegaciones = async () => {
    const response = await fetch("/api/delegaciones");
    const data = await response.json();
    setDelegaciones(data);
  };

  const getProvincias = async () => {
    const response = await fetch(
      "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=100"
    );
    const data = await response.json();
    setProvincias(
      data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre))
    );
  };

  useEffect(() => {
    getDelegaciones();
    getProvincias();
  }, []);

  useEffect(() => {
    const getLocalidades = async () => {
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinciaId}&campos=id,nombre&max=1000`
      );
      const data = await response.json();
      setLocalidades(
        data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre))
      );
    };
    if (provinciaId) {
      getLocalidades();
    }
  }, [provinciaId]);

  const addDelegacion = async (data) => {
    const { provincia, localidad } = data;

    if (!provincia) {
      toast.error("Debe seleccionar una provincia");
      return;
    }
    if (!localidad) {
      toast.error("Debe seleccionar una localidad");
      return;
    }
    try {
      const response = await fetch("/api/delegaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await getDelegaciones();
        setIsAddFormOpen(false);
        toast.success("Delegacion agregada exitosamente");
        reset();
      } else {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Delegaciones</h1>
        <Button
          type={!isAddFormOpen ? "add" : "cancel"}
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
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
            <h2 className="text-2xl font-bold text-gray-900">
              Agregar Delegacion
            </h2>
          </header>
          <form className="flex flex-col gap-4 items-center justify-start max-w-xl mx-auto">
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
                aria-required="true"
                aria-describedby="provincia-help"
                className={`block cursor-pointer w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                  errors.provincia
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                id="provincia"
                onChange={(e) => {
                  setProvinciaId(e.target.value);
                  setValue("localidad", "");
                  setValue(
                    "provincia",
                    provincias.find((p) => p.id === e.target.value)?.nombre
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
                aria-required="true"
                aria-describedby="localidad-help"
                className={`block cursor-pointer w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                  errors.localidad
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                id="localidad"
                disabled={!provinciaId}
                onChange={(e) => {
                  setValue(
                    "localidad",
                    localidades.find((l) => l.id === e.target.value)?.nombre
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
            <Button
              type="add"
              onClick={handleSubmit(addDelegacion)}
              disabled={isSubmitting}
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
      {delegaciones.length === 0 && (
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          No hay delegaciones
        </div>
      )}
      {delegaciones.length > 0 && (
        <>
          <table className="min-w-full divide-y divide-gray-200 overflow-x-scroll">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provincia
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localidad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {delegaciones
                .slice((page - 1) * 10, page * 10)
                .map((delegacion) => (
                  <tr
                    key={delegacion.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/delegaciones/${delegacion.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium text-gray-900 ">
                      {delegacion.provincia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium text-gray-900 ">
                      {delegacion.localidad}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <form className="flex justify-center items-center gap-2">
            <Button
              type="default-outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <output>{page}</output>
            <Button
              type="default-outline"
              onClick={() => setPage(page + 1)}
              disabled={
                page ===
                Math.ceil(
                  delegaciones.slice((page - 1) * 10, page * 10).length / 10
                )
              }
            >
              <ChevronLeft className="size-4 rotate-180" />
            </Button>
          </form>
        </>
      )}
    </section>
  );
};

export default DelegacionesPage;
