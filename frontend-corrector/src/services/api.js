// src/services/api.js

// URL que viste en tu consola negra de C#
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:7180") + "/api/Corrector"; 

export const procesarExamenes = async (archivoProfesor, archivoEstudiante) => {
  const formData = new FormData();
  formData.append("archivoProfesor", archivoProfesor);
  formData.append("archivoEstudiante", archivoEstudiante);

  try {
    const response = await fetch(`${API_URL}/procesar`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al procesar los archivos en el servidor.");
    }

    // Retornamos el JSON listo para usar
    return await response.json(); 
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
};