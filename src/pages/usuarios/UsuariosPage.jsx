import {
  Check,
  Loader,
  Plus,
  Save,
  UserRound,
  UserRoundCheck,
  UserRoundCog,
  UserRoundPen,
  UserRoundX,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../components/shared/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [selectUser, setSelectUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const navigate = useNavigate();
  const addForm = useForm({
    resolver: zodResolver(
      z.object({
        nombre: z
          .preprocess((val) => String(val).trim(), z.string())
          .refine(
            (val) => {
              let regex = /\s+/g;
              return val.replace(regex, " ").length > 3;
            },
            { message: "El nombre es obligatorio, minimo 3 caracteres" }
          ),
        clave: z
          .string()
          .refine((val) => val.replace(/\s+/g, " ").length > 8, {
            message: "Minimo 8 caracteres",
          })
          .refine((val) => /[A-Z]/.test(val), {
            message: "Debe tener 1 mayuscula",
          })
          .refine((val) => /[0-9]/.test(val), {
            message: "Debe tener al menos 1 numero",
          })
          .refine((val) => /[!@#$%^&*]/.test(val), {
            message: "Debe contener un caracter especial",
          }),
        usuario: z
          .string()
          .refine((val) => val.replace(/\s+/g, " ").length > 8, {
            message: "Minimo 8 caracteres",
          })
          .refine(
            (val) => !usuarios.map(({ usuario }) => usuario).includes(val),
            {
              message: "No puede haber 2 usuarios con el mismo nombre",
            }
          ),
        rolId: z
          .preprocess((val) => (val ? Number(val) : undefined), z.number())
          .refine((val) => val && val > 0, {
            message: "Debes seleccionar un rol",
          }),
      })
    ),
    defaultValues: {
      nombre: "",
      clave: "",
      usuario: "",
      rolId: null,
    },
  });
  const getUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch("/api/usuarios");
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      const data = await response.json();
      setUsuarios(
        data.sort((a, b) =>
          String(a.nombre.toLowerCase()).localeCompare(b.nombre.toLowerCase())
        )
      );
    } catch (error) {
      console.error(error.message || "Error al cargar usuarios");
    } finally {
      setIsLoadingUsers(false);
    }
  };
  const getRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await fetch("/api/roles");
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error(error.message || "Error al cargar usuarios");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const addUser = async (data) => {
    try {
      const response = await fetch("/api/sindicatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await getUsers();
        setIsAddFormOpen(false);
        addForm.reset();
        toast.success("Usuario agregado exitosamente");
      } else {
        const { error } = await response.json();
        throw new Error(error.split(":")[1].trim());
      }
    } catch (error) {
      toast.error(error.message || "Error al agregar el usuario");
    }
  };

  const resetPass = async (userId) => {
    try {
      const actual = new Date().getFullYear().toString();
      const clave = `gprovision${actual.slice(2, 4)}!`;
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Estás seguro de reiniciar este usuario? Su nueva clave será ${clave}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
      });
      if (!confirm.isConfirmed) return;
      setSelectUser(userId);
      const response = await fetch(`/api/usuarios/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(userId), clave }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      await getUsers();
      toast.success("Usuario reiniciado exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al reiniciar el usuario");
    } finally {
      setSelectUser(null);
    }
  };
  const setActive = async (userId, active) => {
    try {
      const action = !active ? "desactivar" : "activar";

      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Estás seguro de ${action} este usuario?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Sí, ${action}`,
        cancelButtonText: "Cancelar",
      });
      if (!confirm.isConfirmed) return;
      setSelectUser(userId);
      const response = await fetch(
        `/api/usuarios/${!active ? "delete" : "restore"}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: Number(userId) }),
        }
      );
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      await getUsers();
      toast.success("Usuario reiniciado exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al reiniciar el usuario");
    } finally {
      setSelectUser(null);
    }
  };

  const handleEdit = (usuario) => {
    setUserEdit(usuario);
    setIsEditOpen(true);
  };

  const editUser = async (data) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Estás seguro de modificar este usuario?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Sí, modificar`,
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      const response = await fetch(`/api/usuarios/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: userEdit.id }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      toast.success("Usuario actualizado correctamente");
      await getUsers();
      setIsEditOpen(false);
    } catch (error) {
      toast.error(error.message || "Error al actualizar el usuario");
    }
  };

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);
  useEffect(() => {
    if (!isAddFormOpen) {
      addForm.reset();
    }
  }, [isAddFormOpen]);
  if (isLoadingUsers || isLoadingRoles)
    return (
      <div className="h-100 flex flex-col items-center justify-center">
        <Loader className="animate-spin size-6 mx-auto" />
      </div>
    );
  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
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
        <form
          className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col gap-4 items-center justify-start max-w-xl mx-auto"
          onSubmit={addForm.handleSubmit(addUser)}
        >
          <fieldset className="w-full flex flex-wrap items-center">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre
              <span className="text-red-500" aria-label="campo requerido">
                *
              </span>
            </label>
            <input
              id="nombre"
              type="text"
              aria-required="true"
              aria-describedby={
                addForm.formState.errors.nombre ? "nombre-error" : "nombre-help"
              }
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                addForm.formState.errors.nombre
                  ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Ingrese el nombre del sindicato"
              {...addForm.register("nombre")}
            />
            {addForm.formState.errors.nombre && (
              <p
                className="text-sm text-red-600 flex items-center"
                role="alert"
              >
                {addForm.formState.errors.nombre.message}
              </p>
            )}
          </fieldset>
          <fieldset className="w-full flex flex-wrap items-center">
            <label
              htmlFor="clave"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Clave
              <span className="text-red-500" aria-label="campo requerido">
                *
              </span>
            </label>
            <input
              id="clave"
              type="text"
              aria-required="true"
              aria-describedby={
                addForm.formState.errors.clave ? "clave-error" : "clave-help"
              }
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                addForm.formState.errors.clave
                  ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Ingrese la clave del usuario"
              {...addForm.register("clave")}
            />
            {addForm.formState.errors.clave && (
              <p
                className="text-sm text-red-600 flex items-center"
                role="alert"
              >
                {addForm.formState.errors.clave.message}
              </p>
            )}
          </fieldset>
          <fieldset className="w-full flex flex-wrap items-center">
            <label
              htmlFor="usuario"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Usuario
              <span className="text-red-500" aria-label="campo requerido">
                *
              </span>
            </label>
            <input
              id="usuario"
              type="text"
              aria-required="true"
              aria-describedby={
                addForm.formState.errors.usuario
                  ? "usuario-error"
                  : "usuario-help"
              }
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                addForm.formState.errors.usuario
                  ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Ingrese el alias del usuario"
              {...addForm.register("usuario")}
            />
            {addForm.formState.errors.usuario && (
              <p
                className="text-sm text-red-600 flex items-center"
                role="alert"
              >
                {addForm.formState.errors.usuario.message}
              </p>
            )}
          </fieldset>
          <fieldset className="w-full flex flex-wrap items-center">
            <label
              htmlFor="rol"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rol
              <span className="text-red-500" aria-label="campo requerido">
                *
              </span>
            </label>
            <select
              name="rol"
              id="rol"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                addForm.formState.errors.rolId
                  ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              {...addForm.register("rolId")}
            >
              <option value="" disabled>
                Seleccionar el rol
              </option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre.toUpperCase()}
                </option>
              ))}
            </select>
            {addForm.formState.errors.rolId && (
              <p
                className="text-sm text-red-600 flex items-center"
                role="alert"
              >
                {addForm.formState.errors.rolId.message}
              </p>
            )}
          </fieldset>
          <Button
            type="submit"
            style={addForm.formState.isSubmitting ? "default" : "add"}
            disabled={addForm.formState.isSubmitting}
          >
            {addForm.formState.isSubmitting && (
              <Loader className="size-4 animate-spin" />
            )}
            {!addForm.formState.isSubmitting && <Save className="size-4" />}
          </Button>
        </form>
      )}
      {usuarios.length == 0 && (
        <p className="px-6 py-4 text-center text-sm text-gray-500">
          No hay usuarios disponibles
        </p>
      )}
      {usuarios.length > 0 && (
        <ul className="grid grid-cols-3 gap-4 ">
          {usuarios.map((u) => (
            <li
              key={u.id}
              className="w-full max-w-sm flex flex-wrap items-center bg-white border border-gray-200 rounded-lg shadow-sm "
            >
              <UserRound
                className={`size-24 ${
                  u.activo ? "text-green-500" : "text-red-500"
                }`}
              />

              <dl className="flex flex-col items-start flex-1 ">
                <dt className="sr-only">Nombre</dt>
                <dd className="text-xl font-medium text-slate-900">
                  {u.nombre}
                </dd>
                <dt className="sr-only">Usuario</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {u.usuario}
                </dd>
                <dt className="sr-only">Rol</dt>
                <dd className="text-sm uppercase text-slate-500">
                  {u.rol.nombre}
                </dd>
              </dl>
              <div className="flex justify-end p-4 gap-2">
                <Button style="edit-outline" onClick={() => handleEdit(u)}>
                  <UserRoundPen className="size-4" />
                </Button>
                <Button style="default-outline" onClick={() => resetPass(u.id)}>
                  <UserRoundCog className="size-4" />
                </Button>
                <Button
                  style={
                    selectUser == u.id
                      ? "default-outline"
                      : u.activo
                      ? "cancel-outline"
                      : "check-outline"
                  }
                  onClick={() => setActive(u.id, !u.activo)}
                >
                  {(!selectUser || selectUser != u.id) && u.activo && (
                    <UserRoundX className="size-4" />
                  )}
                  {(!selectUser || selectUser != u.id) && !u.activo && (
                    <UserRoundCheck className="size-4" />
                  )}
                  {selectUser && selectUser == u.id && (
                    <Loader className="size-4 animate-spin" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {userEdit && (
        <EditarUsuarioModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={editUser}
          usuario={userEdit}
          usuarios={usuarios.filter(({ id }) => userEdit.id != id)}
          roles={roles}
        />
      )}
    </section>
  );
};

const EditarUsuarioModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  usuario = null,
  roles = [],
  usuarios = [],
}) => {
  const schema = z.object({
    nombre: z
      .preprocess((val) => String(val).trim(), z.string())
      .refine(
        (val) => {
          let regex = /\s+/g;
          return val.replace(regex, " ").length > 3;
        },
        { message: "El nombre es obligatorio, minimo 3 caracteres" }
      ),
    usuario: z
      .string()
      .refine((val) => val.replace(/\s+/g, " ").length > 8, {
        message: "Minimo 8 caracteres",
      })
      .refine((val) => !usuarios.map(({ usuario }) => usuario).includes(val), {
        message: "No puede haber 2 usuarios con el mismo nombre",
      }),
    rolId: z
      .preprocess((val) => (val ? Number(val) : undefined), z.number())
      .refine((val) => val && val > 0, {
        message: "Debes seleccionar un rol",
      }),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      usuario: usuario?.usuario ?? "",
      rolId: usuario?.rolId ?? "",
    },
  });

  useEffect(() => {
    if (usuario) {
      form.setValue("nombre", usuario?.nombre);
      form.setValue("usuario", usuario?.usuario);
      form.setValue("rolId", usuario?.rol.id);
    }
  }, [usuario]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar Usuario
          </h2>
          <Button onClick={onClose} style="cancel">
            <X className="size-4" />
          </Button>
        </header>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* NOMBRE */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              {...form.register("nombre")}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                form.formState.errors.nombre
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {form.formState.errors.nombre && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.nombre.message}
              </p>
            )}
          </div>

          {/* USUARIO */}
          <div>
            <label
              htmlFor="usuario"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuario <span className="text-red-500">*</span>
            </label>
            <input
              id="usuario"
              type="text"
              {...form.register("usuario")}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                form.formState.errors.usuario
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {form.formState.errors.usuario && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.usuario.message}
              </p>
            )}
          </div>

          {/* ROL */}
          <div>
            <label
              htmlFor="rol"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              id="rol"
              {...form.register("rolId")}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                form.formState.errors.rolId
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Seleccionar un rol</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre.toUpperCase()}
                </option>
              ))}
            </select>
            {form.formState.errors.rolId && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.rolId.message}
              </p>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex justify-center gap-3 mt-4">
            <Button
              type="submit"
              style="check"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuariosPage;
