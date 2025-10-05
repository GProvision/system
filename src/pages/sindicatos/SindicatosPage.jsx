import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
const SindicatosPage = () => {
  const [sindicatos, setSindicatos] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const getSindicatos = async () => {
    const response = await fetch("/api/sindicatos");
    const data = await response.json();
    setSindicatos(data);
  };

  const addSindicato = async (data) => {
    const response = await fetch("/api/sindicatos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      await getSindicatos();
      setIsAddFormOpen(false);
    }
  };

  useEffect(() => {
    getSindicatos();
  }, []);

  if (!sindicatos) return null;

  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Sindicatos</h1>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Agregar Sindicato
        </button>
      </header>
      {isAddFormOpen && (
        <section className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Agregar Sindicato
            </h2>
            <button
              onClick={() => setIsAddFormOpen(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
          <form onSubmit={handleSubmit(addSindicato)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                {...register("nombre")}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Guardar
            </button>
          </form>
        </section>
      )}

      {sindicatos.length === 0 && (
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          No hay sindicatos
        </div>
      )}

      {sindicatos.length > 0 && (
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
          <tbody className="bg-white divide-y divide-gray-200">
            {sindicatos.map((sindicato) => (
              <tr
                key={sindicato.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/sindicatos/${sindicato.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium text-gray-900 ">
                  {sindicato.nombre}
                </td>
                <td className="px-2 py-4">
                  <span
                    className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                      sindicato.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sindicato.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default SindicatosPage;
