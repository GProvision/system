import React, { useState } from 'react';

const Formulario = ({ onClose, onSuccess }) => { // Añadir props aquí
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

  const materiales = ['Acetato', 'Metal', 'Plástico', 'Titanio', 'Mixed', 'Flexible'];
  const tiposArmazon = ['Ovalado', 'Rectangular', 'Redondo', 'Geométrico', 'Aviador', 'Mariposa', 'Deportivo'];
  const ubicaciones = ['Estante A', 'Estante B', 'Estante C', 'Estante D', 'Caja 1', 'Caja 2', 'Mostrador'];

  return (
    <section className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header del formulario */}
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">
          Nuevo Armazón
        </h1>
        {onClose && ( // Solo mostrar el botón de cerrar si onClose está definido
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        )}
      </header>

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

        {/* Segunda fila - Características */}
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
            <select
              name="tipoArmazon"
              value={formData.tipoArmazon}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo</option>
              {tiposArmazon.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material *
            </label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar material</option>
              {materiales.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <select
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar ubicación</option>
              {ubicaciones.map(ubicacion => (
                <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
              ))}
            </select>
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
        <div className="flex justify-between space-x-4 pt-4 border-t border-gray-200">
          {onClose && ( // Solo mostrar cancelar si onClose está definido
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          )}
          
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