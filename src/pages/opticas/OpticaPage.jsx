import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  X,
  Pen,
  ChevronLeft,
  Trash2,
  Loader,
  Check,
  Plus,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import Button from "../../components/shared/Button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const OpticaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [optica, setOptica] = useState(null);
  const [idSindicato, setIdSindicato] = useState(null);
  const [idDelegacion, setIdDelegacion] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddSindicatoFormOpen, setIsAddSindicatoFormOpen] = useState(false);
  const [isAddDelegacionFormOpen, setIsAddDelegacionFormOpen] = useState(false);
  const [opticas, setOpticas] = useState([]);
  const [sindicatos, setSindicatos] = useState([]);
  const [delegaciones, setDelegaciones] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
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
        activo: z.preprocess(
          (val) => val === "on" || val === true,
          z.boolean()
        ),
      })
    ),
    defaultValues: { nombre: "", activo: false },
  });

  const addSindicatoForm = useForm({
    resolver: zodResolver(
      z.object({
        idSindicato: z
          .string()
          .min(1, "Debe seleccionar un sindicato")
          .transform((val) => parseInt(val))
          .pipe(
            z
              .number()
              .positive("Debe seleccionar un sindicato")
              .refine(
                (val) => {
                  // Verifica que el sindicato no esté ya agregado
                  return !optica?.sindicatos?.some((s) => s.id === val);
                },
                { message: "Este sindicato ya está agregado" }
              )
          ),
      })
    ),
    defaultValues: {
      idSindicato: "", // Cambiamos a string vacío como valor inicial
    },
  });

  const addDelegacionForm = useForm({
    resolver: zodResolver(
      z.object({
        idDelegacion: z
          .string()
          .min(1, "Debe seleccionar una delegación")
          .transform((val) => parseInt(val))
          .pipe(
            z
              .number()
              .positive("Debe seleccionar una delegación")
              .refine(
                (val) => {
                  // Verifica que el sindicato no esté ya agregado
                  return !optica?.delegaciones?.some((s) => s.id === val);
                },
                { message: "Esta delegación ya está agregada" }
              )
          ),
      })
    ),
    defaultValues: { idDelegacion: "" },
  });

  const getOptica = async () => {
    const response = await fetch(`/api/opticas/${id}`);
    const data = await response.json();
    setOptica(data);
    setValue("nombre", data.nombre);
    setValue("activo", data.activo);
  };
  const getOpticas = async () => {
    const response = await fetch("/api/opticas");
    const data = await response.json();
    setOpticas(data.filter((e) => e.id != id));
  };

  const getSindicatos = async () => {
    const response = await fetch("/api/sindicatos");
    const data = await response.json();
    setSindicatos(data.filter(({ activo }) => activo === true));
  };

  const getDelegaciones = async () => {
    const response = await fetch("/api/delegaciones");
    const data = await response.json();
    setDelegaciones(data.filter(({ activo }) => activo === true));
  };

  const editOptica = async (data) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de actualizar esta optica?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "No, cancelar",
      });
      if (!confirm.isConfirmed) return;
      const response = await fetch("/api/opticas/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
      await getOpticas();
      await getOptica();
      setIsEditFormOpen(false);
      toast.success("Optica agregada exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al agregar la optica");
    }
  };

  const addSindicato = async (data) => {
    try {
      const response = await fetch("/api/opticas/addSindicato", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
      await getOpticas();
      await getOptica();
      setIsAddSindicatoFormOpen(false);
      toast.success("Sindicato agregado exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al agregar el sindicato");
    }
  };

  const removeSindicato = async (data) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de remover este sindicato?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, remover",
        cancelButtonText: "No, cancelar",
      });
      if (!confirm.isConfirmed) return;
      setIdSindicato(data.idSindicato);
      const response = await fetch("/api/opticas/removeSindicato", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
      await getOpticas();
      await getOptica();
      setIsAddSindicatoFormOpen(false);
      toast.success("Sindicato removido exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al remover el sindicato");
    } finally {
      setIdSindicato(null);
    }
  };

  const addDelegacion = async (data) => {
    try {
      const response = await fetch("/api/opticas/addDelegacion", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
      await getOpticas();
      await getOptica();
      setIsAddDelegacionFormOpen(false);
      toast.success("Delegación agregada exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al agregar la delegación");
    }
  };

  const removeDelegacion = async (data) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de remover esta delegación?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, remover",
        cancelButtonText: "No, cancelar",
      });
      if (!confirm.isConfirmed) return;
      setIdDelegacion(data.idDelegacion);
      const response = await fetch("/api/opticas/removeDelegacion", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
      await getOpticas();
      await getOptica();
      setIsAddSindicatoFormOpen(false);
      toast.success("Delegación removido exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al remover la delagación");
    } finally {
      setIdDelegacion(null);
    }
  };

  useEffect(() => {
    getOptica();
    getOpticas();
    getSindicatos();
    getDelegaciones();
  }, []);

  useEffect(() => {
    if (!isAddSindicatoFormOpen) {
      addSindicatoForm.reset();
    }
  }, [isAddSindicatoFormOpen]);

  useEffect(() => {
    if (!isAddDelegacionFormOpen) {
      addDelegacionForm.reset();
    }
  }, [isAddDelegacionFormOpen]);

  if (!opticas && !optica && delegaciones.length == 0 && sindicatos.length == 0)
    return <Loader className="animate-spin mx-auto" />;
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl" role="main">
      <header className="flex justify-between items-center mb-4">
        <Button
          onClick={() => navigate("/opticas")}
          aria-label="Volver a la lista de ópticas"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {optica?.nombre}
          <span
            className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
              optica?.activo
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            role="status"
          >
            {optica?.activo ? "Activo" : "Inactivo"}
          </span>
        </h1>
        <Button
          onClick={() => setIsEditFormOpen(!isEditFormOpen)}
          type={!isEditFormOpen ? "edit" : "cancel"}
          aria-label={!isEditFormOpen ? "Editar óptica" : "Cancelar edición"}
          aria-expanded={isEditFormOpen}
        >
          {!isEditFormOpen ? (
            <Pen className="size-4" aria-hidden="true" />
          ) : (
            <X className="size-4" aria-hidden="true" />
          )}
        </Button>
      </header>

      {isEditFormOpen && (
        <section
          className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          aria-label="Formulario de edición"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Editar Óptica
          </h2>
          <form
            className="flex flex-col gap-4 items-center justify-start max-w-xl mx-auto"
            noValidate
          >
            <div className="w-full">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de la Óptica
                <span
                  className="text-red-500 ml-1"
                  aria-label="campo requerido"
                >
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
                placeholder="Ingrese el nombre de la óptica"
                autoComplete="off"
                aria-invalid={errors.nombre ? "true" : "false"}
                aria-describedby={errors.nombre ? "nombre-error" : undefined}
                {...register("nombre")}
              />
              {errors.nombre && (
                <p
                  id="nombre-error"
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="activo"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                {...register("activo")}
              />
              <label
                htmlFor="activo"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Activo
              </label>
            </div>

            <Button
              type={isSubmitting ? "cancel" : "add"}
              disabled={isSubmitting}
              onClick={handleSubmit(editOptica)}
              aria-label={
                isSubmitting ? "Guardando cambios..." : "Guardar cambios"
              }
            >
              {isSubmitting ? (
                <Loader className="animate-spin size-4" aria-hidden="true" />
              ) : (
                <Check className="size-4" aria-hidden="true" />
              )}
            </Button>
          </form>
        </section>
      )}

      <section
        className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
        aria-labelledby="sindicatos-heading"
      >
        <header className="flex justify-between items-center mb-4">
          <h2
            id="sindicatos-heading"
            className="text-2xl font-bold text-gray-900"
          >
            Sindicatos
          </h2>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            {isAddSindicatoFormOpen && (
              <>
                <div className="flex flex-col">
                  <select
                    {...addSindicatoForm.register("idSindicato")}
                    className="w-full min-w-[200px] p-2 border rounded"
                    aria-label="Seleccionar sindicato"
                  >
                    <option value="" disabled>
                      Seleccionar el Sindicato
                    </option>
                    {sindicatos
                      .filter(
                        (s) => !optica?.sindicatos?.some((os) => os.id === s.id)
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre}
                        </option>
                      ))}
                  </select>
                  {addSindicatoForm?.formState?.errors?.idSindicato && (
                    <p className="text-red-500 text-sm mt-1" role="alert">
                      {addSindicatoForm?.formState?.errors?.idSindicato.message}
                    </p>
                  )}
                </div>
                <Button
                  type={
                    !addSindicatoForm.formState.isSubmitting ? "add" : "default"
                  }
                  disabled={addSindicatoForm.formState.isSubmitting}
                  onClick={addSindicatoForm.handleSubmit(addSindicato)}
                  aria-label="Guardar sindicato"
                >
                  {!addSindicatoForm.formState.isSubmitting ? (
                    <Save className="size-4" aria-hidden="true" />
                  ) : (
                    <Loader
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </>
            )}
            <Button
              onClick={() => setIsAddSindicatoFormOpen(!isAddSindicatoFormOpen)}
              type={!isAddSindicatoFormOpen ? "add" : "cancel"}
              aria-label={
                !isAddSindicatoFormOpen ? "Agregar sindicato" : "Cancelar"
              }
              aria-expanded={isAddSindicatoFormOpen}
            >
              {!isAddSindicatoFormOpen ? (
                <Plus className="size-4" aria-hidden="true" />
              ) : (
                <X className="size-4" aria-hidden="true" />
              )}
            </Button>
          </form>
        </header>

        {optica?.sindicatos && optica.sindicatos.length === 0 ? (
          <p className="text-gray-500">No hay sindicatos agregados</p>
        ) : (
          <ul className="list-none gap-2 flex flex-wrap">
            {optica?.sindicatos?.map((s) => (
              <li
                key={s.id}
                className="inline-flex items-center gap-x-1.5 py-1.5 ps-3 pe-2 rounded-md text-xs font-medium bg-slate-100 text-slate-700 "
              >
                <span>{s.nombre}</span>
                <Button
                  type="cancel-outline"
                  onClick={() => removeSindicato({ idSindicato: s.id })}
                  disabled={idSindicato == s.id}
                >
                  {!idSindicato || idSindicato != s.id ? (
                    <X className="size-4" />
                  ) : (
                    <Loader className="size-4 animate-spin" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Delegaciones</h2>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            {isAddDelegacionFormOpen && (
              <>
                <div className="flex flex-col">
                  <select
                    {...addDelegacionForm.register("idDelegacion")}
                    className="w-full min-w-[200px] p-2 border rounded"
                    aria-label="Seleccionar sindicato"
                  >
                    <option value="">Seleccionar la delagación</option>
                    {delegaciones
                      .filter(
                        (d) =>
                          !optica?.delegaciones?.some((os) => os.id === d.id)
                      )
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.provincia} - {d.localidad}
                        </option>
                      ))}
                  </select>
                  {addDelegacionForm?.formState?.errors?.idDelegacion && (
                    <p className="text-red-500 text-sm mt-1" role="alert">
                      {
                        addDelegacionForm?.formState?.errors?.idDelegacion
                          .message
                      }
                    </p>
                  )}
                </div>
                <Button
                  type={
                    !addDelegacionForm.formState.isSubmitting
                      ? "add"
                      : "default"
                  }
                  disabled={addDelegacionForm.formState.isSubmitting}
                  onClick={addDelegacionForm.handleSubmit(addDelegacion)}
                  aria-label="Guardar sindicato"
                >
                  {!addDelegacionForm.formState.isSubmitting ? (
                    <Save className="size-4" aria-hidden="true" />
                  ) : (
                    <Loader
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </>
            )}
            <Button
              onClick={() =>
                setIsAddDelegacionFormOpen(!isAddDelegacionFormOpen)
              }
              type={!isAddDelegacionFormOpen ? "add" : "cancel"}
              aria-label={
                !isAddDelegacionFormOpen ? "Agregar Delegacion" : "Cancelar"
              }
              aria-expanded={isAddDelegacionFormOpen}
            >
              {!isAddDelegacionFormOpen ? (
                <Plus className="size-4" aria-hidden="true" />
              ) : (
                <X className="size-4" aria-hidden="true" />
              )}
            </Button>
          </form>
        </header>

        {optica?.delegaciones && optica.delegaciones.length === 0 ? (
          <p className="text-gray-500">No hay delegaciones agregadas</p>
        ) : (
          <ul
            className={`list-none gap-2 flex flex-col ${
              optica?.delegaciones.length > 1
                ? "divide-y-4 divide-slate-100"
                : ""
            }`}
          >
            {optica?.delegaciones?.map((d) => (
              <li key={d.id} className="flex flex-1 gap-2 items-center pb-2">
                <Button
                  type="cancel"
                  onClick={() => removeDelegacion({ idDelegacion: d.id })}
                  disabled={idDelegacion === d.id}
                >
                  {(!idDelegacion || idDelegacion !== d.id) && (
                    <X className="size-4" />
                  )}

                  {idDelegacion === d.id && (
                    <Loader className="size-4 animate-spin" />
                  )}
                </Button>
                <span>
                  {d.provincia} - {d.localidad}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default OpticaPage;
