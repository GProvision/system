import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";

const DelegacionesPage = () => {
  const [delegaciones, setDelegaciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [provinciaId, setProvinciaId] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const navigate = useNavigate();
  const {
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
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 flex items-center justify-center rounded"
        >
          <Plus className="size-6" />
        </button>
      </header>
      {isAddFormOpen && (
        <section>
          <form onSubmit={handleSubmit(addDelegacion)}>
            <fieldset>
              <label htmlFor="provincia">Provincia</label>
              <select
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
            <fieldset>
              <label htmlFor="localidad">Localidad</label>
              <select
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
            <button type="submit">Agregar Delegacion</button>
          </form>
        </section>
      )}
      {delegaciones.length === 0 && (
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          No hay delegaciones
        </div>
      )}
      {delegaciones.length > 0 && (
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
            {delegaciones.map((delegacion) => (
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
      )}
    </section>
  );
};

export default DelegacionesPage;
