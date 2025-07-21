'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProducts } from "./Products";

const genAI = new GoogleGenerativeAI(process.env.TOKEN || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface Medicamento {
    id: number;
    name: string;
    description: string;
    indication: string;
    contraindication: string;
    dose: string;
    price: number;
    reason: string;
  }
  
  interface SuccessResponse {
    respuesta_gemini: string;
    medicamentos: Medicamento[];
  }
  
  interface ErrorResponse {
    error: string;
  }
  
  type APIResponse = SuccessResponse | ErrorResponse;
  
  // Si necesitas tipar el state (aunque en tu código actual no se usa)
  interface AppState {
    // Agrega aquí las propiedades adicionales del estado si las tienes
    response?: APIResponse;
    loading?: boolean;
  }
  

export async function indication(state: AppState, formData: FormData) {
    const text = formData.get('indication'); // No asumas que siempre es string
    const products = await getProducts();

    try {
        const prompt = `
            Eres un asistente médico experto. Tu tarea es:

            1. Analizar los síntomas descritos por el usuario: "${text}"
            

            2. Revisar la lista de medicamentos disponibles: ${JSON.stringify(products)}

            3. DEBES:
            - Recomendar solo medicamentos que estén en la lista proporcionada.
            - Predecir su posible sintoma que pueda tener, dependiendo de los malestares del usuario
            - Mencionar las dosis recomendadas según la información disponible.
            - Advertir sobre posibles contraindicaciones.
            - Devolver la respuesta en un objeto JSON que contenga un campo "respuesta_gemini" con tu respuesta en texto enriquecido, y un campo "medicamentos" que sea un array de objetos con la información de los medicamentos recomendados.

            4. NO DEBES:
            - Recomendar medicamentos que no estén en la lista.
            - Dar diagnósticos médicos definitivos.
            - Reemplazar la consulta con un profesional de la salud.
            - Devolver texto adicional fuera del objeto JSON.

            5. Formato de respuesta (JSON):
            {
                "respuesta_gemini": "string", // Texto enriquecido con la respuesta a la consulta del usuario
                "medicamentos": [
                    {
                        "id": number,
                        "name": "string",
                        "description": "string",
                        "indication": "string",
                        "contraindication": "string",
                        "dose": "string",
                        "price": number,
                        "imageUrl": "string",
                        "reason": "Explicación de por qué se recomienda este medicamento"
                    },
                    ...
                ]
            }
            6. Si la respuesta que brindas no tiene un medicamento, puedes darle sus recomendacion, y el JSON para el medicamento mandalo vacio, para que no haya error en las consultas.
            7.Indicaiones adicionales: La farmacia esta ubicada en Perú, por ende va a ver usuarios que usen jergas peruanas, por favor analiza las jergas como:
            cachar = Tener relaciones sexuales
            hoy soy con mi flaca = tener relaciones sexuales
            hoy campeono = tener relaciones sexuales.
            Prosigue con el analisis de los sintomas
            estoy crudo = tengo resaca.
            Ten en cuenta estas jergas para que puedas entender mejor el sintoma y asi poder recomendarle al usuario el medicamento que el necesita.
            Por favor, analiza los síntomas y proporciona recomendaciones basadas en los medicamentos disponibles.
            "
            `;

        const response = await model.generateContent([
            { text: prompt }
        ]);

        const apiResponse = await response.response;
        

        if (!apiResponse.candidates || apiResponse.candidates.length === 0) {
            console.error("Error: No se recibieron candidatos en la respuesta de la API.");
            return { error: "No se pudo obtener una respuesta de la API." };
        }

        const content = apiResponse.candidates[0].content;

        if (!content || !content.parts || content.parts.length === 0) {
            console.error("Error: La respuesta de la API no contiene contenido válido.");
            return { error: "La respuesta de la API está vacía o tiene un formato incorrecto." };
        }
        let responseText = content.parts[0]?.text || ""; // Maneja el caso de que sea null o undefined

        // Extraer el JSON de la cadena, eliminando markdown
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            responseText = jsonMatch[1];
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (error) {
            console.error("Error al analizar la respuesta JSON:", error, "Respuesta de la API:", responseText);
            return { error: "Error al procesar la respuesta de la API.  Respuesta de la API:" + responseText };
        }

        // Valida que la respuesta sea un objeto y contenga las propiedades esperadas.
        if (typeof data === 'object' && data !== null && 'respuesta_gemini' in data && 'medicamentos' in data && Array.isArray(data.medicamentos)) {
            console.log('Salida de la API:', data);
            return data;
        } else {
            console.error("Error: La API no devolvió un objeto con el formato esperado.", data);
            return { error: "La API no devolvió un objeto con el formato esperado. Respuesta recibida: " + responseText };
        }

    } catch (error: unknown) {
        console.error("Error al llamar a la API de Gemini:", error);
        return { error: `Error al llamar a la API: ${error instanceof Error ? error.message : 'Error desconocido'}` };
    }
}