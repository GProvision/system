import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2, 
  RotateCcw,
  Plus
} from 'lucide-react';

const OpticasDelegaciones = () => {
  const [delegaciones, setDelegaciones] = useState([]);
  const [opticas, setOpticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDelegacion, setFilterDelegacion] = useState('');
  const [expandedDelegacion, setExpandedDelegacion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch delegaciones
        const [delegacionesRes, opticasRes] = await Promise.all([
          fetch('/api/delegaciones').then(res => res.json()),
          fetch('/api/opticas').then(res => res.json())
        ]);
        
        setDelegaciones(delegacionesRes);
        setOpticas(opticasRes);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleDelegacionChange = (e) => {
    setFilterDelegacion(e.target.value);
    setCurrentPage(1);
  };

  const toggleDelegacion = (delegacionId) => {
    setExpandedDelegacion(expandedDelegacion === delegacionId ? null : delegacionId);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleToggleOpticaStatus = async (opticaId, currentStatus) => {
    try {
      const endpoint = currentStatus ? 'delete' : 'restore';
      const response = await fetch(`/api/opticas/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: opticaId })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      setOpticas(opticas.map(optica => 
        optica.id === opticaId ? { ...optica, activo: !currentStatus } : optica
      ));
      
      toast.success(
        currentStatus ? 'Óptica desactivada correctamente' : 'Óptica reactivada correctamente'
      );
    } catch (err) {
      console.error('Error updating optica status:', err);
      toast.error('Error al actualizar el estado de la óptica');
    }
  };

  // Filter and group opticas by delegacion
  const filteredDelegaciones = delegaciones
    .filter(delegacion => 
      delegacion.nombre.toLowerCase().includes(searchTerm) ||
      opticas.some(optica => 
        optica.delegacionId === delegacion.id && 
        optica.nombre.toLowerCase().includes(searchTerm)
      )
    )
    .filter(delegacion => 
      !filterDelegacion || delegacion.id === parseInt(filterDelegacion)
    );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedDelegaciones = filteredDelegaciones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDelegaciones.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ópticas por Delegación</h1>
          <p className="text-gray-600">Visualice y gestione las ópticas agrupadas por delegación</p>
        </div>
        <button
          onClick={() => navigate('/opticas/nueva')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Óptica</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por delegación u óptica..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterDelegacion}
                  onChange={handleDelegacionChange}
                  className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Todas las delegaciones</option>
                  {delegaciones.map(delegacion => (
                    <option key={delegacion.id} value={delegacion.id}>
                      {delegacion.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="block w-24 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delegación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ópticas
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDelegaciones.length > 0 ? (
                paginatedDelegaciones.map((delegacion) => {
                  const delegacionOpticas = opticas.filter(
                    optica => optica.delegacionId === delegacion.id
                  );
                  const isExpanded = expandedDelegacion === delegacion.id;

                  return (
                    <React.Fragment key={delegacion.id}>
                      <tr 
                        className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleDelegacion(delegacion.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {delegacion.nombre.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {delegacion.nombre}
                              </div>
                              <div className="text-sm text-gray-500">
                                {delegacionOpticas.length} ópticas
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {delegacionOpticas.slice(0, 3).map(optica => (
                              <span 
                                key={optica.id} 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  optica.activo 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {optica.nombre}
                              </span>
                            ))}
                            {delegacionOpticas.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                                +{delegacionOpticas.length - 3} más
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDelegacion(delegacion.id);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {isExpanded ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-blue-50">
                          <td colSpan="3" className="px-6 py-4">
                            <div className="overflow-hidden shadow-sm rounded-lg border border-gray-200">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Dirección
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Teléfono
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Acciones
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {delegacionOpticas.map((optica) => (
                                    <tr key={optica.id} className="hover:bg-gray-50">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                          {optica.nombre}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {optica.email}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {optica.direccion}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {optica.telefono}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          optica.activo 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {optica.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                          <button
                                            onClick={() => navigate(`/opticas/editar/${optica.id}`)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Editar"
                                          >
                                            <Edit size={18} />
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleToggleOpticaStatus(optica.id, optica.activo);
                                            }}
                                            className={optica.activo 
                                              ? 'text-red-600 hover:text-red-900' 
                                              : 'text-green-600 hover:text-green-900'
                                            }
                                            title={optica.activo ? 'Desactivar' : 'Reactivar'}
                                          >
                                            {optica.activo ? (
                                              <Trash2 size={18} />
                                            ) : (
                                              <RotateCcw size={18} />
                                            )}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron delegaciones que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{' '}
                <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                a{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredDelegaciones.length)}
                </span>{' '}
                de <span className="font-medium">{filteredDelegaciones.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Primera</span>
                  <span>«</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <span>‹</span>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Siguiente</span>
                  <span>›</span>
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Última</span>
                  <span>»</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpticasDelegaciones;