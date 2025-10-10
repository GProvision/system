import React, { useEffect, useState } from 'react';

const Formulario = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    codigoPatilla: '',
    codigoInterno: '',
    descripcion: '',
    codigoColor: '',
    letraColor: '',
    tipoArmazon: '',
    material: '',
    ubicacion: '',
    cantidad: 0,
    cantidadMinima: 2,
    activo: true,
    costo: 0.00,
    precioVenta: 0.00
  });

  const [materiales, setMateriales] = useState([]);
  const [tiposArmazon, setTiposArmazon] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos desde las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [materialesRes, tiposRes, ubicacionesRes] = await Promise.all([
          fetch('/back/tipos/materiales').then(res => {
            if (!res.ok) throw new Error('Error al cargar materiales');
            return res.json();
          }),
          fetch('/back/tipos/armazones').then(res => {
            if (!res.ok) throw new Error('Error al cargar tipos de armazón');
            return res.json();
          }),
          fetch('/back/tipos/ubicaciones').then(res => {
            if (!res.ok) throw new Error('Error al cargar ubicaciones');
            return res.json();
          })
        ]);

        setMateriales([...new Set(materialesRes.map(({descripcion}) => descripcion))]);
        setTiposArmazon([...new Set(tiposRes.map(({descripcion}) => descripcion))]);
        setUbicaciones([...new Set(ubicacionesRes.map(({descripcion}) => descripcion))]);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err.message);
        // Datos por defecto en caso de error
        setMateriales([]);
        setTiposArmazon([]);
        setUbicaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : 
              value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Aquí conectarás con tu API
    
    // Después de guardar exitosamente:
    if (onSuccess) {
      onSuccess();
    } else {
      alert('Armazón guardado correctamente');
    }
    
    // Resetear formulario después de enviar
    setFormData({
      codigoPatilla: '',
      codigoInterno: '',
      descripcion: '',
      codigoColor: '',
      letraColor: '',
      tipoArmazon: '',
      material: '',
      ubicacion: '',
      cantidad: 0,
      cantidadMinima: 2,
      activo: true,
      costo: 0.00,
      precioVenta: 0.00
    });
  };

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <section className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
        <header className="bg-white px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-black">Nuevo Armazón</h1>
        </header>
        <div className="p-6 flex justify-center items-center h-32">
          <div className="text-gray-500">Cargando opciones...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header del formulario */}
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">
          Nuevo Armazón
        </h1>
      </header>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="text-yellow-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error}. Se están utilizando datos por defecto.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        {/* Primera fila - Códigos principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Patilla *
            </label>
            <input
              type="text"
              name="codigoPatilla"
              value={formData.codigoPatilla}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: CP001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Interno *
            </label>
            <input
              type="text"
              name="codigoInterno"
              value={formData.codigoInterno}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: CI001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Color *
            </label>
            <input
              type="text"
              name="codigoColor"
              value={formData.codigoColor}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: CC001"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descripción detallada del armazón..."
          />
        </div>

        {/* Segunda fila - Características con datalist */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Letra Color
            </label>
            <input
              type="text"
              name="letraColor"
              value={formData.letraColor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: N, R, A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Armazón *
            </label>
            <input
              type="text"
              name="tipoArmazon"
              value={formData.tipoArmazon}
              onChange={handleChange}
              list="tiposArmazon"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Selecciona o escribe un tipo"
            />
            <datalist id="tiposArmazon">
              {tiposArmazon.map((tipo) => (
                <option key={tipo} value={tipo} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material *
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              list="materiales"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Selecciona o escribe un material"
            />
            <datalist id="materiales">
              {materiales.map((material) => (
                <option key={material} value={material} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              list="ubicaciones"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Selecciona o escribe una ubicación"
            />
            <datalist id="ubicaciones">
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion} value={ubicacion} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Tercera fila - Inventario y precios */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad *
            </label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad Mínima
            </label>
            <input
              type="number"
              name="cantidadMinima"
              value={formData.cantidadMinima}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo ($)
            </label>
            <input
              type="number"
              name="costo"
              value={formData.costo}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Venta ($) *
            </label>
            <input
              type="number"
              name="precioVenta"
              value={formData.precioVenta}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Checkbox Activo */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Armazón activo en inventario
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setFormData({
                codigoPatilla: '',
                codigoInterno: '',
                descripcion: '',
                codigoColor: '',
                letraColor: '',
                tipoArmazon: '',
                material: '',
                ubicacion: '',
                cantidad: 0,
                cantidadMinima: 2,
                activo: true,
                costo: 0.00,
                precioVenta: 0.00
              })}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar Armazón
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Formulario;