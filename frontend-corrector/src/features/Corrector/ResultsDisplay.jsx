import React from 'react';

// --- COMPONENTE NUEVO: Resaltador de Texto ---
// --- COMPONENTE MEJORADO: Resaltador de Texto ---
// --- COMPONENTE MEJORADO V3: Resaltador con Límites de Palabra ---
const StudentAnswerHighlighter = ({ text, keyText }) => {
  if (!text) return <span className="text-gray-400 italic">No respondió</span>;
  if (!keyText) return <span>{text}</span>;

  // 1. LIMPIEZA Y PREPARACIÓN DE KEYWORDS
  const labelsToRemove = [
    "persona:", "numero:", "número:", "tiempo:", "aspecto:", 
    "modo:", "tipo de conjugación:", "tipo de conjugacion:", 
    "vocal temática:", "vocal tematica:", "voz:", "flexión:", "flexion:", 
    "significado:", "estructura:"
  ];

  const labelsRegex = new RegExp(`(${labelsToRemove.join('|')})`, 'gi');
  
  // Limpiamos etiquetas y comillas de la CLAVE
  let cleanKey = keyText.replace(labelsRegex, ""); 
  cleanKey = cleanKey.replace(/["“”'']/g, ""); 

  // Generamos la lista de palabras/frases a buscar
  const keywords = cleanKey
    .split(/[,.;|-]|\s+o\s+/) // Separar por puntuación y por " o "
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0)
    .sort((a, b) => b.length - a.length); // Las frases largas primero

  if (keywords.length === 0) return <span>{text}</span>;

  // 2. CONSTRUCCIÓN DE REGEX INTELIGENTE (EL FIX) 🧠
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Definimos qué es una "letra" en español (incluye tildes, ñ, ü)
  const spanishChars = "a-zA-ZáéíóúÁÉÍÓÚñÑüÜ";
  
  // LOGICA DE FRONTERA:
  // (?<![...]) -> "Lookbehind Negativo": Que NO tenga una letra antes
  // ( ... )    -> El grupo de keywords
  // (?![...])  -> "Lookahead Negativo": Que NO tenga una letra después
  const patternString = `(?<![${spanishChars}])(${keywords.map(escapeRegExp).join('|')})(?![${spanishChars}])`;
  
  // Usamos try-catch por si el navegador es muy viejo y no soporta Lookbehind (raro hoy en día)
  let regex;
  try {
    regex = new RegExp(patternString, 'gi');
  } catch (e) {
    // Fallback simple si falla (sin fronteras estrictas para español)
    regex = new RegExp(`(${keywords.map(escapeRegExp).join('|')})`, 'gi');
  }

  // 3. DIVIDIR Y RENDERIZAR
  const parts = text.split(regex);

  return (
    <span className="leading-relaxed">
      {parts.map((part, i) => {
        const cleanPart = part.toLowerCase().replace(/["“”'']/g, "").trim();
        const isMatch = keywords.some(k => k === cleanPart);
        
        return isMatch ? (
          <span key={i} className="bg-green-100 text-green-800 font-bold px-1 rounded mx-0.5 border border-green-200 shadow-sm">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
};

export const ResultsDisplay = ({ data }) => {
  if (!data) return null;

  const {
    preguntas = [],
    puntajeTotal = 0,
    puntajeObtenido = 0,
    porcentajeGeneral = 0,
    correctas = 0,
    parciales = 0,
    incorrectas = 0,
    noRespondidas = 0
  } = data;

  const getStatusBadge = (estado) => {
    const badges = {
      "CORRECTO": "bg-green-100 text-green-800 border-green-200",
      "PARCIAL": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "INCORRECTO": "bg-red-100 text-red-800 border-red-200",
      "SIN_RESPONDER": "bg-gray-100 text-gray-800 border-gray-200"
    };
    const style = badges[estado] || badges["SIN_RESPONDER"];

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style}`}>
        {estado === "SIN_RESPONDER" ? "NO RESPONDIÓ" : estado}
      </span>
    );
  };

  const getProgressBar = (porcentaje) => {
    const color = porcentaje >= 60 ? 'bg-green-500' : porcentaje >= 30 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* --- TARJETAS DE RESUMEN --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 text-center transform hover:scale-105 transition-transform">
          <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">Calificación</h3>
          <div className={`text-5xl font-black ${porcentajeGeneral >= 60 ? 'text-green-600' : 'text-red-500'}`}>
            {porcentajeGeneral.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 mt-2 font-medium">
            {puntajeObtenido.toFixed(2)} / {puntajeTotal} pts
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200 text-center">
          <h3 className="text-green-700 font-bold uppercase text-xs mb-2">✓ Correctas</h3>
          <div className="text-4xl font-black text-green-600">{correctas}</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-200 text-center">
          <h3 className="text-yellow-700 font-bold uppercase text-xs mb-2">⚠️ Parciales</h3>
          <div className="text-4xl font-black text-yellow-600">{parciales}</div>
        </div>
        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200 text-center">
          <h3 className="text-red-700 font-bold uppercase text-xs mb-2">✗ Incorrectas</h3>
          <div className="text-4xl font-black text-red-600">{incorrectas + noRespondidas}</div>
        </div>
      </div>

      {/* --- TABLA DETALLADA --- */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5">
          <h3 className="font-bold text-white text-xl flex items-center gap-2">
            <span>📋</span> Detalle de Corrección
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
              <tr>
                <th className="p-4 text-left w-16">ID</th>
                <th className="p-4 text-left w-1/3">Pregunta (Clave)</th>
                <th className="p-4 text-center w-32">Puntaje</th>
                <th className="p-4 text-left">Respuesta Estudiante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {preguntas.map((pregunta, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  
                  {/* ID */}
                  <td className="p-4 align-top font-mono text-indigo-600 font-bold text-center">
                    {pregunta.id}
                  </td>

                  {/* PREGUNTA (ESPERADA) */}
                  <td className="p-4 align-top">
                    {pregunta.palabraObjetivo && (
                      <div className="mb-1">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold">
                          {pregunta.palabraObjetivo}
                        </span>
                      </div>
                    )}
                    <div className="text-gray-600 text-xs italic leading-relaxed">
                      {pregunta.textoCompleto}
                    </div>
                  </td>

                  {/* PUNTAJE Y ESTADO */}
                  <td className="p-4 align-top text-center">
                    <div className="flex flex-col items-center gap-2">
                      {getStatusBadge(pregunta.estado)}
                      
                      <div className="font-bold text-gray-800">
                        {pregunta.puntosGanados.toFixed(2)} <span className="text-gray-400 text-xs font-normal">/ {pregunta.puntosTotales}</span>
                      </div>
                      
                      <div className="w-16">
                        {getProgressBar(pregunta.porcentajeAcierto)}
                      </div>
                    </div>
                  </td>

                  {/* RESPUESTA ESTUDIANTE (CON HIGHLIGHTER) */}
                  <td className="p-4 align-top">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700 font-medium leading-relaxed">
                      {/* Usamos el nuevo componente aquí */}
                      <StudentAnswerHighlighter 
                        text={pregunta.respuestaEstudiante} 
                        keyText={pregunta.textoCompleto} 
                      />
                    </div>
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