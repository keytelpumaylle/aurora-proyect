"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.TOKEN || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface Medication {
  id: string;
  name: string;
  description: string;
  indication: string;
  contraindication: string;
  dose: string;
  price: number;
  imageUrl: string;
  reason: string;
}

interface DosisRecomendada {
  medicamento: string;
  dosis: string;
  duracion: string;
}

interface ImageChatResponse {
  respuesta_gemini: string;
  medicamentos: Medication[];
  dosis_recomendada: DosisRecomendada[];
  es_receta_medica?: boolean;
  medicamentos_detectados?: string[];
  requiere_atencion_medica?: boolean;
  urgencia?: string;
  clasificacion?: string;
}

export async function analyzeImageAndSymptoms(
  formData: FormData
): Promise<ImageChatResponse | { error: string }> {
  try {
    const imageFile = formData.get("image") as File;
    const symptoms = formData.get("symptoms") as string;
    const userData = formData.get("userData") as string;
    const language = formData.get("language") as string || "es";

    if (!imageFile) {
      return { error: "No se proporcionó ninguna imagen" };
    }

    // Convertir imagen a base64
    const imageBytes = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBytes).toString('base64');

    // Mapeo de idiomas
    const languageInstructions = {
      'es': 'Responde SIEMPRE en español.',
      'en': 'ALWAYS respond in English.',
      'qu': 'Responde SIEMPRE en quechua (runasimi).',
      'pt': 'Responda SEMPRE em português.'
    };

    const selectedLanguageInstruction = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.es;

    const prompt = `
IMPORTANTE: ${selectedLanguageInstruction} Pero SIEMPRE devuelve la respuesta en formato JSON válido sin texto adicional.

Eres un asistente médico especializado. Tu primera tarea es determinar si la imagen subida es una RECETA MÉDICA o una imagen médica de síntomas/condiciones.

**Síntomas descritos:** ${symptoms}
**Datos del paciente:** ${userData}

**INSTRUCCIÓN PRINCIPAL: DETECTAR TIPO DE IMAGEN**

**PASO 1: ¿ES UNA RECETA MÉDICA?**
Busca estas características de una receta médica:
- Membrete de hospital, clínica o consultorio médico
- Nombre y datos del médico
- Lista de medicamentos prescritos
- Dosis y frecuencia de medicamentos
- Firma o sello médico
- Fecha de emisión
- Datos del paciente
- Formato típico de receta (papel blanco con texto formal)

**PASO 2: PROCESAR SEGÚN EL TIPO DE IMAGEN**

**SI ES UNA RECETA MÉDICA:**
1. Extrae TODOS los medicamentos mencionados
2. Extrae dosis y duración de cada medicamento
3. Proporciona información sobre cada medicamento detectado
4. NO hagas recomendaciones adicionales (solo informa lo que dice la receta)

**SI NO ES UNA RECETA MÉDICA:**
Procede con el análisis médico tradicional:
1. Examina cuidadosamente la imagen buscando síntomas físicos
2. Correlaciona con los síntomas descritos  
3. Haz recomendaciones apropiadas según la severidad

**SI LA IMAGEN NO ES NI RECETA NI MÉDICA:**
Indica que necesitas una imagen relevante (receta médica o imagen de síntomas).

CRÍTICO: Responde ÚNICAMENTE con un JSON válido. No agregues texto antes o después del JSON.

**FORMATO PARA RECETA MÉDICA DETECTADA:**
{
  "respuesta_gemini": "He detectado una receta médica. Aquí están los medicamentos prescritos que encontré en la imagen: [lista detallada]. Esta receta fue emitida por [nombre del médico/institución] en [fecha si es visible]. Recuerda seguir las indicaciones exactas del médico y consultar cualquier duda con él.",
  "es_receta_medica": true,
  "medicamentos_detectados": ["medicamento1", "medicamento2", "etc"],
  "medicamentos": [
    {
      "id": "1",
      "name": "Nombre del medicamento detectado",
      "description": "Descripción del medicamento y para qué sirve",
      "indication": "Indicaciones según la receta",
      "contraindication": "Contraindicaciones conocidas",
      "dose": "Dosis según la receta",
      "price": 25,
      "imageUrl": "https://via.placeholder.com/150",
      "reason": "Prescrito en la receta médica"
    }
  ],
  "dosis_recomendada": [
    {
      "medicamento": "Nombre del medicamento",
      "dosis": "Dosis exacta de la receta",
      "duracion": "Duración del tratamiento"
    }
  ],
  "clasificacion": "receta_medica"
}

**FORMATO PARA IMAGEN MÉDICA (NO RECETA) - CONDICIÓN LEVE:**
{
  "respuesta_gemini": "Análisis de los síntomas visibles en la imagen...",
  "es_receta_medica": false,
  "medicamentos": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "indication": "string",
      "contraindication": "string",
      "dose": "string",
      "price": 0,
      "imageUrl": "string",
      "reason": "string basado en hallazgos visuales"
    }
  ],
  "dosis_recomendada": [
    {
      "medicamento": "string",
      "dosis": "string",
      "duracion": "string"
    }
  ],
  "clasificacion": "leve"
}

**FORMATO PARA CONDICIONES MODERADAS/GRAVES:**
{
  "respuesta_gemini": "Análisis de la condición. Requiere atención médica profesional.",
  "es_receta_medica": false,
  "medicamentos": [],
  "dosis_recomendada": [],
  "requiere_atencion_medica": true,
  "urgencia": "moderada" | "alta",
  "clasificacion": "moderado" | "grave"
}

**FORMATO PARA IMAGEN NO VÁLIDA:**
{
  "respuesta_gemini": "La imagen proporcionada no parece ser una receta médica ni una imagen médica relevante. Por favor, sube una foto clara de una receta médica o una imagen que muestre tus síntomas físicos para poder ayudarte mejor.",
  "es_receta_medica": false,
  "medicamentos": [],
  "dosis_recomendada": [],
  "clasificacion": "imagen_no_valida"
}
`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: imageFile.type
      }
    };

    const response = await model.generateContent([prompt, imagePart]);
    const result = await response.response;
    
    if (!result.candidates || result.candidates.length === 0) {
      return { error: "No se pudo analizar la imagen" };
    }

    const responseText = result.candidates[0].content.parts[0]?.text || "";
    
    // Intentar múltiples formas de extraer JSON
    try {
      // Primero intentar parsear directamente
      const data = JSON.parse(responseText);
      // Asegurar que tiene la estructura correcta
      return {
        respuesta_gemini: data.respuesta_gemini || "",
        medicamentos: data.medicamentos || [],
        dosis_recomendada: data.dosis_recomendada || [],
        es_receta_medica: data.es_receta_medica || false,
        medicamentos_detectados: data.medicamentos_detectados || [],
        requiere_atencion_medica: data.requiere_atencion_medica || false,
        urgencia: data.urgencia || "",
        clasificacion: data.clasificacion || "leve"
      };
    } catch (error) {
      try {
        // Extraer JSON de markdown
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[1]);
          return {
            respuesta_gemini: data.respuesta_gemini || "",
            medicamentos: data.medicamentos || [],
            dosis_recomendada: data.dosis_recomendada || [],
            es_receta_medica: data.es_receta_medica || false,
            medicamentos_detectados: data.medicamentos_detectados || [],
            requiere_atencion_medica: data.requiere_atencion_medica || false,
            urgencia: data.urgencia || "",
            clasificacion: data.clasificacion || "leve"
          };
        } else {
          // Buscar cualquier objeto JSON en la respuesta
          const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonObjectMatch) {
            const data = JSON.parse(jsonObjectMatch[0]);
            return {
              respuesta_gemini: data.respuesta_gemini || "",
              medicamentos: data.medicamentos || [],
              dosis_recomendada: data.dosis_recomendada || [],
              es_receta_medica: data.es_receta_medica || false,
              medicamentos_detectados: data.medicamentos_detectados || [],
              requiere_atencion_medica: data.requiere_atencion_medica || false,
              urgencia: data.urgencia || "",
              clasificacion: data.clasificacion || "leve"
            };
          } else {
            throw new Error("No se encontró JSON válido en la respuesta");
          }
        }
      } catch (secondError) {
        console.error("Error parsing JSON:", error, "Response:", responseText,secondError);
        return { 
          error: "Error al procesar la respuesta de análisis. La IA no respondió en formato JSON válido." 
        };
      }
    }

  } catch (error) {
    console.error("Error analyzing image:", error);
    return { error: "Error al analizar la imagen" };
  }
}