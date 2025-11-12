import { useState, useEffect } from "react";
import { chatDB } from "@/lib/db";

interface Medication {
  id: number;
  name: string;
  description: string;
  indication: string;
  contraindication: string;
  dose: string;
  price: number;
  reason: string;
  imageUrl: string;
}

interface ChatResults {
  respuesta_gemini: string;
  medicamentos: Medication[];
  dosis_recomendada: Dosis[];
  imageData?: string;
  clasificacion?: string;
  requiere_atencion_medica?: boolean;
  urgencia?: string;
  es_receta_medica?: boolean;
  medicamentos_detectados?: string[];
  diagnostico_preliminar?: string;
  precision_diagnostico?: string;
}

interface Dosis {
  medicamento: string;
  dosis: string;
  duracion: string;
}

const STORAGE_EVENT = "chatResultsUpdated";

export const useChatResults = () => {
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [dosis, setDosis] = useState<Dosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [sintomas, setSintomas] = useState<string>("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [clasificacion, setClasificacion] = useState<string>("");
  const [requiereAtencionMedica, setRequiereAtencionMedica] = useState<boolean>(false);
  const [urgencia, setUrgencia] = useState<string>("");
  const [esRecetaMedica, setEsRecetaMedica] = useState<boolean>(false);
  const [medicamentosDetectados, setMedicamentosDetectados] = useState<string[]>([]);
  const [diagnosticoPreliminar, setDiagnosticoPreliminar] = useState<string>("");
  const [precisionDiagnostico, setPrecisionDiagnostico] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const storedData = sessionStorage.getItem("chatResults");
      if (!storedData) {
        window.location.href = "/";
        return;
      }
      try {
        const userData = sessionStorage.getItem("userData");
        const userSymptoms = sessionStorage.getItem("userSymptoms");
        const parsedData: ChatResults = JSON.parse(storedData);
        
        if (!userData || userData === "null") {
          sessionStorage.removeItem("chatResults");
          sessionStorage.removeItem("userSymptoms");
          sessionStorage.removeItem("userData");
          window.location.href = "/";
          return;
        }

        // Guardar en IndexedDB para persistencia
        try {
          await chatDB.saveChat({
            sintomas: userSymptoms || "",
            userData: JSON.parse(userData),
            respuesta_gemini: parsedData.respuesta_gemini,
            medicamentos: parsedData.medicamentos,
            dosis_recomendada: parsedData.dosis_recomendada || [],
            imageData: parsedData.imageData
          });
        } catch (dbError) {
          console.warn("Error saving to IndexedDB:", dbError);
        }
        
        setGeminiResponse(parsedData.respuesta_gemini);
        setMedications(parsedData.medicamentos);
        setDosis(parsedData.dosis_recomendada || []);
        setSintomas(userSymptoms || "");
        setImageData(parsedData.imageData || null);
        setClasificacion(parsedData.clasificacion || "leve");
        setRequiereAtencionMedica(parsedData.requiere_atencion_medica || false);
        setUrgencia(parsedData.urgencia || "");
        setEsRecetaMedica(parsedData.es_receta_medica || false);
        setMedicamentosDetectados(parsedData.medicamentos_detectados || []);
        setDiagnosticoPreliminar(parsedData.diagnostico_preliminar || "");
        setPrecisionDiagnostico(parsedData.precision_diagnostico || "");
        setLoading(false);
      } catch (error) {
        console.error("Error al parsear los datos:", error);
        window.location.href = "/";
        sessionStorage.removeItem("chatResults");
        sessionStorage.removeItem("userSymptoms");
        sessionStorage.removeItem("userData");
      }
    };

    // Cargar datos iniciales
    loadData();

    // Escuchar eventos de actualización
    window.addEventListener(STORAGE_EVENT, loadData);
    return () => window.removeEventListener(STORAGE_EVENT, loadData);
  }, []);

  return {
    geminiResponse,
    medications,
    dosis,
    sintomas,
    loading,
    imageData,
    clasificacion,
    requiereAtencionMedica,
    urgencia,
    esRecetaMedica,
    medicamentosDetectados,
    diagnosticoPreliminar,
    precisionDiagnostico
  };
};
