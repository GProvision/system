import React, { useState } from "react";
import Formulario from "./Formulario";

const Tabla = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Datos de ejemplo
  const armazones = [
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
      costo: 45.50,
      precioVenta: 120.00
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
      costo: 60.00,
      precioVenta: 150.00
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
      costo: 35.00,
      precioVenta: 95.00
    }
  ];

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

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
          } text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          aria-label={mostrarFormulario ? "Cerrar formulario" : "Agregar nuevo armazón"}
        >
          {mostrarFormulario ? "−" : "+"}
        </button>
      </header>

      {/* Formulario desplegable */}
      {mostrarFormulario && (
        <div className="border-b border-gray-200 bg-gray-50 p-6">
          <Formulario 
            onClose={toggleFormulario} 
            onSuccess={() => {
              toggleFormulario();
              // Aquí podrías recargar los datos de la tabla
            }} 
          />
        </div>
      )}

      {/* Contenedor principal de la tabla */}
      <article className="w-full">
        {/* Encabezados de columnas */}
        <section className="grid grid-cols-10 gap-2 bg-gray-50 px-6 py-3 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">C. Patilla</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">C. Interno</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">C. Color</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">L. Color</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Material</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicacion</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">P. Venta</span>
        </section>

        {/* Filas de datos */}
        {armazones.map((armazon) => (
          <article 
            key={armazon.id} 
            className="grid grid-cols-10 gap-2 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center">
              <span className="text-sm text-gray-900 font-medium">{armazon.codigoPatilla}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-900">{armazon.codigoInterno}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-900">{armazon.codigoColor}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-900">{armazon.lineaColor}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-900">{armazon.tipo}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-900">{armazon.material}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-900">{armazon.ubicacion}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-900 font-semibold">{armazon.cantidad}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">${armazon.costo.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-green-600">${armazon.precioVenta.toFixed(2)}</span>
            </div>
          </article>
        ))}
      </article>
    </section>
  );
};

export default Tabla;