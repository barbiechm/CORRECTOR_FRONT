import { useState } from "react";
import { procesarExamenes } from "../../services/api";
import { ResultsDisplay } from "./ResultsDisplay";

export const CorrectorDashboard = () => {
  const [fileProf, setFileProf] = useState(null);
  const [fileEst, setFileEst] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCorregir = async () => {
    if (!fileProf || !fileEst) {
      alert("Sube ambos archivos por favor");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamamos a nuestro servicio (C#)
      const data = await procesarExamenes(fileProf, fileEst);
      setResultado(data); // Guardamos el JSON que nos dio C#
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está prendido?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          Corrector Automático 🤖
        </h1>

        {/* --- AREA DE CARGA --- */}
        <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Examen Profesor</label>
            <input
              type="file"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFileProf(e.target.files[0])}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Examen Alumno</label>
            <input
              type="file"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              onChange={(e) => setFileEst(e.target.files[0])}
            />
          </div>
        </div>

        {/* --- BOTÓN DE ACCIÓN --- */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCorregir}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? "Procesando..." : "✨ Corregir Examen"}
          </button>
        </div>

        {/* --- RESULTADOS (JSON PURO POR AHORA) --- */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {/* --- RESULTADOS VISUALES --- */}
        {error && (
          <p className="text-red-500 mt-4 text-center bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        {resultado && (
          <div className="mt-10">
            <ResultsDisplay data={resultado} />
          </div>
        )}
      </div>
    </div>
  );
};
