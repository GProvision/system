import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2, Plus, Save, X, RefreshCcw, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const OpticaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [optica, setOptica] = useState(null);
  const [delegaciones, setDelegaciones] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDelegacion, setIsAddingDelegacion] = useState(false);
  const [editingDelegacion, setEditingDelegacion] = useState(null);
  
  const { register: registerOptica, handleSubmit: handleOpticaSubmit, reset: resetOpticaForm, formState: { errors: opticaErrors } } = useForm();
  const { register: registerDelegacion, handleSubmit: handleDelegacionSubmit, reset: resetDelegacionForm, formState: { errors: delegacionErrors } } = useForm();

  // Fetch optica data
  useEffect(() => {
    const fetchOptica = async () => {
      try {
        const response = await fetch(`${API_URL}/opticas/${id}`);
        if (!response.ok) throw new Error('Error fetching optica');
        const data = await response.json();
        setOptica(data);
        resetOpticaForm({
          nombre: data.nombre,
          activo: data.activo
        });
        // Fetch delegaciones for this optica
        fetchDelegaciones();
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar la óptica');
      }
    };

    if (id) {
      fetchOptica();
    }
  }, [id, resetOpticaForm]);

  // Fetch delegaciones for the current optica
  const fetchDelegaciones = async () => {
    try {
      // Note: You'll need to implement this endpoint in your backend
      const response = await fetch(`${API_URL}/delegaciones?opticaId=${id}`);
      if (!response.ok) throw new Error('Error fetching delegaciones');
      const data = await response.json();
      setDelegaciones(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las delegaciones');
    }
  };

  // Handle optica form submission
  const onSubmitOptica = async (data) => {
    try {
      const response = await fetch(`${API_URL}/opticas/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(id),
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

  // Handle add/edit delegacion
  const onSubmitDelegacion = async (data) => {
    try {
      const url = editingDelegacion 
        ? `${API_URL}/delegaciones/update`
        : `${API_URL}/delegaciones`;
      
      const method = editingDelegacion ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          opticaId: Number(id)
        })
      });
      
      if (!response.ok) throw new Error('Error al guardar la delegación');
      
      resetDelegacionForm();
      setIsAddingDelegacion(false);
      setEditingDelegacion(null);
      fetchDelegaciones();
      toast.success(`Delegación ${editingDelegacion ? 'actualizada' : 'agregada'} correctamente`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error al ${editingDelegacion ? 'actualizar' : 'agregar'} la delegación`);
    }
  };

  // Handle delete delegacion
  const handleDeleteDelegacion = async (delegacionId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta delegación?')) return;
    
    try {
      const response = await fetch(`${API_URL}/delegaciones/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(delegacionId) })
      });
      
      if (!response.ok) throw new Error('Error al eliminar la delegación');
      
      fetchDelegaciones();
      toast.success('Delegación eliminada correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la delegación');
    }
  };

  // Handle restore a delegacion
  const handleRestoreDelegacion = async (delegacionId) => {
    if (!window.confirm('¿Está seguro de que desea restaurar esta delegación?')) return;
    
    try {
      const response = await fetch(`${API_URL}/delegaciones/restore`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(delegacionId) })
      });
      
      if (!response.ok) throw new Error('Error al restaurar la delegación');
      
      fetchDelegaciones();
      toast.success('Delegación restaurada correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al restaurar la delegación');
    }

    
  }

  // Start editing a delegacion
  const handleEditDelegacion = (delegacion) => {
    setEditingDelegacion(delegacion);
    resetDelegacionForm({
      nombre: delegacion.nombre,
      activo: delegacion.activo,
      id: delegacion.id
    });
    setIsAddingDelegacion(true);
  };

  const handleViewDelegacion = (delegacion) => {
    navigate(`/opticas/${id}/${delegacion.id}/sindicatos`);
  };

  if (!optica) {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {optica.nombre}
        </h1>
        <p className="text-gray-600 dark:text-gray-900">
          Gestión de óptica y delegaciones
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

      {/* Delegaciones Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Delegaciones
          </h2>
          {!isAddingDelegacion && (
            <button
              type="button"
              onClick={() => {
                setEditingDelegacion(null);
                resetDelegacionForm();
                setIsAddingDelegacion(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Agregar nueva delegación"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Delegación
            </button>
          )}
        </div>

        {/* Add/Edit Delegacion Form */}
        {isAddingDelegacion && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingDelegacion ? 'Editar Delegación' : 'Nueva Delegación'}
            </h3>
            <form onSubmit={handleDelegacionSubmit(onSubmitDelegacion)} className="space-y-4">
              <div>
                <label htmlFor="delegacion-nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de la Delegación
                </label>
                <input
                  type="text"
                  id="delegacion-nombre"
                  {...registerDelegacion('nombre', { required: 'El nombre es obligatorio' })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${delegacionErrors.nombre ? 'border-red-500' : ''}`}
                  aria-invalid={!!delegacionErrors.nombre}
                  aria-describedby={delegacionErrors.nombre ? 'delegacion-nombre-error' : undefined}
                />
                {delegacionErrors.nombre && (
                  <p id="delegacion-nombre-error" className="mt-1 text-sm text-red-600">
                    {delegacionErrors.nombre.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingDelegacion(false);
                    setEditingDelegacion(null);
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
                  {editingDelegacion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delegaciones List */}
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
              {delegaciones.length > 0 ? (
                delegaciones.map((delegacion) => (
                  <tr key={delegacion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {delegacion.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${delegacion.activo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {delegacion.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDelegacion(delegacion)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label={`Ver delegación ${delegacion.nombre}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditDelegacion(delegacion)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label={`Editar delegación ${delegacion.nombre}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {delegacion.activo && (<button
                        onClick={() => handleDeleteDelegacion(delegacion.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2"
                        aria-label={`Eliminar delegación ${delegacion.nombre}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>)}
                      {!delegacion.activo && (<button
                        onClick={() => handleRestoreDelegacion(delegacion.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 ml-2"
                        aria-label={`Restaurar delegación ${delegacion.nombre}`}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </button>)}
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No hay delegaciones registradas
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

export default OpticaPage;