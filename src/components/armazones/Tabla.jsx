import { useEffect, useState } from "react";
import Formulario from "./Formulario";
import { Loader, Plus, Minus } from "lucide-react";

const Tabla = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [armazones, setArmazones] = useState([]);
  const [loading, setLoading] = useState(true);

const getArmazones = async () => {
  try {
    setLoading(true);
    // Usar la misma estrategia que en Formulario.jsx
    const response = await fetch("/api/armazones/");
    if (!response.ok) {
      throw new Error("Error al obtener los armazones");
    }
    const data = await response.json();
    setArmazones(data || []);
  } catch (error) {
    console.error("Error al obtener los armazones:", error);
  } finally {
    setLoading(false);
  }
};
  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  useEffect(() => {
    getArmazones();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-gray-500" size={48} />
      </div>
    );
  }

  const currecy = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARG" })

  return (
    <section className="bg-white shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto">
      {/* Header con botón + */}
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">
          Inventario de Armazones
        </h1>
<button
          onClick={toggleFormulario}
          className={`${
            mostrarFormulario
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          aria-label={
            mostrarFormulario ? "Cerrar formulario" : "Agregar nuevo armazón"
          }
        >
          {mostrarFormulario ? (
            <Minus className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Formulario desplegable */}
      {mostrarFormulario && (
        <div className="border-b border-gray-200 bg-gray-50 p-6">
          <Formulario
            onClose={toggleFormulario}
            onSuccess={() => {
              toggleFormulario();
              getArmazones(); // Recargar los datos después de agregar uno nuevo
            }}
          />
        </div>
      )}

      {/* Tabla con etiquetas HTML table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                C. Patilla
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                C. Interno
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                C. Color
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                L. Color
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicacion
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                P. Venta
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {armazones.map((armazon) => (
              <tr key={armazon.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {armazon.codigoPatilla}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {armazon.codigoInterno}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {armazon.codigoColor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {armazon.letraColor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {armazon.tipoArmazon}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {armazon.material}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {armazon.ubicacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {armazon.cantidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {currecy.format(armazon.costo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {currecy.format(armazon.precioVenta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Tabla;