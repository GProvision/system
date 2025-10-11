import { useEffect, useState } from "react";
import Button from "../../components/shared/Button";
import { Loader, Minus, Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast from "react-hot-toast";

const AdminsPage = () => {
  const [typeLens, setTypeLens] = useState([]);
  const [subsTypeLens, setSubsTypeLens] = useState([]);
  const [loadLens, setLoadLens] = useState(true);
  const [addLensFormOpen, setAddLensFormOpen] = useState(false);
  const addTypeLentForm = useForm({
    resolver: zodResolver(
      z.object({
        nombre: z
          .string()
          .trim()
          .refine((val) => val.replace(/\s+/g, "").length > 2, {
            message: "Minimo 3 caracteres",
          })
          .refine(
            (val) => !typeLens.map(({ nombre }) => nombre).includes(val),
            {
              message: "No se permiten nombres repetidos",
            }
          ),
        activo: z.boolean(),
      })
    ),
    defaultValues: {
      nombre: "",
      activo: true,
    },
  });
  const getTypeLens = async () => {
    try {
      setLoadLens(true);
      const res = await fetch("/api/tipos/lentes");
      if (!res.ok) throw new Error("Error al cargar lentes");
      const data = await res.json();
      setTypeLens(data);
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
      setSubsTypeLens(data);
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
      addTypeLentForm.reset();
      setAddLensFormOpen(false);
      toast.success("Lente cargado");
      getTypeLens();
    } catch (error) {
      toast.error(error.message || "Error al cargar los lentes");
    } finally {
      setLoadLens(false);
    }
  };
  useEffect(() => {
    getTypeLens();
    getSubTypeLens();
  }, []);
  if (loadLens)
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
            <form
              onSubmit={addTypeLentForm.handleSubmit(addTypeLen)}
              className="w-full h-12 max-w-xs flex items-center justify-end gap-2"
            >
              {addLensFormOpen && (
                <fieldset className="flex-1 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      className="flex-1 text-blue-900 border-2 border-blue-500 outline-none p-2 rounded-md"
                      autoComplete="off"
                      list="sugestLens"
                      {...addTypeLentForm.register("nombre")}
                    />
                    <datalist id="sugestLens">
                      {subsTypeLens.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </datalist>
                    {addTypeLentForm.formState.errors.nombre && (
                      <p className="text-xs text-red-500">
                        {addTypeLentForm.formState.errors.nombre.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    style={
                      !addTypeLentForm.formState.isSubmitting
                        ? "add"
                        : "default"
                    }
                    disabled={addTypeLentForm.formState.isSubmitting}
                  >
                    {!addTypeLentForm.formState.isSubmitting && (
                      <Save className="size-4" />
                    )}
                    {addTypeLentForm.formState.isSubmitting && (
                      <Loader className="size-4 animate-spin" />
                    )}
                  </Button>
                </fieldset>
              )}
              <Button
                style={!addLensFormOpen ? "add-outline" : "cancel-outline"}
                onClick={() => setAddLensFormOpen(!addLensFormOpen)}
              >
                {!addLensFormOpen && <Plus className="size-4" />}
                {addLensFormOpen && <Minus className="size-4" />}
              </Button>
            </form>
          </header>
          {typeLens.length == 0 && <p>No hay Lentes Cargados</p>}
          {typeLens.length > 0 && (
            <ul className="flex gap-2">
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
                </li>
              ))}
            </ul>
          )}
        </>
      </section>
      <section className="container mx-auto px-4 py-8 max-w-6xl shadow-lg rounded-lg">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Laboratorios</h1>
          <Button
            style="add-outline"
            onClick={() => console.log("Laboratorios")}
          >
            <Plus className="size-4" />
          </Button>
        </header>
      </section>
    </>
  );
};

export default AdminsPage;
