import { useEffect, useState } from "react";
import Formulario from "./Formulario";
import { Loader, Plus, Minus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";
import { ToastContainer } from 'react-toastify'

const Tabla = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [armazones, setArmazones] = useState([]);
  const [filteredArmazones, setFilteredArmazones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const getArmazones = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/armazones/");
      if (!response.ok) {
        throw new Error("Error al obtener los armazones");
      }
      const data = await response.json();
      setArmazones(data || []);
      setFilteredArmazones(data || []);
    } catch (error) {
      console.error("Error al obtener los armazones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar y filtrar armazones
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredArmazones(armazones);
      return;
    }

    const lowercasedTerm = term.toLowerCase().trim();
    const filtered = armazones.filter(armazon =>
      Object.values(armazon).some(value =>
        value?.toString().toLowerCase().includes(lowercasedTerm)
      )
    );

    setFilteredArmazones(filtered);
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredArmazones(armazones);
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  useEffect(() => {
    getArmazones();
  }, []);

  // Calcular los datos para la paginación
  const totalItems = filteredArmazones.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredArmazones.slice(startIndex, endIndex);

  // Cambiar página
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  // Reset a la primera página cuando cambien los datos o la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredArmazones.length, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-gray-500" size={48} />
      </div>
    );
  }

  const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

  return (
    <section className="bg-white shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto">
      {/* Header con título y botón */}
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">
          Inventario de Armazones
        </h1>
        <button
          onClick={toggleFormulario}
          className={`${mostrarFormulario
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
              getArmazones();
            }}
          />
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar armazones..."
            className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            {filteredArmazones.length === 0 ? (
              "No se encontraron resultados"
            ) : (
              `Se encontraron ${filteredArmazones.length} armazón${filteredArmazones.length !== 1 ? 'es' : ''}`
            )}
          </p>
        )}
      </div>

      {/* Controles de paginación superiores */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrar</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700">elementos por página</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} elementos
          </span>
        </div>
      </div>

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
            {currentData.map((armazon) => (
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
                  {currency.format(armazon.costo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {currency.format(armazon.precioVenta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación inferiores */}
      <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Primera página"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-1 mx-2">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Mostrar solo algunas páginas alrededor de la actual
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-8 h-8 rounded-md text-sm font-medium ${currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return <span key={pageNumber} className="px-2">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Última página"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Ir a página:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>

  );
};

export default Tabla;