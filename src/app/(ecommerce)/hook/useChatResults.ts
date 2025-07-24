import { useState, useEffect } from "react";

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

  useEffect(() => {
    const loadData = () => {
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
        setGeminiResponse(parsedData.respuesta_gemini);
        setMedications(parsedData.medicamentos);
        setDosis(parsedData.dosis_recomendada);
        setSintomas(userSymptoms || "");
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

  return { geminiResponse, medications, dosis, sintomas, loading };
};
