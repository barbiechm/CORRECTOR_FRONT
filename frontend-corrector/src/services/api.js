// URL base del backend C#
const API_URL = (import.meta.env.VITE_API_URL || "https://localhost:7180") + "/api/examen";

export const procesarExamenes = async (archivoClave, archivoRespuestas) => {
  const formData = new FormData();
  
  // ⚠️ IMPORTANTE: Los nombres deben coincidir con el Controller
  formData.append("archivoClave", archivoClave);
  formData.append("archivoRespuestas", archivoRespuestas);

  try {
    const response = await fetch(`${API_URL}/comparar`, {
      method: "POST",
      body: formData,
      // NO agregues 'Content-Type', fetch lo hace automáticamente con FormData
    });

    // Si hay error, capturamos el mensaje del servidor
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: No se pudo procesar`);
    }

    // Retornamos el JSON con los resultados
    return await response.json();
    
  } catch (error) {
    console.error("❌ Error de conexión con el servidor:", error);
    throw error;
  }
};

export const debugExamenes = async (archivoClave, archivoEstudiante) => {
  const formData = new FormData();
  if (archivoClave) formData.append("archivoClave", archivoClave);
  if (archivoEstudiante) formData.append("archivoEstudiante", archivoEstudiante);

  const response = await fetch(`${API_URL}/debug-extraccion`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Error en debug");
  return await response.json();
};