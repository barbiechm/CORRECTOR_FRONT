import React from 'react';

export const ResultsDisplay = ({ data }) => {
  if (!data) return null;

  const { resumen, detalle } = data;

  // 1. Lógica de Colores para el "Estado General" de la fila
  const getStatusBadge = (estado) => {
    switch (estado) {
      case "CORRECTA": 
        return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-green-100 text-green-800 border-green-200">CORRECTA</span>;
      case "PARCIAL": 
        return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-yellow-100 text-yellow-800 border-yellow-200">PARCIAL</span>;
      case "INCORRECTA": 
        return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-red-100 text-red-800 border-red-200">INCORRECTA</span>;
      default: 
        return <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-800 border-gray-200">NO RESPONDIÓ</span>;
    }
  };

  // 2. ESTA ES LA FUNCIÓN QUE CAMBIAMOS (Maneja trampas y colores parciales)
  const renderCellContent = (info) => {
    if (!info) return <span className="text-gray-400">---</span>;

    // --- CASO ESPECIAL: RESPUESTA TRAMPA / INNECESARIA ---
    // El profesor no pidió nada (totalItems 0), pero el alumno escribió algo.
    if (info.totalItems === 0 && info.recibida && info.recibida !== "---") {
      return (
        <div className="flex flex-col space-y-2 opacity-75">
          {/* Lo que escribió el alumno (Tachado suave gris) */}
          <div className="p-2 rounded border bg-gray-100 border-gray-300 text-gray-600 line-through decoration-gray-400">
            <div className="font-medium text-xs">
              {info.recibida}
            </div>
          </div>
          
          {/* Mensaje de advertencia */}
          <div className="text-[10px] text-orange-600 font-bold flex items-center bg-orange-50 p-1 rounded w-max border border-orange-100">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            NO REQUERÍA RESPUESTA
          </div>
        </div>
      );
    }

    // --- CASO: PERFECTO (Verde) ---
    if (info.esCorrecta) {
      return (
        <div className="flex items-center text-green-700 font-medium bg-green-50 p-2 rounded border border-green-100">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          {info.recibida}
        </div>
      );
    }

    // --- CASO: PARCIAL O INCORRECTO ---
    const porcentaje = info.totalItems > 0 ? (info.aciertos / info.totalItems) : 0;
    const esCasiPerfecto = porcentaje > 0.8; // Más del 80% bien se ve amarillo, menos se ve rojo

    return (
      <div className="flex flex-col space-y-2">
        {/* Lo que escribió el alumno (Con color según si estuvo cerca o lejos) */}
        <div className={`p-2 rounded border ${esCasiPerfecto ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="font-medium">
            {info.recibida || "(Vacío)"}
          </div>
          
          {/* Badge de Aciertos */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
              Aciertos:
            </span>
            <span className="text-xs font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
              {info.aciertos} / {info.totalItems}
            </span>
          </div>
        </div>
        
        {/* La corrección (Lo esperado) */}
        <div className="text-xs text-gray-500 pl-2 border-l-2 border-gray-300">
          <span className="font-bold block text-gray-700 uppercase text-[10px] mb-1">Debía ser:</span> 
          {info.esperada}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* --- TARJETAS DE RESUMEN --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <h3 className="text-gray-500 font-medium uppercase text-sm tracking-wider">Nota Final</h3>
          <p className={`text-5xl font-bold mt-2 ${resumen.notaFinal >= 10 ? 'text-blue-600' : 'text-red-500'}`}>
            {resumen.notaFinal}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <h3 className="text-gray-500 font-medium uppercase text-sm tracking-wider">Puntos Obtenidos</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {resumen.puntosObtenidos} <span className="text-gray-400 text-lg">/ {resumen.puntosTotales}</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <h3 className="text-gray-500 font-medium uppercase text-sm tracking-wider">Preguntas</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{resumen.totalPreguntas}</p>
        </div>
      </div>

      {/* --- TABLA DETALLADA --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-700">Detalle de la Corrección</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase font-semibold text-xs">
              <tr>
                <th className="p-3 w-10">#</th>
                <th className="p-3 w-32">Pregunta</th>
                <th className="p-3 w-20 text-center">Nota</th>
                <th className="p-3 w-24 text-center">Estado</th>
                <th className="p-3 w-64">Gramática (Respuesta)</th>
                <th className="p-3 w-64">Clasificación (Respuesta)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {detalle.map((item, index) => (
                <tr key={index} className={`hover:bg-gray-50 transition-colors 
                  ${item.estado === 'INCORRECTA' ? 'bg-red-50/30' : ''} 
                  ${item.estado === 'PARCIAL' ? 'bg-yellow-50/30' : ''}`}
                >
                  <td className="p-3 font-mono text-gray-500 align-top">{item.id}</td>
                  <td className="p-3 font-medium text-gray-800 align-top">{item.pregunta}</td>
                  
                  <td className="p-3 text-center align-top">
                    <span className="font-bold text-gray-800">{item.valorObtenido}</span>
                    <span className="text-gray-400 text-xs"> / {item.valorTotal}</span>
                  </td>
                  
                  <td className="p-3 text-center align-top">
                    {getStatusBadge(item.estado)}
                  </td>

                  <td className="p-3 align-top bg-white/50 border-l border-gray-100">
                    {renderCellContent(item.gramatica)}
                  </td>

                  <td className="p-3 align-top bg-white/50 border-l border-gray-100">
                    {renderCellContent(item.clasificacion)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};