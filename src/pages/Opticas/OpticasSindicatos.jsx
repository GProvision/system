import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2, Plus, Save, X, RefreshCcw, Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const OpticasSindicatos = () => {
  const { id: opticaId, delegacion: delegacionId } = useParams();
  const navigate = useNavigate();
  
  const [optica, setOptica] = useState(null);
  const [delegacion, setDelegacion] = useState(null);
  const [sindicatos, setSindicatos] = useState([]);
  const [allSindicatos, setAllSindicatos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSindicato, setIsAddingSindicato] = useState(false);
  const [editingSindicato, setEditingSindicato] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register: registerOptica, handleSubmit: handleOpticaSubmit, reset: resetOpticaForm, formState: { errors: opticaErrors } } = useForm();
  const { register: registerSindicato, handleSubmit: handleSindicatoSubmit, reset: resetSindicatoForm, formState: { errors: sindicatoErrors } } = useForm();

  // Fetch optica and delegacion data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch optica data
        const opticaResponse = await fetch(`${API_URL}/opticas/${opticaId}`);
        if (!opticaResponse.ok) throw new Error('Error fetching optica');
        const opticaData = await opticaResponse.json();
        setOptica(opticaData);
        
        // Fetch delegacion data
        const delegacionResponse = await fetch(`${API_URL}/delegaciones/${delegacionId}`);
        if (!delegacionResponse.ok) throw new Error('Error fetching delegacion');
        const delegacionData = await delegacionResponse.json();
        setDelegacion(delegacionData);
        
        // Fetch all sindicatos for the optica and delegacion
        fetchSindicatos();
        
        // Fetch all available sindicatos for the dropdown
        fetchAllSindicatos();
        
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar los datos');
      }
    };

    if (opticaId && delegacionId) {
      fetchData();
    }
  }, [opticaId, delegacionId]);

  // Fetch all sindicatos for the current optica and delegacion
  const fetchSindicatos = async () => {
    try {
      // This endpoint needs to be implemented in the backend
      const response = await fetch(`${API_URL}/sindicatos?opticaId=${opticaId}&delegacionId=${delegacionId}`);
      if (!response.ok) throw new Error('Error fetching sindicatos');
      const data = await response.json();
      setSindicatos(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los sindicatos');
    }
  };

  // Fetch all available sindicatos for the dropdown
  const fetchAllSindicatos = async () => {
    try {
      const response = await fetch(`${API_URL}/sindicatos`);
      if (!response.ok) throw new Error('Error fetching all sindicatos');
      const data = await response.json();
      setAllSindicatos(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar todos los sindicatos');
    }
  };

  // Handle optica form submission
  const onSubmitOptica = async (data) => {
    try {
      const response = await fetch(`${API_URL}/opticas/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(opticaId),
          ...data,
          activo: Boolean(data.activo)
        })
      });
      
      if (!response.ok) throw new Error('Error al actualizar la óptica');
      
      const updatedOptica = await response.json();
      setOptica(updatedOptica);
      setIsEditing(false);
      toast.success('Óptica actualizada correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la óptica');
    }
  };

  // Handle add/edit sindicato
  const onSubmitSindicato = async (data) => {
    try {
      // This endpoint needs to be implemented in the backend
      const url = editingSindicato 
        ? `${API_URL}/sindicatos/update`
        : `${API_URL}/sindicatos`;
      
      const method = editingSindicato ? 'PUT' : 'POST';

      let bodyData = {
        ...data,
        opticaId: Number(opticaId),
        delegacionId: Number(delegacionId)
      };

      if (editingSindicato) {
        delete bodyData.opticaId;
        delete bodyData.delegacionId;
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      if (!response.ok) throw new Error('Error al guardar el sindicato');
      
      resetSindicatoForm();
      setIsAddingSindicato(false);
      setEditingSindicato(null);
      fetchSindicatos();
      toast.success(`Sindicato ${editingSindicato ? 'actualizado' : 'agregado'} correctamente`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error al ${editingSindicato ? 'actualizar' : 'agregar'} el sindicato`);
    }
  };

  // Handle delete sindicato
  const handleDeleteSindicato = async (sindicatoId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este sindicato de la delegación?')) return;
    
    try {
      // This endpoint needs to be implemented in the backend
      const response = await fetch(`${API_URL}/sindicatos/remove-from-delegacion`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sindicatoId: Number(sindicatoId),
          delegacionId: Number(delegacionId),
          opticaId: Number(opticaId)
        })
      });
      
      if (!response.ok) throw new Error('Error al eliminar el sindicato');
      
      fetchSindicatos();
      toast.success('Sindicato eliminado de la delegación correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar el sindicato');
    }
  };

  // Start editing a sindicato
  const handleEditSindicato = (sindicato) => {
    setEditingSindicato(sindicato.id);
    resetSindicatoForm({
      idSindicato: sindicato.id,
      nombre: sindicato.nombre,
      activo: sindicato.activo
    });
    setIsAddingSindicato(true);
  };

  // Filter sindicatos based on search term
  const filteredSindicatos = sindicatos.filter(sindicato =>
    sindicato.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!optica || !delegacion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <header className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <div className="flex items-center">
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/opticas');
                  }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Ópticas
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  {optica.nombre}
                </span>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  Delegación: {delegacion.nombre}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Sindicatos
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gestión de sindicatos para {optica.nombre} - {delegacion.nombre}
        </p>
      </header>

      {/* Optica Details Card */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Información de la Óptica
          </h2>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Editar información de la óptica"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </button>
          ) : (
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  resetOpticaForm({
                    nombre: optica.nombre,
                    activo: optica.activo
                  });
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                form="optica-form"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </button>
            </div>
          )}
        </div>

        <form 
          id="optica-form" 
          onSubmit={handleOpticaSubmit(onSubmitOptica)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de la Óptica
            </label>
            {isEditing ? (
              <input
                type="text"
                id="nombre"
                {...registerOptica('nombre', { required: 'El nombre es obligatorio' })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${opticaErrors.nombre ? 'border-red-500' : ''}`}
                aria-invalid={!!opticaErrors.nombre}
                aria-describedby={opticaErrors.nombre ? 'nombre-error' : undefined}
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{optica.nombre}</p>
            )}
            {opticaErrors.nombre && (
              <p id="nombre-error" className="mt-1 text-sm text-red-600">
                {opticaErrors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="activo"
                disabled={!isEditing}
                {...registerOptica('activo')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Activo
              </label>
            </div>
          </div>
        </form>
      </section>

      {/* Sindicatos Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Sindicatos de {optica.nombre} - {delegacion.nombre}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestione los sindicatos asociados a esta delegación
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar sindicatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Buscar sindicatos"
              />
            </div>
            
            {!isAddingSindicato && (
              <button
                type="button"
                onClick={() => {
                  setEditingSindicato(null);
                  resetSindicatoForm();
                  setIsAddingSindicato(true);
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label="Agregar nuevo sindicato"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Sindicato
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Sindicato Form */}
        {isAddingSindicato && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingSindicato ? 'Editar Sindicato' : 'Nuevo Sindicato'}
            </h3>
            <form onSubmit={handleSindicatoSubmit(onSubmitSindicato)} className="space-y-4">
              <div>
                <label htmlFor="sindicato-nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del Sindicato
                </label>
                <input
                  type="text"
                  id="sindicato-nombre"
                  {...registerSindicato('nombre', { required: 'El nombre es obligatorio' })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${sindicatoErrors.nombre ? 'border-red-500' : ''}`}
                  aria-invalid={!!sindicatoErrors.nombre}
                  aria-describedby={sindicatoErrors.nombre ? 'sindicato-nombre-error' : undefined}
                />
                {sindicatoErrors.nombre && (
                  <p id="sindicato-nombre-error" className="mt-1 text-sm text-red-600">
                    {sindicatoErrors.nombre.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sindicato-activo"
                  {...registerSindicato('activo')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sindicato-activo" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Activo
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSindicato(false);
                    setEditingSindicato(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingSindicato ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sindicatos List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSindicatos.length > 0 ? (
                filteredSindicatos.map((sindicato) => (
                  <tr key={sindicato.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {sindicato.nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sindicato.activo 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {sindicato.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditSindicato(sindicato)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label={`Editar sindicato ${sindicato.nombre}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSindicato(sindicato.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2"
                        aria-label={`Eliminar sindicato ${sindicato.nombre}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {filteredSindicatos.length === 0 && sindicatos.length > 0
                      ? 'No se encontraron sindicatos que coincidan con la búsqueda'
                      : 'No hay sindicatos registrados para esta delegación'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OpticasSindicatos;