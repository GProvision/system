import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader, Save, X } from 'lucide-react';

// Esquema de validación con Zod
const formSchema = z.object({
  codigoPatilla: z.string()
    .min(1, 'El código patilla es requerido')
    .max(20, 'El código patilla no puede tener más de 20 caracteres'),

  codigoInterno: z.string()
    .min(1, 'El código interno es requerido')
    .max(20, 'El código interno no puede tener más de 20 caracteres'),

  descripcion: z.string()
    .min(1, 'La descripción es requerida')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),

  codigoColor: z.string()
    .min(1, 'El código color es requerido')
    .max(20, 'El código color no puede tener más de 20 caracteres'),

  letraColor: z.string()
    .max(10, 'La letra color no puede tener más de 10 caracteres')
    .optional(),

  tipoArmazon: z.string()
    .min(1, 'El tipo de armazón es requerido')
    .max(50, 'El tipo de armazón no puede tener más de 50 caracteres'),

  material: z.string()
    .min(1, 'El material es requerido')
    .max(50, 'El material no puede tener más de 50 caracteres'),

  ubicacion: z.string()
    .min(1, 'La ubicación es requerida')
    .max(50, 'La ubicación no puede tener más de 50 caracteres'),

  cantidad: z.preprocess(
    (val) => Number(val),
    z.number()
      .min(0, 'La cantidad no puede ser negativa')
      .int('La cantidad debe ser un número entero')
  ),

  cantidadMinima: z.preprocess(
    (val) => Number(val),
    z.number()
      .min(0, 'La cantidad mínima no puede ser negativa')
      .int('La cantidad mínima debe ser un número entero')
  ),

  costo: z.preprocess(
    (val) => Number(val),
    z.number()
      .min(0, 'El costo no puede ser negativo')
      .max(999999.99, 'El costo no puede ser mayor a 999,999.99')
  ),

  precioVenta: z.preprocess(
    (val) => Number(val),
    z.number()
      .min(0, 'El precio de venta no puede ser negativo')
      .max(999999.99, 'El precio de venta no puede ser mayor a 999,999.99')
  ),

  activo: z.preprocess(
    (val) => val === "on" || val === true,
    z.boolean()
  ).default(true),
});

const Formulario = ({ onClose, onSuccess }) => {
  const [materiales, setMateriales] = useState([]);
  const [tiposArmazon, setTiposArmazon] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cantidad: 0,
      cantidadMinima: 2,
      costo: 0.00,
      precioVenta: 0.00,
      activo: true
    }
  });

  // Cargar datos desde las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [materialesRes, tiposRes, ubicacionesRes] = await Promise.all([
          fetch('http://localhost:5173/back/tipos/materiales')
            .then(res => {
              if (!res.ok) throw new Error('Error al cargar materiales');
              return res.json();
            })
            .then(data => {
              if (Array.isArray(data) && data.length > 0 && data[0].descripcion) {
                return data.map(item => item.descripcion);
              }
              return data;
            }),
          fetch('http://localhost:5173/back/tipos/armazones')
            .then(res => {
              if (!res.ok) throw new Error('Error al cargar tipos de armazón');
              return res.json();
            })
            .then(data => {
              if (Array.isArray(data) && data.length > 0 && data[0].descripcion) {
                return data.map(item => item.descripcion);
              }
              return data;
            }),
          fetch('http://localhost:5173/back/tipos/ubicaciones')
            .then(res => {
              if (!res.ok) throw new Error('Error al cargar ubicaciones');
              return res.json();
            })
            .then(data => {
              if (Array.isArray(data) && data.length > 0 && data[0].descripcion) {
                return data.map(item => item.descripcion);
              }
              return data;
            })
        ]);

        setMateriales([...new Set(materialesRes)]);
        setTiposArmazon([...new Set(tiposRes)]);
        setUbicaciones([...new Set(ubicacionesRes)]);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err.message);
        setMateriales([]);
        setTiposArmazon([]);
        setUbicaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

