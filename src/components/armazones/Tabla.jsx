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
      // const response = await fetch("/api/armazones");
      const res = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              {
                id: 1,
                codigoPatilla: "CP001",
                codigoInterno: "CI001",
                codigoColor: "CC001",
                lineaColor: "Negro",
                tipo: "Ovalado",
                material: "Acetato",
                ubicacion: "Estante A",
                cantidad: 15,
                costo: 45.5,
                precioVenta: 120.0,
              },
              {
                id: 2,
                codigoPatilla: "CP002",
                codigoInterno: "CI002",
                codigoColor: "CC002",
                lineaColor: "Marrón",
                tipo: "Rectangular",
                material: "Metal",
                ubicacion: "Estante B",
                cantidad: 8,
                costo: 60.0,
                precioVenta: 150.0,
              },
              {
                id: 3,
                codigoPatilla: "CP003",
                codigoInterno: "CI003",
                codigoColor: "CC003",
                lineaColor: "Azul",
                tipo: "Redondo",
                material: "Plástico",
                ubicacion: "Estante C",
                cantidad: 20,
                costo: 35.0,
                precioVenta: 95.0,
              },
            ]),
          1000
        )
      );
      setArmazones(res || []);
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
                  {armazon.lineaColor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {armazon.tipo}
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
                  ${armazon.costo.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  ${armazon.precioVenta.toFixed(2)}
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