import { useState } from "react";
import { procesarExamenes } from "../../services/api"; 
import { ResultsDisplay } from "./ResultsDisplay";
// Ya no necesitamos importar DebugInspector ni debugExamenes

export const CorrectorDashboard = () => {
  const [fileProf, setFileProf] = useState(null);
  const [fileEst, setFileEst] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCorregir = async () => {
    if (!fileProf || !fileEst) {
      alert("⚠️ Por favor selecciona ambos archivos Word (.docx)");
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const data = await procesarExamenes(fileProf, fileEst);
      console.log('✅ Resultados recibidos:', data);
      setResultado(data);
    } catch (err) {
      console.error('❌ Error en frontend:', err);
      setError(err.message || "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFileProf(null);
    setFileEst(null);
    setResultado(null);
    setError(null);
    const inputProf = document.getElementById('input-prof');
    const inputEst = document.getElementById('input-est');
    if (inputProf) inputProf.value = "";
    if (inputEst) inputEst.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-3 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Corrector Inteligente
            </span> de Lingüística
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Sube el examen clave y la respuesta del estudiante. El sistema analizará semánticamente las coincidencias.
          </p>
        </div>

        {/* --- INPUTS --- */}
        {!resultado && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 mb-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Input Profesor */}
              <div className="group">
                <label className="block font-bold text-blue-900 mb-2">1. Examen Clave (Profesor)</label>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${fileProf ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                  
                  <input
                    id="input-prof"
                    type="file"
                    accept=".docx"
                    className="hidden"
                    onChange={(e) => setFileProf(e.target.files[0])}
                  />
                  <label htmlFor="input-prof" className="cursor-pointer w-full h-full block">
                    <div className="text-4xl mb-2">📘</div>
                    <span className="font-medium text-slate-600">
                      {fileProf ? fileProf.name : "Click para subir .docx"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Input Estudiante */}
              <div className="group">
                <label className="block font-bold text-green-900 mb-2">2. Respuesta Estudiante</label>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${fileEst ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-green-400 hover:bg-slate-50'}`}>
                  
                  <input
                    id="input-est"
                    type="file"
                    accept=".docx"
                    className="hidden"
                    onChange={(e) => setFileEst(e.target.files[0])}
                  />
                  <label htmlFor="input-est" className="cursor-pointer w-full h-full block">
                    <div className="text-4xl mb-2">🎓</div>
                    <span className="font-medium text-slate-600">
                      {fileEst ? fileEst.name : "Click para subir .docx"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* --- BOTÓN ÚNICO DE ACCIÓN --- */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleCorregir}
                disabled={loading || !fileProf || !fileEst}
                className="bg-blue-600 text-white px-12 py-4 rounded-full font-bold text-lg 
                  hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed 
                  transition-all transform active:scale-95 flex items-center gap-3 shadow-blue-200"
              >
                {loading ? "Procesando..." : "✨ Corregir Ahora"}
              </button>
            </div>
          </div>
        )}

        {/* --- ERROR --- */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">⚠️</div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-bold">Error al procesar</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- RESULTADOS --- */}
        {resultado && (
          <div className="animate-fade-in">
             <div className="flex justify-end mb-4">
                <button onClick={handleReset} className="text-sm font-bold text-gray-500 hover:text-blue-600 underline">
                  ← Corregir otro examen
                </button>
             </div>
             <ResultsDisplay data={resultado} />
          </div>
        )}
      </div>
    </div>
  );
};