const onSubmit = async (data) => {
  try {
    setSubmitError(null);
    
    const armazonData = {
      codigoPatilla: data.codigoPatilla,
      codigoInterno: data.codigoInterno,
      descripcion: data.descripcion,
      codigoColor: data.codigoColor,
      letraColor: data.letraColor,
      tipoArmazon: data.tipoArmazon,
      material: data.material,
      ubicacion: data.ubicacion,
      cantidad: data.cantidad,
      cantidadMinima: data.cantidadMinima,
      costo: parseFloat(data.costo),
      precioVenta: parseFloat(data.precioVenta),
      activo: data.activo
    };

    console.log('Datos a enviar:', armazonData);

    // USAR LA MISMA ESTRATEGIA QUE PARA LOS DATOS DE LOS COMBOS
    // Pero apuntando a tu API local en lugar del backup
    const response = await fetch("/api/armazones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(armazonData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Armazón creado exitosamente:', result);
    
    reset();
    
    if (onSuccess) {
      onSuccess();
    }
    
  } catch (error) {
    console.error('Error al guardar el armazón:', error);
    setSubmitError(error.message || 'Error al guardar el armazón. Por favor, intenta nuevamente.');
  }
};

  if (loading) {
    return (
      <section className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
        <header className="bg-white px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-black">Nuevo Armazón</h1>
        </header>
        <div className="p-6 flex justify-center items-center h-32">
          <Loader className="animate-spin text-gray-500" size={24} />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <header className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Nuevo Armazón</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Cerrar formulario"
        >
          <X className="h-5 w-5" />
        </button>
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

      {submitError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="text-red-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {submitError}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        {/* Primera fila - Códigos principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="codigoPatilla">
              Código Patilla
              <span className="text-red-500" aria-label="campo requerido">*</span>
            </label>
            <input
              type="text"
              id="codigoPatilla"
              aria-required="true"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.codigoPatilla
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Ej: CP001"
              {...register('codigoPatilla')}
            />
            {errors.codigoPatilla && (
              <p className="text-red-500 text-xs mt-1">{errors.codigoPatilla.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="codigoInterno">
              Código Interno
              <span className="text-red-500" aria-label="campo requerido">*</span>
            </label>
            <input
              type="text"
              id="codigoInterno"
              aria-required="true"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.codigoInterno
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Ej: CI001"
              {...register('codigoInterno')}
            />
            {errors.codigoInterno && (
              <p className="text-red-500 text-xs mt-1">{errors.codigoInterno.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="codigoColor">
              Código Color
              <span className="text-red-500" aria-label="campo requerido">*</span>
            </label>
            <input
              type="text"
              id="codigoColor"
              aria-required="true"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.codigoColor
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Ej: CC001"
              {...register('codigoColor')}
            />
            {errors.codigoColor && (
              <p className="text-red-500 text-xs mt-1">{errors.codigoColor.message}</p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="descripcion">
            Descripción
            <span className="text-red-500" aria-label="campo requerido">*</span>
          </label>
          <textarea
            id="descripcion"
            aria-required="true"
            rows={3}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.descripcion
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
              }`}
            placeholder="Descripción detallada del armazón..."
            {...register('descripcion')}
          />
          {errors.descripcion && (
            <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>
          )}
        </div>

        {/* Segunda fila - Características con datalist */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="letraColor">
              Letra Color
            </label>
            <input
              type="text"
              id="letraColor"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.letraColor
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Ej: N, R, A"
              {...register('letraColor')}
            />
            {errors.letraColor && (
              <p className="text-red-500 text-xs mt-1">{errors.letraColor.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tipoArmazon">
              Tipo de Armazón
              <span className="text-red-500" aria-label="campo requerido">*</span>
            </label>
            <input
              type="text"
              id="tipoArmazon"
              aria-required="true"
              list="tiposArmazon"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.tipoArmazon
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Selecciona o escribe un tipo"
              {...register('tipoArmazon')}
            />
            <datalist id="tiposArmazon">
              {tiposArmazon.map((tipo) => (
                <option key={tipo} value={tipo} />
              ))}
            </datalist>
            {errors.tipoArmazon && (
              <p className="text-red-500 text-xs mt-1">{errors.tipoArmazon.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="material">
              Material
              <span className="text-red-500" aria-label="campo requerido">*</span>
            </label>
            <input
              type="text"
              id="material"
              aria-required="true"
              list="materiales"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.material
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Selecciona o escribe un material"
              {...register('material')}
            />
            <datalist id="materiales">
              {materiales.map((material) => (
                <option key={material} value={material} />
              ))}
            </datalist>
            {errors.material && (
              <p className="text-red-500 text-xs mt-1">{errors.material.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ubicacion">
              Ubicación
              <span className="text-red-500" aria-label="campo requerido">*</span>
            </label>
            <input
              type="text"
              id="ubicacion"
              aria-required="true"
              list="ubicaciones"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.ubicacion
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Selecciona o escribe una ubicación"
              {...register('ubicacion')}
            />
            <datalist id="ubicaciones">
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion} value={ubicacion} />
              ))}
            </datalist>
            {errors.ubicacion && (
              <p className="text-red-500 text-xs mt-1">{errors.ubicacion.message}</p>
            )}
          </div>
        </div>

        {/* Tercera fila - Inventario y precios */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cantidad">
              Cantidad
              <span className="text-red-500" aria-label="campo requerido">*</span>
            </label>
            <input
              type="number"
              id="cantidad"
              aria-required="true"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.cantidad
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              min="0"
              {...register('cantidad')}
            />
            {errors.cantidad && (
              <p className="text-red-500 text-xs mt-1">{errors.cantidad.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cantidadMinima">
              Cantidad Mínima
            </label>
            <input
              type="number"
              id="cantidadMinima"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.cantidadMinima
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              min="0"
              {...register('cantidadMinima')}
            />
            {errors.cantidadMinima && (
              <p className="text-red-500 text-xs mt-1">{errors.cantidadMinima.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="costo">
              Costo ($)
            </label>
            <input
              type="number"
              id="costo"
              step="0.01"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.costo
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              min="0"
              {...register('costo')}
            />
            {errors.costo && (
              <p className="text-red-500 text-xs mt-1">{errors.costo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="precioVenta">
              Precio Venta ($)
              <span className="text-red-500" aria-label="campo requerido">*</span>
            </label>
            <input
              type="number"
              id="precioVenta"
              aria-required="true"
              step="0.01"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${errors.precioVenta
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              min="0"
              {...register('precioVenta')}
            />
            {errors.precioVenta && (
              <p className="text-red-500 text-xs mt-1">{errors.precioVenta.message}</p>
            )}
          </div>
        </div>

        {/* Checkbox Activo */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="activo"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register('activo')}
          />
          <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
            Armazón activo en inventario
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="size-4 mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader className="size-4 animate-spin mr-2" />
            ) : (
              <Save className="size-4 mr-2" />
            )}
            {isSubmitting ? 'Guardando...' : 'Guardar Armazón'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Formulario;