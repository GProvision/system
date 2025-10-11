import { useEffect, useState } from "react";
import Button from "../../components/shared/Button";
import { Check, Loader, Minus, Plus, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast from "react-hot-toast";

const AdminsPage = () => {
  const [typeLens, setTypeLens] = useState([]);
  const [subsTypeLens, setSubsTypeLens] = useState([]);
  const [loadLens, setLoadLens] = useState(true);
  const getTypeLens = async () => {
    try {
      setLoadLens(true);
      const res = await fetch("/api/tipos/lentes");
      if (!res.ok) throw new Error("Error al cargar lentes");
      const data = await res.json();
      setTypeLens(data.sort((a, b) => a.id - b.id));
    } catch (error) {
      toast.error(error.message || "Error al cargar los lentes");
    } finally {
      setLoadLens(false);
    }
  };
  const getSubTypeLens = async () => {
    try {
      setLoadLens(true);
      const res = await fetch("/back/tipos/lentes");
      if (!res.ok) throw new Error("Error al cargar lentes");
      const data = await res.json();
      setSubsTypeLens(
        data.filter((nombre) => !typeLens.some((tl) => tl.nombre === nombre))
      );
    } catch (error) {
      toast.error(error.message || "Error al cargar los lentes");
    } finally {
      setLoadLens(false);
    }
  };

  const addTypeLen = async (data) => {
    try {
      const res = await fetch("/api/tipos/lentes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al cargar lentes");
      toast.success("Lente cargado");
      getTypeLens();
    } catch (error) {
      toast.error(error.message || "Error al cargar los lentes");
    } finally {
      setLoadLens(false);
    }
  };

  const setStateLens = async (data) => {
    try {
      const res = await fetch(
        `/api/tipos/lentes/${data.activo ? "restore" : "delete"}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idTipoLente: data.id }),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar el estado");
      toast.success(
        `Lente ${data.activo ? "activado" : "desactivado"} correctamente`
      );
      getTypeLens();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al actualizar el estado");
      // Revertir el cambio en la UI en caso de error
      setStateForm.setValue("activo", !data.activo);
    }
  };

  /*Laboratorios */
  const [labs, setLabs] = useState([]);
  const [subsLabs, setSubsLabs] = useState([]);
  const [loadLab, setLoadLab] = useState(true);

  const getLabs = async () => {
    try {
      setLoadLab(true);
      const res = await fetch("/api/laboratorios");
      if (!res.ok) throw new Error("Error al cargar laboratorios");
      const data = await res.json();
      setLabs(data.sort((a, b) => a.id - b.id));
    } catch (error) {
      toast.error(error.message || "Error al cargar los laboratorios");
    } finally {
      setLoadLab(false);
    }
  };

  const getSubLabs = async () => {
    try {
      setLoadLab(true);
      const data = ["GEN", "BS AS", "MOA", "SEBA"];
      setSubsLabs(
        data.filter((nombre) => !labs.some((tl) => tl.nombre === nombre))
      );
    } catch (error) {
      toast.error(error.message || "Error al cargar los laboratorios");
    } finally {
      setLoadLab(false);
    }
  };

  const setStateLab = async (data) => {
    try {
      const res = await fetch(
        `/api/laboratorios/${data.activo ? "restore" : "delete"}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar el estado");
      toast.success(
        `Laboratorio ${data.activo ? "activado" : "desactivado"} correctamente`
      );
      getLabs();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al actualizar el estado");
    }
  };

  const addLab = async (data) => {
    try {
      const res = await fetch("/api/laboratorios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al cargar laboratorios");
      toast.success("Laboratorio cargado");
      getLabs();
    } catch (error) {
      toast.error(error.message || "Error al cargar los laboratorios");
    } finally {
      setLoadLab(false);
    }
  };

  /* Estados */
  const [estados, setEstados] = useState([]);
  const [subsEstados, setSubsEstados] = useState([]);
  const [loadEstados, setLoadEstados] = useState(true);

  const getStates = async () => {
    try {
      setLoadEstados(true);
      const res = await fetch("/api/estados");
      if (!res.ok) throw new Error("Error al cargar estados");
      const data = await res.json();
      setEstados(data.sort((a, b) => a.id - b.id));
    } catch (error) {
      toast.error(error.message || "Error al cargar los estados");
    } finally {
      setLoadEstados(false);
    }
  };

  const getSubStates = async () => {
    try {
      setLoadEstados(true);
      const data = [
        "Pasado",
        "Enviado",
        "Revisión",
        "Laboratorio",
        "Pendiente",
        "Reclamo al Lab.",
        "En Control",
      ];
      setSubsEstados(
        data.filter((nombre) => !estados.some((tl) => tl.nombre === nombre))
      );
    } catch (error) {
      toast.error(error.message || "Error al cargar los estados");
    } finally {
      setLoadEstados(false);
    }
  };

  const addState = async (data) => {
    try {
      const res = await fetch("/api/estados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al cargar estados");
      toast.success("Estado cargado");
      getStates();
    } catch (error) {
      toast.error(error.message || "Error al cargar los estados");
    } finally {
      setLoadEstados(false);
    }
  };

  const setToggleState = async (data) => {
    try {
      const res = await fetch(
        `/api/estados/${data.activo ? "restore" : "delete"}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar el estado");
      toast.success(
        `Estado ${data.activo ? "activado" : "desactivado"} correctamente`
      );
      getStates();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al actualizar el estado");
    }
  };

  useEffect(() => {
    getTypeLens();
    getSubTypeLens();
    getLabs();
    getSubLabs();
    getStates();
    getSubStates();
  }, []);
  if (loadLens || loadLab || loadEstados)
    return (
      <article className="container mx-auto flex-1 flex flex-col justify-center items-center shadow-lg rounded-lg">
        <Loader className="size-6 text-slate-500" />
      </article>
    );
  return (
    <>
      <section className="container mx-auto px-4 py-8 max-w-6xl shadow-lg rounded-lg">
        <>
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">Lentes</h1>
            <AddForm
              action={addTypeLen}
              values={typeLens}
              suggestions={subsTypeLens}
            />
          </header>
          {typeLens.length == 0 && <p>No hay Lentes Cargados</p>}
          {typeLens.length > 0 && (
            <ul className="grid grid-cols-4 gap-2">
              {typeLens.map((t) => (
                <li
                  key={t.id}
                  className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 p-2"
                >
                  <dl className="flex gap-2 items-center justify-center flex-1">
                    <dt className="sr-only">Nombre</dt>
                    <dd>{t.nombre}</dd>
                    <dt className="sr-only">Estado</dt>
                    <dd>
                      <span
                        className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          t?.activo
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t.activo ? "visible" : "oculto"}
                      </span>
                    </dd>
                  </dl>
                  <ToggleState action={setStateLens} element={t} />
                </li>
              ))}
            </ul>
          )}
        </>
      </section>
      <section className="container mx-auto px-4 py-8 max-w-6xl shadow-lg rounded-lg">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Laboratorios</h1>
          <AddForm action={addLab} values={labs} suggestions={subsLabs} />
        </header>
        {labs.length == 0 && <p>No hay Laboratorios Cargados</p>}
        {labs.length > 0 && (
          <ul className="grid grid-cols-4 gap-2">
            {labs.map((t) => (
              <li
                key={t.id}
                className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 p-2"
              >
                <dl className="flex gap-2 items-center justify-center flex-1">
                  <dt className="sr-only">Nombre</dt>
                  <dd>{t.nombre}</dd>
                  <dt className="sr-only">Estado</dt>
                  <dd>
                    <span
                      className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        t?.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t.activo ? "visible" : "oculto"}
                    </span>
                  </dd>
                </dl>
                <ToggleState action={setStateLab} element={t} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="container mx-auto px-4 py-8 max-w-6xl shadow-lg rounded-lg">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Estados</h1>
          <AddForm
            action={addState}
            values={estados}
            suggestions={subsEstados}
          />
        </header>
        {estados.length == 0 && <p>No hay Estados Cargados</p>}
        {estados.length > 0 && (
          <ul className="grid grid-cols-4 gap-2">
            {estados.map((t) => (
              <li
                key={t.id}
                className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 p-2"
              >
                <dl className="flex gap-2 items-center justify-center flex-1">
                  <dt className="sr-only">Nombre</dt>
                  <dd>{t.nombre}</dd>
                  <dt className="sr-only">Estado</dt>
                  <dd>
                    <span
                      className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        t?.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t.activo ? "visible" : "oculto"}
                    </span>
                  </dd>
                </dl>
                <ToggleState action={setToggleState} element={t} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

const AddForm = ({ action, values, suggestions }) => {
  const [formOpen, setFormOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(
      z.object({
        nombre: z
          .preprocess((val) => val.trim(), z.string())
          .refine((val) => val.replace(/\s+/g, "").length > 2, {
            message: "Minimo 3 caracteres",
          })
          .refine((val) => !values.map(({ nombre }) => nombre).includes(val), {
            message: "No se permiten nombres repetidos",
          }),
        activo: z.boolean(),
      })
    ),
    defaultValues: {
      nombre: "",
      activo: true,
    },
  });
  useEffect(() => {
    form.reset();
  }, [formOpen]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form
          .handleSubmit(action)(e)
          .then(() => {
            setFormOpen(false);
          });
      }}
      className="w-full h-12 max-w-xs flex items-center justify-end gap-2"
    >
      {formOpen && (
        <fieldset className="flex-1 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <input
              type="text"
              className="flex-1 text-blue-900 border-2 border-blue-500 outline-none p-2 rounded-md"
              autoComplete="off"
              list="sugestLens"
              {...form.register("nombre")}
            />
            <datalist id="sugestLens">
              {suggestions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </datalist>
            {form.formState.errors.nombre && (
              <p className="text-xs text-red-500">
                {form.formState.errors.nombre.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            style={!form.formState.isSubmitting ? "add" : "default"}
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting && <Save className="size-4" />}
            {form.formState.isSubmitting && (
              <Loader className="size-4 animate-spin" />
            )}
          </Button>
        </fieldset>
      )}
      <Button
        style={!formOpen ? "add-outline" : "cancel-outline"}
        onClick={() => setFormOpen(!formOpen)}
      >
        {!formOpen && <Plus className="size-4" />}
        {formOpen && <Minus className="size-4" />}
      </Button>
    </form>
  );
};

const ToggleState = ({ action, element }) => {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        id: z
          .preprocess((val) => Number(val), z.number())
          .refine((val) => val > 0, {
            message: "Id invalido",
          }),
        activo: z
          .preprocess((val) => val === "on" || val === true, z.boolean())
          .default(true),
      })
    ),
    defaultValues: {
      id: 0,
      activo: true,
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.setValue("id", element.id);
        form.setValue("activo", !element.activo);
        form.handleSubmit(action)(e);
      }}
      className="ml-2"
    >
      <Button
        type="submit"
        style={
          form.formState.isSubmitting
            ? "default-outline"
            : element.activo
            ? "cancel-outline"
            : "check-outline"
        }
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <Loader className="size-4 animate-spin" />
        ) : element.activo ? (
          <X className="size-4" />
        ) : (
          <Check className="size-4" />
        )}
      </Button>
      {Object.entries(form.formState.errors).map(([key, value]) => (
        <p key={key} className="text-xs text-red-500">
          {value.message}
        </p>
      ))}
    </form>
  );
};

export default AdminsPage;
